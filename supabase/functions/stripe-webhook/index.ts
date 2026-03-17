// supabase/functions/stripe-webhook/index.ts
// Production-ready Stripe webhook handler for subscription lifecycle management.
//
// Handled events:
//   - checkout.session.completed   → activate plan, send confirmation email
//   - customer.subscription.updated → sync status, detect cancellation, track period end
//   - customer.subscription.deleted → downgrade to free when period ends
//   - invoice.payment_failed       → mark payment failure, notify user
//
// Security:
//   - Webhook signature verified via STRIPE_WEBHOOK_SECRET
//   - All DB writes use service role (bypasses RLS)
//   - Users cannot modify subscription state directly
//
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt

import Stripe from "npm:stripe@13.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

// ── Helper: send email via send-email edge function ───────
async function sendEmail(payload: Record<string, unknown>) {
  try {
    await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Email send failed (non-blocking):", e);
  }
}

// ── Helper: find profile by Stripe customer ID ────────────
async function findProfileByCustomerId(customerId: string) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, plan, subscription_status")
    .eq("stripe_customer_id", customerId)
    .single();
  return data;
}

Deno.serve(async (req) => {
  // ── Verify Stripe webhook signature ─────────────────────
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("No signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") as string
    );
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  // ── Route events ────────────────────────────────────────
  switch (event.type) {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CHECKOUT COMPLETED — new subscription or one-time purchase
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      // ── ONE-TIME PAYMENT (Add-Ons) ─────────────────────
      if (session.mode === "payment") {
        const addonType = session.metadata?.addon_type;
        const supabaseUserId = session.metadata?.supabase_user_id;

        if (!supabaseUserId) {
          console.error("No supabase_user_id in session metadata for add-on purchase");
          break;
        }

        if (addonType === "mock_pack") {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("mock_sessions_purchased")
            .eq("id", supabaseUserId)
            .single();

          const currentSessions = profile?.mock_sessions_purchased || 0;
          const sessionsToAdd = parseInt(session.metadata?.sessions_count || "3", 10);

          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              mock_sessions_purchased: currentSessions + sessionsToAdd,
              stripe_customer_id: customerId,
            })
            .eq("id", supabaseUserId);

          if (error) {
            console.error("Error adding mock sessions:", error);
          } else {
            await sendEmail({ type: "mock_pack", userId: supabaseUserId, data: { sessions: String(sessionsToAdd) } });
          }

        } else if (addonType === "express_unlock") {
          const unlockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ express_unlock_until: unlockUntil, stripe_customer_id: customerId })
            .eq("id", supabaseUserId);

          if (error) {
            console.error("Error activating express unlock:", error);
          } else {
            await sendEmail({ type: "express_unlock", userId: supabaseUserId });
          }
        }
        break;
      }

      // ── SUBSCRIPTION PURCHASE ──────────────────────────
      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const plan = subscription.metadata?.plan || "pro";
      const supabaseUserId = subscription.metadata?.supabase_user_id;

      const updateData = {
        plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: subscription.status || "active",
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      };

      let result;
      if (supabaseUserId) {
        result = await supabaseAdmin
          .from("profiles")
          .update(updateData)
          .eq("id", supabaseUserId);
      } else {
        result = await supabaseAdmin
          .from("profiles")
          .update(updateData)
          .eq("stripe_customer_id", customerId);
      }

      if (result.error) {
        console.error("Error updating profile:", result.error);
      } else {
        // Send plan confirmation email
        await sendEmail({ type: "plan_confirmation", userId: supabaseUserId, plan });
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SUBSCRIPTION UPDATED — status changes, cancellation, renewal
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const previousAttributes = (event.data as any).previous_attributes || {};

      // Determine the appropriate status for our DB
      let dbStatus = subscription.status; // 'active', 'past_due', 'canceled', etc.

      // If the user has requested cancellation at period end, mark as 'cancelling'
      // so the UI can show "Your plan is active until {date}"
      if (subscription.cancel_at_period_end && subscription.status === "active") {
        dbStatus = "cancelling";
      }

      // If the user just un-cancelled (resubscribed before period end)
      if (previousAttributes.cancel_at_period_end === true && !subscription.cancel_at_period_end) {
        dbStatus = "active";
      }

      const updatePayload: Record<string, unknown> = {
        subscription_status: dbStatus,
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      };

      // If the plan changed (upgrade/downgrade), update it
      if (subscription.metadata?.plan) {
        updatePayload.plan = subscription.metadata.plan;
      }

      const { error } = await supabaseAdmin
        .from("profiles")
        .update(updatePayload)
        .eq("stripe_subscription_id", subscription.id);

      if (error) console.error("Error updating subscription:", error);
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SUBSCRIPTION DELETED — period ended or immediate cancellation
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Check if customer has other active subscriptions before downgrading.
      // This handles the case where a user upgrades (Pro → Premium) and the
      // old subscription gets cancelled while the new one is active.
      const activeSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      const trialSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });

      if (activeSubs.data.length === 0 && trialSubs.data.length === 0) {
        // No other active subscriptions → truly cancelled, downgrade to free
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "cancelled",
            // Keep stripe_customer_id so they can resubscribe easily
            // Clear subscription-specific fields
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        // Send cancellation confirmation email
        const profile = await findProfileByCustomerId(customerId);
        if (profile?.id) {
          await sendEmail({ type: "cancellation_confirmation", userId: profile.id });
        }
      }
      // Otherwise: another sub is active (upgrade in progress), don't touch the plan
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INVOICE PAYMENT FAILED — card declined, expired, etc.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        // Mark subscription as past_due in our DB
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("stripe_subscription_id", subscriptionId);

        // Notify the user about the payment failure
        const profile = await findProfileByCustomerId(customerId);
        if (profile?.id) {
          await sendEmail({
            type: "payment_failed",
            userId: profile.id,
            data: { attempt: String(invoice.attempt_count || 1) },
          });
        }
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
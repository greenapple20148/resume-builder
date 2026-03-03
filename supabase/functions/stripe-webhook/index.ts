// supabase/functions/stripe-webhook/index.ts
import Stripe from "npm:stripe@13.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

Deno.serve(async (req) => {
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
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      // ── ONE-TIME PAYMENT (Add-Ons) ─────────────────
      if (session.mode === "payment") {
        const addonType = session.metadata?.addon_type;
        const supabaseUserId = session.metadata?.supabase_user_id;

        if (!supabaseUserId) {
          console.error("No supabase_user_id in session metadata for add-on purchase");
          break;
        }

        if (addonType === "mock_pack") {
          // Add 3 mock interview sessions
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("mock_sessions_purchased")
            .eq("id", supabaseUserId)
            .single();

          const currentSessions = profile?.mock_sessions_purchased || 0;
          const sessionsToAdd = parseInt(session.metadata?.sessions_count || "3", 10);
          const newTotal = currentSessions + sessionsToAdd;

          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              mock_sessions_purchased: newTotal,
              stripe_customer_id: customerId,
            })
            .eq("id", supabaseUserId);

          if (error) {
            console.error("Error adding mock sessions:", error);
          } else {
            // Send confirmation email
            try {
              await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({
                  type: "mock_pack",
                  userId: supabaseUserId,
                  data: { sessions: String(sessionsToAdd) },
                }),
              });
            } catch (e) { console.error("Mock pack email failed:", e); }
          }

        } else if (addonType === "express_unlock") {
          // Activate 24-hour Pro access
          const unlockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              express_unlock_until: unlockUntil,
              stripe_customer_id: customerId,
            })
            .eq("id", supabaseUserId);

          if (error) {
            console.error("Error activating express unlock:", error);
          } else {
            // Send confirmation email
            try {
              await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({
                  type: "express_unlock",
                  userId: supabaseUserId,
                }),
              });
            } catch (e) { console.error("Express unlock email failed:", e); }
          }
        }

        break;
      }

      // ── SUBSCRIPTION PURCHASE ──────────────────────
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
        // Send plan confirmation email (non-blocking)
        try {
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({
              type: "plan_confirmation",
              userId: supabaseUserId,
              plan,
            }),
          });
        } catch (emailErr) {
          console.error("Email send failed (non-blocking):", emailErr);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Check if customer has other active subscriptions before downgrading
      // (handles Pro→Premium upgrade where old sub is cancelled)
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
        // No other active subs → truly cancelled, downgrade to free
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "cancelled",
          })
          .eq("stripe_customer_id", customerId);
      }
      // Otherwise: another sub is active (upgrade in progress), don't touch the plan
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      if (error) console.error("Error updating subscription:", error);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
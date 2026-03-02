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
      const subscriptionId = session.subscription as string;

      // Retrieve the subscription to get metadata and period info
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Plan metadata is on the subscription (set via subscription_data.metadata in checkout)
      const plan = subscription.metadata?.plan || "pro";
      const supabaseUserId = subscription.metadata?.supabase_user_id;

      const updateData = {
        plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: subscription.status || "active",
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      };

      // Try user ID first (most reliable), then fall back to customer ID
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

      if (result.error) console.error("Error updating profile:", result.error);
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
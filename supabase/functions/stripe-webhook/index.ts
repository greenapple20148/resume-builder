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

      // In checkout session metadata, we passed the plan name
      const plan = session.subscription_data?.metadata?.plan || "pro";

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: "active",
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      if (error) console.error("Error updating profile:", error);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "cancelled",
        })
        .eq("stripe_subscription_id", subscription.id);
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
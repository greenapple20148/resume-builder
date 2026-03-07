// supabase/functions/create-checkout/index.ts
// Creates a Stripe Checkout session for subscription plans.
// Price IDs are resolved server-side from secrets — never sent from the client.

import Stripe from "npm:stripe@13.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

// ── Resolve Stripe Price ID from secrets ─────────────────
// Maps plan + billing period → Supabase secret name
function resolvePriceId(plan: string, billing: string): string | null {
  const map: Record<string, string> = {
    "pro_monthly": "STRIPE_PRO_MONTHLY_PRICE_ID",
    "pro_annual": "STRIPE_PRO_ANNUAL_PRICE_ID",
    "premium_monthly": "STRIPE_PREMIUM_MONTHLY_PRICE_ID",
    "premium_annual": "STRIPE_PREMIUM_ANNUAL_PRICE_ID",
    "career_plus_monthly": "STRIPE_CAREER_PLUS_MONTHLY_PRICE_ID",
    "career_plus_annual": "STRIPE_CAREER_PLUS_ANNUAL_PRICE_ID",
    "founding_annual": "STRIPE_FOUNDING_ANNUAL_PRICE_ID",
  };

  const key = `${plan}_${billing}`;
  const secretName = map[key];
  if (!secretName) return null;

  return Deno.env.get(secretName) || null;
}

// ── Trial days per plan ──────────────────────────────────
function getTrialDays(plan: string): number | undefined {
  const trials: Record<string, number> = {
    pro: 7,
  };
  return trials[plan];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) throw new Error("No auth header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Accept both old format (priceId) and new format (plan + billing)
    const body = await req.json();
    const { plan, billing, trialDays: clientTrialDays } = body;
    let priceId = body.priceId; // Legacy: client-provided priceId

    // New secure flow: resolve price ID from secrets
    if (!priceId && plan && billing) {
      priceId = resolvePriceId(plan, billing);
      if (!priceId) {
        throw new Error(`Price not configured for ${plan}/${billing}. Set the secret: STRIPE_${plan.toUpperCase()}_${billing.toUpperCase()}_PRICE_ID`);
      }
    }

    if (!priceId) {
      throw new Error("Missing plan/billing or priceId");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single();

    if (plan === "founding") {
      const { count } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("plan", "founding");

      if (count !== null && count >= 100) {
        throw new Error("The Founding Member offer has sold out. Please choose another plan.");
      }
    }

    let customerId = profile?.stripe_customer_id;

    // --- CUSTOMER CREATION PART ---
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin.from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    } else {
      // Cancel any existing subscriptions to prevent duplicates
      const existingSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
      });
      const trialSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
      });
      const allSubs = [...existingSubs.data, ...trialSubs.data];
      for (const sub of allSubs) {
        await stripe.subscriptions.cancel(sub.id);
      }
    }
    // ------------------------------

    const appUrl = Deno.env.get("APP_URL") || "https://resumebuildin.com";
    const trialPeriodDays = clientTrialDays || getTrialDays(plan) || undefined;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/welcome`,
      cancel_url: `${appUrl}/pricing?cancelled=true`,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
        trial_period_days: trialPeriodDays,
      },
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

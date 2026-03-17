// supabase/functions/cancel-subscription/index.ts
// Cancels user's Stripe subscription at end of billing period.
// Does NOT immediately revoke access — user keeps plan until current_period_end.
// Deploy: supabase functions deploy cancel-subscription

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

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // ── 1. Authenticate the user ──────────────────────
        const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
        if (!authHeader) throw new Error("No auth header");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_ANON_KEY") as string,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        // ── 2. Fetch profile with admin client (bypasses RLS) ──
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
        );

        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("stripe_subscription_id, stripe_customer_id, plan, subscription_period_end")
            .eq("id", user.id)
            .single();

        if (!profile?.stripe_subscription_id) {
            throw new Error("No active subscription found.");
        }

        // ── 3. Cancel at period end in Stripe ─────────────
        // This sets cancel_at_period_end: true on the subscription.
        // The subscription remains active until current_period_end.
        // Stripe will fire customer.subscription.updated (with cancel_at_period_end: true)
        // and later customer.subscription.deleted when the period actually ends.
        const subscription = await stripe.subscriptions.update(
            profile.stripe_subscription_id,
            { cancel_at_period_end: true }
        );

        const periodEnd = new Date(subscription.current_period_end * 1000);
        const periodEndISO = periodEnd.toISOString();
        const periodEndFormatted = periodEnd.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        // ── 4. Update profile status ──────────────────────
        // Mark as "cancelling" so the UI can show the cancellation state.
        // The plan itself stays active until the webhook fires customer.subscription.deleted.
        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_status: "cancelling",
                subscription_period_end: periodEndISO,
            })
            .eq("id", user.id);

        return new Response(
            JSON.stringify({
                success: true,
                message: `Your subscription will remain active until ${periodEndFormatted}. After that, you'll be moved to the Free plan.`,
                periodEnd: periodEndISO,
                periodEndFormatted,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return new Response(
            JSON.stringify({ success: false, error: message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

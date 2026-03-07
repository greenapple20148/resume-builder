// supabase/functions/purchase-mock-pack/index.ts
// Creates a Stripe Checkout session for the 3 Interview Mock Pack (one-time $4.99)
// After successful payment, stripe-webhook activates the sessions.

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
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // ── Authenticate user ────────────────────────────
        const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
        if (!authHeader) throw new Error("No auth header");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_ANON_KEY") as string,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        // ── Get or create Stripe customer ────────────────
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
        );

        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("stripe_customer_id, email, full_name")
            .eq("id", user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: profile?.email || user.email,
                name: profile?.full_name || undefined,
                metadata: { supabase_user_id: user.id },
            });
            customerId = customer.id;

            await supabaseAdmin
                .from("profiles")
                .update({ stripe_customer_id: customerId })
                .eq("id", user.id);
        }

        // ── Create checkout session ──────────────────────
        const appUrl = Deno.env.get("APP_URL") || "https://resumebuildin.com";
        const priceId = Deno.env.get("MOCK_PACK_PRICE_ID");

        if (!priceId) {
            throw new Error("MOCK_PACK_PRICE_ID is not configured. Set it via: supabase secrets set MOCK_PACK_PRICE_ID=price_xxx");
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "payment",  // One-time payment
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${appUrl}/tools/mock-interview?purchased=mock_pack`,
            cancel_url: `${appUrl}/pricing?cancelled=true`,
            metadata: {
                supabase_user_id: user.id,
                addon_type: "mock_pack",
                sessions_count: "3",
            },
        });

        return new Response(
            JSON.stringify({ url: session.url }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

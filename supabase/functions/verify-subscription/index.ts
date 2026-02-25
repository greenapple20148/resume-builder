// supabase/functions/verify-subscription/index.ts
// Client calls this after checkout to sync stripe subscription → profile.plan
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
        const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
        if (!authHeader) throw new Error("No auth header");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_ANON_KEY") as string,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        // Get profile to find stripe_customer_id
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
        );

        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("stripe_customer_id, plan")
            .eq("id", user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return new Response(JSON.stringify({ plan: profile?.plan || "free", synced: false }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Fetch all active + trialing subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: profile.stripe_customer_id,
            status: "active",
            limit: 10,
        });

        const trialSubs = await stripe.subscriptions.list({
            customer: profile.stripe_customer_id,
            status: "trialing",
            limit: 10,
        });

        const allSubs = [...subscriptions.data, ...trialSubs.data];

        if (allSubs.length === 0) {
            await supabaseAdmin
                .from("profiles")
                .update({ plan: "free", subscription_status: "none" })
                .eq("id", user.id);

            return new Response(JSON.stringify({ plan: "free", synced: true }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Premium price IDs from env
        const premiumPriceIds = [
            Deno.env.get("VITE_STRIPE_TEAM_MONTHLY_PRICE_ID"),
            Deno.env.get("VITE_STRIPE_TEAM_ANNUAL_PRICE_ID"),
        ].filter(Boolean);

        // Determine plan for each subscription — prefer metadata, then check price ID
        const determinePlan = (sub: any): string => {
            if (sub.metadata?.plan) return sub.metadata.plan;
            // Check if any item's price matches premium price IDs
            const priceIds = sub.items?.data?.map((item: any) => item.price?.id) || [];
            if (priceIds.some((id: string) => premiumPriceIds.includes(id))) return "premium";
            return "pro";
        };

        // Pick the highest-tier subscription (premium > pro)
        const tierOrder: Record<string, number> = { free: 0, pro: 1, premium: 2 };
        let bestPlan = "pro";
        let bestSub = allSubs[0];
        for (const sub of allSubs) {
            const plan = determinePlan(sub);
            if ((tierOrder[plan] || 0) > (tierOrder[bestPlan] || 0)) {
                bestPlan = plan;
                bestSub = sub;
            }
        }

        // Update profile
        await supabaseAdmin
            .from("profiles")
            .update({
                plan: bestPlan,
                stripe_subscription_id: bestSub.id,
                subscription_status: bestSub.status,
                subscription_period_end: new Date(bestSub.current_period_end * 1000).toISOString(),
            })
            .eq("id", user.id);

        return new Response(JSON.stringify({ plan: bestPlan, synced: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

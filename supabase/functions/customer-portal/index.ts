// supabase/functions/customer-portal/index.ts
// Deploy with: supabase functions deploy customer-portal

import Stripe from "npm:stripe@13.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  // Deno provides fetch; no custom httpClient needed
});

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1) Validate Authorization header and extract bearer
    const rawAuth = req.headers.get("authorization") || req.headers.get("Authorization") || "";
    if (!rawAuth.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or malformed Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = rawAuth.split(" ")[1];

    // 2) User-scoped Supabase client (RLS as the user)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // 3) Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4) Admin client for privileged read
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileErr) {
      return new Response(JSON.stringify({ error: `Profile fetch failed: ${profileErr.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!profile?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "No Stripe customer found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5) Create Stripe Billing Portal Session
    const appUrl = Deno.env.get("APP_URL") || "https://resumebuildin.com";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
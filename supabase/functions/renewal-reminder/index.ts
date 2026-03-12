// supabase/functions/renewal-reminder/index.ts
// Sends email reminders to users whose subscriptions renew within 7 days.
// Designed to be called by Supabase cron job (pg_cron) or external scheduler.
//
// Cron setup (run daily at 10am UTC):
//   SELECT cron.schedule('renewal-reminders', '0 10 * * *',
//     $$ SELECT net.http_post(
//       url := 'https://qirpymijflyopppicacz.supabase.co/functions/v1/renewal-reminder',
//       headers := jsonb_build_object(
//         'Content-Type', 'application/json',
//         'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
//       ),
//       body := '{}'::jsonb
//     ) $$
//   );
//
// Deploy: supabase functions deploy renewal-reminder --no-verify-jwt

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

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
        // ── 1. Verify caller is authorized (service role or cron) ──
        const authHeader = req.headers.get("Authorization") || "";
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

        // Accept service role key directly (for cron jobs)
        if (!authHeader.includes(serviceRoleKey)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized — this endpoint requires service role access." }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            serviceRoleKey
        );

        // ── 2. Find users whose subscription renews within 7 days ──
        // Only send to users with active subscriptions (not already cancelling).
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        // Also exclude anyone within 6 days (we only want the 7-day window)
        const sixDaysFromNow = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

        const { data: users, error } = await supabaseAdmin
            .from("profiles")
            .select("id, email, full_name, plan, subscription_period_end, subscription_status")
            .not("subscription_period_end", "is", null)
            .eq("subscription_status", "active")
            .neq("plan", "free")
            .gte("subscription_period_end", sixDaysFromNow.toISOString())
            .lte("subscription_period_end", sevenDaysFromNow.toISOString());

        if (error) {
            console.error("Query error:", error);
            throw new Error(`Failed to query profiles: ${error.message}`);
        }

        if (!users || users.length === 0) {
            return new Response(
                JSON.stringify({ sent: 0, message: "No renewals in the next 7 days." }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ── 3. Send renewal reminder emails ───────────────
        const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
        let sent = 0;
        const errors: string[] = [];

        for (const user of users) {
            try {
                const renewDate = new Date(user.subscription_period_end);
                const renewFormatted = renewDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });

                await fetch(`${supabaseUrl}/functions/v1/send-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${serviceRoleKey}`,
                    },
                    body: JSON.stringify({
                        type: "renewal_reminder",
                        userId: user.id,
                        data: {
                            plan: user.plan,
                            renewDate: renewFormatted,
                        },
                    }),
                });

                sent++;
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Unknown error";
                errors.push(`${user.id}: ${msg}`);
                console.error(`Failed to send reminder to ${user.id}:`, msg);
            }
        }

        return new Response(
            JSON.stringify({
                sent,
                total: users.length,
                errors: errors.length > 0 ? errors : undefined,
                message: `Sent ${sent}/${users.length} renewal reminders.`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return new Response(
            JSON.stringify({ error: message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

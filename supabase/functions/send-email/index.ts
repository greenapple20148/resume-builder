// supabase/functions/send-email/index.ts
// Sends branded transactional emails via Resend API.
// Called internally by stripe-webhook or directly via Supabase client.
//
// Supports: plan confirmations, ticket acks, add-on purchases, welcome emails.
// All templates are self-contained (Edge Functions can't import from src/).

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

// ══════════════════════════════════════════════════════════
// BRAND CONSTANTS
// ══════════════════════════════════════════════════════════
const B = {
    name: "ResumeBuildIn",
    logo: "◈",
    color: "#c9923c",
    colorLight: "rgba(212,163,88,0.08)",
    ink: "#1a1714",
    inkLight: "#8a857d",
    bg: "#faf8f3",
    white: "#ffffff",
    url: Deno.env.get("APP_URL") || "https://resumebuildin.com",
    supportEmail: "support@resumebuildin.io",
};

// ══════════════════════════════════════════════════════════
// HTML BUILDING BLOCKS
// ══════════════════════════════════════════════════════════
function layout(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${B.name}</title></head>
<body style="margin:0;padding:0;background:${B.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.bg};">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${B.white};border-radius:16px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;">
<tr><td style="padding:28px 36px 20px;border-bottom:1px solid rgba(0,0,0,0.05);">
  <a href="${B.url}" style="text-decoration:none;font-size:20px;font-weight:300;color:${B.ink};letter-spacing:-0.02em;">
    <span style="color:${B.color};margin-right:4px;">${B.logo}</span>Resume<em style="font-style:italic;color:${B.color};">BuildIn</em>
  </a>
</td></tr>
<tr><td style="padding:32px 36px 36px;">${content}</td></tr>
<tr><td style="padding:20px 36px 28px;border-top:1px solid rgba(0,0,0,0.05);background:${B.bg};">
  <p style="margin:0 0 6px;font-size:11px;color:${B.inkLight};line-height:1.5;">${B.name} · <a href="${B.url}" style="color:${B.color};text-decoration:none;">resumebuildin.com</a></p>
  <p style="margin:0;font-size:11px;color:${B.inkLight};line-height:1.5;">Questions? Reply to this email or contact <a href="mailto:${B.supportEmail}" style="color:${B.color};text-decoration:none;">${B.supportEmail}</a></p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function bullets(items: string[]): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 20px;">${items
        .map(
            (i) =>
                `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:${B.color};font-size:16px;line-height:1;">•</td><td style="padding:6px 0;font-size:14px;color:${B.ink};line-height:1.6;">${i}</td></tr>`
        )
        .join("")}</table>`;
}

function cta(text: string, url: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr>
    <td style="background:linear-gradient(135deg,${B.color},#d4a358);border-radius:8px;">
      <a href="${url}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${text}</a>
    </td></tr></table>`;
}

function badge(plan: string): string {
    return `<span style="display:inline-block;padding:4px 14px;border-radius:20px;background:${B.colorLight};color:${B.color};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">${plan}</span>`;
}

function h1(text: string): string {
    return `<h1 style="margin:0 0 12px;font-size:24px;font-weight:300;color:${B.ink};letter-spacing:-0.02em;">${text}</h1>`;
}

function hi(name: string): string {
    return `<p style="margin:0 0 4px;font-size:15px;color:${B.ink};line-height:1.6;">Hi ${name},</p>`;
}

function p(text: string): string {
    return `<p style="margin:0 0 16px;font-size:15px;color:${B.inkLight};line-height:1.6;">${text}</p>`;
}

function sig(): string {
    return `<p style="margin:20px 0 0;font-size:14px;color:${B.ink};font-weight:500;">— The ${B.name} Team</p>`;
}

// ── Email-safe SVG icons as base64 data URI images ────────
const svgIcons: Record<string, string> = {
    zap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${B.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    target: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${B.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    rocket: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${B.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>`,
    mic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${B.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${B.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

function icon(name: string, size = 20): string {
    const svg = svgIcons[name] || svgIcons.zap;
    const b64 = btoa(svg);
    return `<img src="data:image/svg+xml;base64,${b64}" width="${size}" height="${size}" alt="" style="vertical-align:middle;" />`;
}

function highlight(iconName: string, text: string): string {
    return `<div style="background:${B.colorLight};border:1.5px solid rgba(212,163,88,0.2);border-radius:10px;padding:16px 20px;margin:16px 0 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;vertical-align:middle;">${icon(iconName, 22)}</td>
      <td style="font-size:14px;color:${B.ink};line-height:1.5;">${text}</td>
    </tr></table></div>`;
}

// ══════════════════════════════════════════════════════════
// TEMPLATE BUILDERS
// ══════════════════════════════════════════════════════════
type TemplateResult = { subject: string; html: string; text: string };

const templates: Record<string, (data: Record<string, string>) => TemplateResult> = {

    // ── 1. Pro Confirmation ─────────────────────────────
    pro_confirmation: (d) => ({
        subject: "You Now Have Priority Support",
        html: layout(`
      <div style="margin-bottom:20px;">${badge("Pro")}</div>
      ${h1("Welcome to Pro.")}
      ${hi(d.firstName)}
      ${p("As a Pro member, you now receive:")}
      ${bullets([
            "<strong>12-hour guaranteed response time</strong>",
            "<strong>Skip-the-line</strong> priority handling",
            "<strong>Direct assistance</strong> when deadlines matter",
        ])}
      ${p("If you need help, simply reply to this email and we'll prioritize your request.")}
      ${cta("Go to Dashboard →", `${B.url}/dashboard`)}
      <p style="margin:24px 0 0;font-size:14px;color:${B.ink};line-height:1.6;">Excited to help you land your next role.</p>
      ${sig()}
    `),
        text: `Welcome to Pro, ${d.firstName}!\n\nAs a Pro member, you now receive:\n• 12-hour guaranteed response time\n• Skip-the-line priority handling\n• Direct assistance when deadlines matter\n\nIf you need help, simply reply to this email and we'll prioritize your request.\n\nExcited to help you land your next role.\n\n— The ${B.name} Team`,
    }),

    // ── 2. Premium Confirmation ─────────────────────────
    premium_confirmation: (d) => ({
        subject: "Premium Activated — Interview Prep Unlocked",
        html: layout(`
      <div style="margin-bottom:20px;">${badge("Premium")}</div>
      ${h1("Welcome to Premium.")}
      ${hi(d.firstName)}
      ${p("You've unlocked the full interview preparation suite:")}
      ${bullets([
            "<strong>3 AI Mock Interviews</strong> per month with real-time evaluation",
            "<strong>Interview Toolkit</strong> — 280+ role-specific questions + STAR builder",
            "<strong>LinkedIn Optimizer</strong> — headlines, about sections, experience rewrites",
            "<strong>12-hour priority support</strong>",
        ])}
      ${cta("Start a Mock Interview →", `${B.url}/tools/mock-interview`)}
      <p style="margin:24px 0 0;font-size:14px;color:${B.ink};line-height:1.6;">You're investing in your career — we're here to make it count.</p>
      ${sig()}
    `),
        text: `Welcome to Premium, ${d.firstName}!\n\nYou've unlocked the full interview preparation suite:\n• 3 AI Mock Interviews per month\n• Interview Toolkit — 280+ questions + STAR builder\n• LinkedIn Optimizer\n• 12-hour priority support\n\nYou're investing in your career — we're here to make it count.\n\n— The ${B.name} Team`,
    }),

    // ── 3. Career+ Confirmation ─────────────────────────
    career_plus_confirmation: (d) => ({
        subject: "Career+ Activated — Same-Day Support",
        html: layout(`
      <div style="margin-bottom:20px;">${badge("Career+")}</div>
      ${h1("You now have Same-Day Priority Support.")}
      ${hi(d.firstName)}
      ${p("This includes:")}
      ${bullets([
            "<strong>Same business day response</strong> — Mon–Fri during business hours",
            "<strong>20 AI Mock Interviews</strong> per month with advanced coaching",
            "<strong>JD-Based Interview Prep</strong> — paste a job description, get tailored questions",
            "<strong>Career Intelligence Dashboard</strong> — track your progress",
            "<strong>Direct expert assistance</strong> with resume edits & formatting",
        ])}
      ${p("If you'd like to schedule your resume review, reply with your resume attached.")}
      ${cta("Open Career Dashboard →", `${B.url}/tools/career-dashboard`)}
      <p style="margin:24px 0 0;font-size:14px;color:${B.ink};line-height:1.6;">We're here to help you win.</p>
      ${sig()}
    `),
        text: `Career+ Activated, ${d.firstName}!\n\nYou now have Same-Day Priority Support. This includes:\n• Same business day response — Mon–Fri\n• 20 AI Mock Interviews per month\n• JD-Based Interview Prep\n• Career Intelligence Dashboard\n• Direct expert assistance\n\nReply with your resume attached to schedule your review.\n\nWe're here to help you win.\n\n— The ${B.name} Team`,
    }),

    // ── 4. Priority Ticket Ack ──────────────────────────
    priority_ticket_ack: (d) => ({
        subject: "We've Received Your Priority Request",
        html: layout(`
      <div style="margin-bottom:20px;">${badge(d.plan)}</div>
      ${h1("Your request is at the front of our queue.")}
      ${hi(d.firstName)}
      ${p(`Thanks for reaching out. As a ${d.plan} member, your request has been prioritized.`)}
      ${highlight("zap", `<strong>Expected response time:</strong> ${d.responseTime}`)}
      ${p("We'll review your request carefully and get back to you shortly. No bots — real help from our team.")}
      ${sig()}
    `),
        text: `Hi ${d.firstName},\n\nThanks for reaching out. As a ${d.plan} member, your request is now at the front of our queue.\n\nExpected response time: ${d.responseTime}\n\nWe'll review your request carefully and get back to you shortly.\n\n— The ${B.name} Team`,
    }),

    // ── 5. Free Ticket Ack (Soft Upsell) ───────────────
    free_ticket_ack: (d) => ({
        subject: "We're Reviewing Your Request",
        html: layout(`
      ${h1("We've received your request.")}
      ${hi(d.firstName)}
      ${p("We've received your request and will respond within 48 hours.")}
      ${p("Either way, we'll help you soon.")}
      <div style="background:${B.colorLight};border:1.5px solid rgba(212,163,88,0.2);border-radius:12px;padding:20px 24px;margin:20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:14px;vertical-align:top;">${icon("zap", 24)}</td>
          <td>
            <div style="font-size:14px;font-weight:700;color:${B.ink};margin-bottom:4px;">Need a faster response?</div>
            <div style="font-size:13px;color:${B.inkLight};line-height:1.5;margin-bottom:12px;">Upgrade to Pro for <strong style="color:${B.ink};">12-hour priority support</strong> — your requests go to the front of the queue.</div>
            <a href="${B.url}/pricing" style="display:inline-block;padding:8px 20px;background:linear-gradient(135deg,${B.color},#d4a358);color:#fff;font-size:13px;font-weight:600;text-decoration:none;border-radius:6px;">Upgrade to Pro →</a>
          </td>
        </tr></table>
      </div>
      ${sig()}
    `),
        text: `Hi ${d.firstName},\n\nWe've received your request and will respond within 48 hours.\n\nIf you're working with tight deadlines, consider upgrading to Pro for 12-hour priority support: ${B.url}/pricing\n\nEither way, we'll help you soon.\n\n— The ${B.name} Team`,
    }),

    // ── 6. Express Unlock Confirmation ──────────────────
    express_unlock_confirmation: (d) => ({
        subject: "Express Access Activated 24 Hours of Pro",
        html: layout(`
      <div style="margin-bottom:20px;">${badge("Express 24h")}</div>
      ${h1("You're unlocked for 24 hours.")}
      ${hi(d.firstName)}
      ${p("Your Express 24h Pro access is now active. Here's what you've unlocked:")}
      ${bullets([
            "Unlimited PDF downloads — <strong>no watermark</strong>",
            "DOCX export for easy editing",
            "Cover letter builder",
            "All 30+ premium templates",
        ])}
      <p style="margin:0 0 8px;font-size:13px;color:${B.inkLight};line-height:1.6;">Your access expires in 24 hours. Make the most of it!</p>
      ${cta("Download Your Resume →", `${B.url}/dashboard`)}
      ${sig()}
    `),
        text: `Hi ${d.firstName},\n\nYour Express 24h Pro access is now active!\n\nYou've unlocked:\n• Unlimited PDF downloads — no watermark\n• DOCX export\n• Cover letter builder\n• All 30+ templates\n\nYour access expires in 24 hours. Make the most of it!\n\n— The ${B.name} Team`,
    }),

    // ── 7. Mock Pack Confirmation ───────────────────────
    mock_pack_confirmation: (d) => ({
        subject: `Mock Interview Pack — ${d.sessions} Sessions Ready`,
        html: layout(`
      <div style="margin-bottom:20px;">${badge("Mock Pack")}</div>
      ${h1(`${d.sessions} Mock Interview sessions added.`)}
      ${hi(d.firstName)}
      ${p(`Your ${d.sessions} AI mock interview sessions are ready to use. Each session includes:`)}
      ${bullets([
            "Role-specific questions tailored to your target job",
            "Real-time answer evaluation with scoring",
            "Improvement suggestions and sample answers",
            "Sessions never expire — use them at your own pace",
        ])}
      ${cta("Start a Mock Interview →", `${B.url}/tools/mock-interview`)}
      ${sig()}
    `),
        text: `Hi ${d.firstName},\n\nYour ${d.sessions} AI mock interview sessions are ready!\n\nEach session includes:\n• Role-specific questions\n• Real-time evaluation with scoring\n• Improvement suggestions and sample answers\n• Sessions never expire\n\n— The ${B.name} Team`,
    }),

    // ── 8. Welcome Signup ───────────────────────────────
    welcome_signup: (d) => ({
        subject: `Welcome to ${B.name} — Let's Build Your Resume`,
        html: layout(`
      ${h1(`Welcome aboard, ${d.firstName}.`)}
      ${p("You've taken the first step toward a resume that gets interviews, not rejections. Here's how to get started:")}
      ${bullets([
            "<strong>Choose a template</strong> — 30+ ATS-optimized designs",
            "<strong>Import or build</strong> — upload a PDF/DOCX or start fresh",
            "<strong>Enhance with AI</strong> — transform bullet points into achievements",
            "<strong>Download & apply</strong> — clean PDF, ready for recruiters",
        ])}
      ${cta("Build Your Resume →", `${B.url}/dashboard`)}
      ${p("Questions? Just reply to this email — we're real people and we're here to help.")}
      ${sig()}
    `),
        text: `Welcome aboard, ${d.firstName}!\n\nHere's how to get started:\n• Choose a template — 30+ ATS-optimized designs\n• Import or build — upload a PDF/DOCX or start fresh\n• Enhance with AI — transform bullet points into achievements\n• Download & apply — clean PDF, ready for recruiters\n\nBuild your resume: ${B.url}/dashboard\n\nQuestions? Just reply to this email.\n\n— The ${B.name} Team`,
    }),
};

// ══════════════════════════════════════════════════════════
// PLAN → TEMPLATE MAPPING HELPERS
// ══════════════════════════════════════════════════════════
function getConfirmationTemplate(plan: string): string {
    const map: Record<string, string> = {
        pro: "pro_confirmation",
        premium: "premium_confirmation",
        career_plus: "career_plus_confirmation",
    };
    return map[plan] || "welcome_signup";
}

function getTicketData(plan: string): { template: string; data: Record<string, string> } {
    if (plan === "career_plus") {
        return { template: "priority_ticket_ack", data: { plan: "Career+", responseTime: "Same business day (Mon–Fri)" } };
    }
    if (plan === "premium") {
        return { template: "priority_ticket_ack", data: { plan: "Premium", responseTime: "Within 12 hours" } };
    }
    if (plan === "pro") {
        return { template: "priority_ticket_ack", data: { plan: "Pro", responseTime: "Within 12 hours" } };
    }
    return { template: "free_ticket_ack", data: {} };
}

// ══════════════════════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════════════════════
Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();

        // ────────────────────────────────────────────────────
        // Expected payload:
        // {
        //   type: "plan_confirmation" | "ticket_ack" | "welcome" | "express_unlock" | "mock_pack" | string,
        //   userId: string,           // Supabase user ID (to lookup profile)
        //   email?: string,           // Direct email override (skips profile lookup)
        //   firstName?: string,       // Direct name override
        //   plan?: string,            // "pro" | "premium" | "career_plus"
        //   template?: string,        // Direct template name override
        //   data?: Record<string, string>,  // Extra data for template
        // }
        // ────────────────────────────────────────────────────
        const { type, userId, email: directEmail, firstName: directName, plan, template: directTemplate, data: extraData } = body;

        // ── Resolve email and firstName ──────────────────
        let toEmail = directEmail;
        let firstName = directName || "there";

        if (userId && (!toEmail || !directName)) {
            const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") as string,
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
            );

            const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("full_name, email")
                .eq("id", userId)
                .single();

            if (profile) {
                if (!toEmail) toEmail = profile.email;
                if (!directName) firstName = profile.full_name?.split(" ")[0] || "there";
            }

            // Fallback: get email from auth
            if (!toEmail) {
                const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
                toEmail = user?.email;
            }
        }

        if (!toEmail) {
            throw new Error("No email address found. Provide email or userId.");
        }

        // ── Resolve template ────────────────────────────
        let templateName = directTemplate;
        let templateData: Record<string, string> = { firstName, ...extraData };

        if (!templateName) {
            switch (type) {
                case "plan_confirmation":
                    templateName = getConfirmationTemplate(plan || "free");
                    break;
                case "ticket_ack": {
                    const ticket = getTicketData(plan || "free");
                    templateName = ticket.template;
                    templateData = { ...templateData, ...ticket.data };
                    break;
                }
                case "welcome":
                    templateName = "welcome_signup";
                    break;
                case "express_unlock":
                    templateName = "express_unlock_confirmation";
                    break;
                case "mock_pack":
                    templateName = "mock_pack_confirmation";
                    templateData.sessions = templateData.sessions || "3";
                    break;
                default:
                    templateName = directTemplate || "welcome_signup";
            }
        }

        const templateFn = templates[templateName];
        if (!templateFn) {
            throw new Error(`Unknown template: ${templateName}`);
        }

        const emailContent = templateFn(templateData);

        // ── Send via Resend ─────────────────────────────
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not configured.");
        }

        const FROM_ADDRESS = Deno.env.get("FROM_EMAIL") || `${B.name} <hello@resumebuildin.com>`;

        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: FROM_ADDRESS,
                to: [toEmail],
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text,
            }),
        });

        if (!resendResponse.ok) {
            const errorData = await resendResponse.json();
            console.error("Resend API error:", errorData);
            throw new Error(`Resend failed: ${JSON.stringify(errorData)}`);
        }

        const resendResult = await resendResponse.json();

        return new Response(
            JSON.stringify({ sent: true, emailId: resendResult.id, template: templateName }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("send-email error:", message);
        return new Response(
            JSON.stringify({ error: message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

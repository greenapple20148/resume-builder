'use client'
/**
 * Automated Email Templates
 * 
 * Branded HTML email templates for transactional emails.
 * Each template returns { subject, html, text } for use with any email provider
 * (Supabase Edge Functions, Resend, SendGrid, etc.)
 * 
 * Usage:
 *   const email = emailTemplates.proConfirmation({ firstName: 'Jane' })
 *   await sendEmail({ to: user.email, ...email })
 */

// ── Brand constants ──────────────────────────────────────
const BRAND = {
  name: 'ResumeBuildIn',
  logo: '◈',
  color: '#c9923c',
  colorLight: 'rgba(212,163,88,0.08)',
  ink: '#1a1714',
  inkLight: '#8a857d',
  bg: '#faf8f3',
  white: '#ffffff',
  url: 'https://resumebuildin.com',
  supportEmail: 'support@solidlabsai.com',
}

// ── Shared layout wrapper ────────────────────────────────
function wrapInLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.white};border-radius:16px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 36px 20px;border-bottom:1px solid rgba(0,0,0,0.05);">
              <a href="${BRAND.url}" style="text-decoration:none;font-size:20px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
                <span style="color:${BRAND.color};margin-right:4px;">${BRAND.logo}</span>
                Resume<em style="font-style:italic;color:${BRAND.color};">BuildIn</em>
              </a>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px 36px 36px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px;border-top:1px solid rgba(0,0,0,0.05);background:${BRAND.bg};">
              <p style="margin:0 0 6px;font-size:11px;color:${BRAND.inkLight};line-height:1.5;">
                ${BRAND.name} · <a href="${BRAND.url}" style="color:${BRAND.color};text-decoration:none;">resumebuildin.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:${BRAND.inkLight};line-height:1.5;">
                Questions? Reply to this email or contact <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.color};text-decoration:none;">${BRAND.supportEmail}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Helper: styled bullet list ───────────────────────────
function bulletList(items: string[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 20px;">
    ${items.map(item => `<tr>
      <td style="padding:6px 12px 6px 0;vertical-align:top;color:${BRAND.color};font-size:16px;line-height:1;">•</td>
      <td style="padding:6px 0;font-size:14px;color:${BRAND.ink};line-height:1.6;">${item}</td>
    </tr>`).join('')}
  </table>`
}

// ── Helper: CTA button ───────────────────────────────────
function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
    <tr>
      <td style="background:linear-gradient(135deg,${BRAND.color},#d4a358);border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`
}

// ── Helper: badge ────────────────────────────────────────
function planBadge(plan: string): string {
  return `<span style="display:inline-block;padding:4px 14px;border-radius:20px;background:${BRAND.colorLight};color:${BRAND.color};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">${plan}</span>`
}

// ── Email-safe SVG icons as base64 data URIs ─────────────
const svgIcons: Record<string, string> = {
  zap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BRAND.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BRAND.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BRAND.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>`,
  mic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BRAND.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BRAND.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
}

function emailIcon(name: string, size = 20): string {
  const svg = svgIcons[name] || svgIcons.zap
  const b64 = btoa(svg)
  return `<img src="data:image/svg+xml;base64,${b64}" width="${size}" height="${size}" alt="" style="vertical-align:middle;" />`
}

interface EmailResult {
  subject: string
  html: string
  text: string
}

// ══════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════

export const emailTemplates = {

  // ── 1. Pro Purchase Confirmation ───────────────────────
  proConfirmation({ firstName }: { firstName: string }): EmailResult {
    const subject = 'You Now Have Priority Support'
    const html = wrapInLayout(`
      <div style="margin-bottom:20px;">${planBadge('Pro')}</div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        Welcome to Pro.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        As a Pro member, you now receive:
      </p>
      ${bulletList([
      '<strong>12-hour guaranteed response time</strong>',
      '<strong>Skip-the-line</strong> priority handling',
      '<strong>Direct assistance</strong> when deadlines matter',
    ])}
      <p style="margin:0 0 8px;font-size:14px;color:${BRAND.inkLight};line-height:1.6;">
        If you need help, simply reply to this email and we'll prioritize your request.
      </p>
      ${ctaButton('Go to Dashboard →', `${BRAND.url}/dashboard`)}
      <p style="margin:24px 0 0;font-size:14px;color:${BRAND.ink};line-height:1.6;">
        Excited to help you land your next role.
      </p>
      <p style="margin:12px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Welcome to Pro, ${firstName}!

As a Pro member, you now receive:
• 12-hour guaranteed response time
• Skip-the-line priority handling
• Direct assistance when deadlines matter

If you need help, simply reply to this email and we'll prioritize your request.

Excited to help you land your next role.

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 2. Premium Purchase Confirmation ───────────────────
  premiumConfirmation({ firstName }: { firstName: string }): EmailResult {
    const subject = 'Premium Activated — Interview Prep Unlocked'
    const html = wrapInLayout(`
      <div style="margin-bottom:20px;">${planBadge('Premium')}</div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        Welcome to Premium.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        You've unlocked the full interview preparation suite:
      </p>
      ${bulletList([
      '<strong>3 AI Mock Interviews</strong> per month with real-time evaluation',
      '<strong>Interview Toolkit</strong> — 280+ role-specific questions + STAR builder',
      '<strong>LinkedIn Optimizer</strong> — headlines, about sections, experience rewrites',
      '<strong>12-hour priority support</strong>',
    ])}
      ${ctaButton('Start a Mock Interview →', `${BRAND.url}/tools/mock-interview`)}
      <p style="margin:24px 0 0;font-size:14px;color:${BRAND.ink};line-height:1.6;">
        You're investing in your career — we're here to make it count.
      </p>
      <p style="margin:12px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Welcome to Premium, ${firstName}!

You've unlocked the full interview preparation suite:
• 3 AI Mock Interviews per month with real-time evaluation
• Interview Toolkit — 280+ role-specific questions + STAR builder
• LinkedIn Optimizer — headlines, about sections, experience rewrites
• 12-hour priority support

Start a mock interview: ${BRAND.url}/tools/mock-interview

You're investing in your career — we're here to make it count.

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 3. Career+ Purchase Confirmation ──────────────────
  careerPlusConfirmation({ firstName }: { firstName: string }): EmailResult {
    const subject = 'Career+ Activated — Same-Day Support'
    const html = wrapInLayout(`
      <div style="margin-bottom:20px;">${planBadge('Career+')}</div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        You now have Same-Day Priority Support.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        This includes:
      </p>
      ${bulletList([
      '<strong>Same business day response</strong> — Mon–Fri during business hours',
      '<strong>20 AI Mock Interviews</strong> per month with advanced coaching',
      '<strong>JD-Based Interview Prep</strong> — paste a job description, get tailored questions',
      '<strong>Career Intelligence Dashboard</strong> — track your progress',
      '<strong>Direct expert assistance</strong> with resume edits & formatting',
    ])}
      <p style="margin:0 0 8px;font-size:14px;color:${BRAND.inkLight};line-height:1.6;">
        If you'd like to schedule your resume review, reply with your resume attached.
      </p>
      ${ctaButton('Open Career Dashboard →', `${BRAND.url}/tools/career-dashboard`)}
      <p style="margin:24px 0 0;font-size:14px;color:${BRAND.ink};line-height:1.6;">
        We're here to help you win.
      </p>
      <p style="margin:12px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Career+ Activated, ${firstName}!

You now have Same-Day Priority Support. This includes:
• Same business day response — Mon–Fri during business hours
• 20 AI Mock Interviews per month with advanced coaching
• JD-Based Interview Prep — paste a job description, get tailored questions
• Career Intelligence Dashboard — track your progress
• Direct expert assistance with resume edits & formatting

If you'd like to schedule your resume review, reply with your resume attached.

We're here to help you win.

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 4. Priority Ticket Acknowledgment (Pro/Premium/Career+) ──
  priorityTicketAck({ firstName, plan, responseTime }: { firstName: string; plan: string; responseTime: string }): EmailResult {
    const subject = "We've Received Your Priority Request"
    const html = wrapInLayout(`
      <div style="margin-bottom:20px;">${planBadge(plan)}</div>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        Your request is at the front of our queue.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        Thanks for reaching out. As a ${plan} member, your request has been prioritized.
      </p>
      <div style="background:${BRAND.colorLight};border:1.5px solid rgba(212,163,88,0.2);border-radius:10px;padding:16px 20px;margin:16px 0 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:10px;vertical-align:middle;">${emailIcon('zap', 22)}</td>
            <td style="font-size:14px;color:${BRAND.ink};line-height:1.5;">
              <strong>Expected response time:</strong> ${responseTime}
            </td>
          </tr>
        </table>
      </div>
      <p style="margin:0 0 8px;font-size:14px;color:${BRAND.inkLight};line-height:1.6;">
        We'll review your request carefully and get back to you shortly. No bots — real help from our team.
      </p>
      <p style="margin:20px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Hi ${firstName},

Thanks for reaching out. As a ${plan} member, your request is now at the front of our queue.

Expected response time: ${responseTime}

We'll review your request carefully and get back to you shortly.

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 5. Free Plan Ticket Acknowledgment (Soft Upsell) ──
  freeTicketAck({ firstName }: { firstName: string }): EmailResult {
    const subject = "We're Reviewing Your Request"
    const html = wrapInLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        We've received your request.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        We've received your request and will respond within 48 hours.
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:${BRAND.inkLight};line-height:1.6;">
        Either way, we'll help you soon.
      </p>
      <!-- Priority Support Upsell -->
      <div style="background:${BRAND.colorLight};border:1.5px solid rgba(212,163,88,0.2);border-radius:12px;padding:20px 24px;margin:20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:14px;vertical-align:top;">${emailIcon('zap', 24)}</td>
            <td>
              <div style="font-size:14px;font-weight:700;color:${BRAND.ink};margin-bottom:4px;">Need a faster response?</div>
              <div style="font-size:13px;color:${BRAND.inkLight};line-height:1.5;margin-bottom:12px;">
                Upgrade to Pro for <strong style="color:${BRAND.ink};">12-hour priority support</strong> — your requests go to the front of the queue.
              </div>
              <a href="${BRAND.url}/pricing" style="display:inline-block;padding:8px 20px;background:linear-gradient(135deg,${BRAND.color},#d4a358);color:#fff;font-size:13px;font-weight:600;text-decoration:none;border-radius:6px;">
                Upgrade to Pro →
              </a>
            </td>
          </tr>
        </table>
      </div>
      <p style="margin:20px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Hi ${firstName},

We've received your request and will respond within 48 hours.

If you're working with tight deadlines, consider upgrading to Pro for 12-hour priority support: ${BRAND.url}/pricing

Either way, we'll help you soon.

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 6. Express Unlock Confirmation ────────────────────
  expressUnlockConfirmation({ firstName }: { firstName: string }): EmailResult {
    const subject = 'Express Access Activated 24 Hours of Pro'
    const html = wrapInLayout(`
      <div style="margin-bottom:20px;">${planBadge('Express 24h')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        You're unlocked for 24 hours.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        Your Express 24h Pro access is now active. Here's what you've unlocked:
      </p>
      ${bulletList([
      'Unlimited PDF downloads — <strong>no watermark</strong>',
      'DOCX export for easy editing',
      'Cover letter builder',
      'All 30+ premium templates',
    ])}
      <p style="margin:0 0 8px;font-size:13px;color:${BRAND.inkLight};line-height:1.6;">
        Your access expires in 24 hours. Make the most of it!
      </p>
      ${ctaButton('Download Your Resume →', `${BRAND.url}/dashboard`)}
      <p style="margin:20px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Hi ${firstName},

Your Express 24h Pro access is now active!

You've unlocked:
• Unlimited PDF downloads — no watermark
• DOCX export for easy editing
• Cover letter builder
• All 30+ premium templates

Your access expires in 24 hours. Make the most of it!

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 7. Mock Pack Purchase Confirmation ────────────────
  mockPackConfirmation({ firstName, sessions }: { firstName: string; sessions: number }): EmailResult {
    const subject = `Mock Interview Pack — ${sessions} Sessions Ready`
    const html = wrapInLayout(`
      <div style="margin-bottom:20px;">${planBadge('Mock Pack')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        ${sessions} Mock Interview sessions added.
      </h1>
      <p style="margin:0 0 4px;font-size:15px;color:${BRAND.ink};line-height:1.6;">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        Your ${sessions} AI mock interview sessions are ready to use. Each session includes:
      </p>
      ${bulletList([
      'Role-specific questions tailored to your target job',
      'Real-time answer evaluation with scoring',
      'Improvement suggestions and sample answers',
      'Sessions never expire — use them at your own pace',
    ])}
      ${ctaButton('Start a Mock Interview →', `${BRAND.url}/tools/mock-interview`)}
      <p style="margin:20px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Hi ${firstName},

Your ${sessions} AI mock interview sessions are ready!

Each session includes:
• Role-specific questions tailored to your target job
• Real-time answer evaluation with scoring
• Improvement suggestions and sample answers
• Sessions never expire — use them at your own pace

Start practicing: ${BRAND.url}/tools/mock-interview

— The ${BRAND.name} Team`

    return { subject, html, text }
  },

  // ── 8. Welcome Email (New Signup) ─────────────────────
  welcomeSignup({ firstName }: { firstName: string }): EmailResult {
    const subject = `Welcome to ${BRAND.name} — Let's Build Your Resume`
    const html = wrapInLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:300;color:${BRAND.ink};letter-spacing:-0.02em;">
        Welcome aboard, ${firstName}.
      </h1>
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.inkLight};line-height:1.6;">
        You've taken the first step toward a resume that gets interviews, not rejections. Here's how to get started:
      </p>
      ${bulletList([
      '<strong>Choose a template</strong> — 30+ ATS-optimized designs',
      '<strong>Import or build</strong> — upload a PDF/DOCX or start fresh',
      '<strong>Enhance with AI</strong> — transform bullet points into achievements',
      '<strong>Download & apply</strong> — clean PDF, ready for recruiters',
    ])}
      ${ctaButton('Build Your Resume →', `${BRAND.url}/dashboard`)}
      <p style="margin:24px 0 0;font-size:14px;color:${BRAND.inkLight};line-height:1.6;">
        Questions? Just reply to this email — we're real people and we're here to help.
      </p>
      <p style="margin:12px 0 0;font-size:14px;color:${BRAND.ink};font-weight:500;">
        — The ${BRAND.name} Team
      </p>
    `)
    const text = `Welcome aboard, ${firstName}!

Here's how to get started:
• Choose a template — 30+ ATS-optimized designs
• Import or build — upload a PDF/DOCX or start fresh
• Enhance with AI — transform bullet points into achievements
• Download & apply — clean PDF, ready for recruiters

Build your resume: ${BRAND.url}/dashboard

Questions? Just reply to this email — we're real people and we're here to help.

— The ${BRAND.name} Team`

    return { subject, html, text }
  },
}

// ── Helper: get confirmation template by plan ────────────
export function getConfirmationEmail(plan: string, firstName: string): EmailResult {
  switch (plan) {
    case 'pro':
      return emailTemplates.proConfirmation({ firstName })
    case 'premium':
      return emailTemplates.premiumConfirmation({ firstName })
    case 'career_plus':
      return emailTemplates.careerPlusConfirmation({ firstName })
    default:
      return emailTemplates.welcomeSignup({ firstName })
  }
}

// ── Helper: get ticket ack by plan ───────────────────────
export function getTicketAckEmail(plan: string, firstName: string): EmailResult {
  if (plan === 'career_plus') {
    return emailTemplates.priorityTicketAck({ firstName, plan: 'Career+', responseTime: 'Same business day (Mon–Fri)' })
  }
  if (plan === 'premium') {
    return emailTemplates.priorityTicketAck({ firstName, plan: 'Premium', responseTime: 'Within 12 hours' })
  }
  if (plan === 'pro') {
    return emailTemplates.priorityTicketAck({ firstName, plan: 'Pro', responseTime: 'Within 12 hours' })
  }
  return emailTemplates.freeTicketAck({ firstName })
}

export type { EmailResult }

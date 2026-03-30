import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/server/supabase-admin'

// Internal email API — called by stripe webhook and other server-side routes.
// Protected by x-api-secret header (service role key).

const B = {
    name: 'ResumeBuildIn', logo: '◈', color: '#c9923c', colorLight: 'rgba(212,163,88,0.08)',
    ink: '#1a1714', inkLight: '#8a857d', bg: '#faf8f3', white: '#ffffff',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://resumebuildin.com',
    supportEmail: 'support@resumebuildin.io',
}

function layout(content: string) { return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${B.name}</title></head><body style="margin:0;padding:0;background:${B.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.bg};"><tr><td align="center" style="padding:40px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${B.white};border-radius:16px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;"><tr><td style="padding:28px 36px 20px;border-bottom:1px solid rgba(0,0,0,0.05);"><a href="${B.url}" style="text-decoration:none;font-size:20px;font-weight:300;color:${B.ink};"><span style="color:${B.color};margin-right:4px;">${B.logo}</span>Resume<em style="font-style:italic;color:${B.color};">BuildIn</em></a></td></tr><tr><td style="padding:32px 36px 36px;">${content}</td></tr><tr><td style="padding:20px 36px 28px;border-top:1px solid rgba(0,0,0,0.05);background:${B.bg};"><p style="margin:0 0 6px;font-size:11px;color:${B.inkLight};">${B.name} · <a href="${B.url}" style="color:${B.color};text-decoration:none;">resumebuildin.com</a></p><p style="margin:0;font-size:11px;color:${B.inkLight};">Questions? <a href="mailto:${B.supportEmail}" style="color:${B.color};text-decoration:none;">${B.supportEmail}</a></p></td></tr></table></td></tr></table></body></html>` }
function bullets(items: string[]) { return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 20px;">${items.map(i => `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:${B.color};font-size:16px;line-height:1;">•</td><td style="padding:6px 0;font-size:14px;color:${B.ink};line-height:1.6;">${i}</td></tr>`).join('')}</table>` }
function cta(text: string, url: string) { return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="background:linear-gradient(135deg,${B.color},#d4a358);border-radius:8px;"><a href="${url}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${text}</a></td></tr></table>` }
function badge(plan: string) { return `<span style="display:inline-block;padding:4px 14px;border-radius:20px;background:${B.colorLight};color:${B.color};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">${plan}</span>` }
function h1(text: string) { return `<h1 style="margin:0 0 12px;font-size:24px;font-weight:300;color:${B.ink};">${text}</h1>` }
function hi(name: string) { return `<p style="margin:0 0 4px;font-size:15px;color:${B.ink};">Hi ${name},</p>` }
function p(text: string) { return `<p style="margin:0 0 16px;font-size:15px;color:${B.inkLight};line-height:1.6;">${text}</p>` }
function sig() { return `<p style="margin:20px 0 0;font-size:14px;color:${B.ink};font-weight:500;">— The ${B.name} Team</p>` }

type TR = { subject: string; html: string; text: string }
const templates: Record<string, (d: Record<string, string>) => TR> = {
    pro_confirmation: (d) => ({ subject: 'You Now Have Priority Support', html: layout(`<div style="margin-bottom:20px;">${badge('Pro')}</div>${h1('Welcome to Pro.')}${hi(d.firstName)}${p('As a Pro member, you now receive:')}${bullets(['<strong>12-hour guaranteed response time</strong>', '<strong>Skip-the-line</strong> priority handling', '<strong>Direct assistance</strong> when deadlines matter'])}${p('If you need help, simply reply to this email.')}${cta('Go to Dashboard →', `${B.url}/dashboard`)}${sig()}`), text: `Welcome to Pro, ${d.firstName}!` }),
    premium_confirmation: (d) => ({ subject: 'Premium Activated — Interview Prep Unlocked', html: layout(`<div style="margin-bottom:20px;">${badge('Premium')}</div>${h1('Welcome to Premium.')}${hi(d.firstName)}${p("You've unlocked the full interview preparation suite:")}${bullets(['<strong>3 AI Mock Interviews</strong> per month', '<strong>Interview Toolkit</strong> — 280+ questions', '<strong>LinkedIn Optimizer</strong>', '<strong>12-hour priority support</strong>'])}${cta('Start a Mock Interview →', `${B.url}/tools/mock-interview`)}${sig()}`), text: `Welcome to Premium, ${d.firstName}!` }),
    career_plus_confirmation: (d) => ({ subject: 'Career+ Activated — Same-Day Support', html: layout(`<div style="margin-bottom:20px;">${badge('Career+')}</div>${h1('You now have Same-Day Priority Support.')}${hi(d.firstName)}${p('This includes:')}${bullets(['<strong>Same business day response</strong>', '<strong>20 AI Mock Interviews</strong>/month', '<strong>JD-Based Interview Prep</strong>', '<strong>Career Intelligence Dashboard</strong>'])}${cta('Open Career Dashboard →', `${B.url}/tools/career-dashboard`)}${sig()}`), text: `Career+ Activated, ${d.firstName}!` }),
    express_unlock_confirmation: (d) => ({ subject: 'Express Access Activated — 24 Hours of Pro', html: layout(`<div style="margin-bottom:20px;">${badge('Express 24h')}</div>${h1("You're unlocked for 24 hours.")}${hi(d.firstName)}${p('Your Express 24h Pro access is now active:')}${bullets(['Unlimited PDF downloads — <strong>no watermark</strong>', 'DOCX export', 'Cover letter builder', 'All 30+ premium templates'])}${cta('Download Your Resume →', `${B.url}/dashboard`)}${sig()}`), text: `Express 24h access activated, ${d.firstName}!` }),
    mock_pack_confirmation: (d) => ({ subject: `Mock Interview Pack — ${d.sessions} Sessions Ready`, html: layout(`<div style="margin-bottom:20px;">${badge('Mock Pack')}</div>${h1(`${d.sessions} Mock Interview sessions added.`)}${hi(d.firstName)}${p(`Your ${d.sessions} AI mock interview sessions are ready.`)}${bullets(['Role-specific questions', 'Real-time evaluation', 'Improvement suggestions', 'Sessions never expire'])}${cta('Start a Mock Interview →', `${B.url}/tools/mock-interview`)}${sig()}`), text: `${d.sessions} mock sessions added, ${d.firstName}!` }),
    welcome_signup: (d) => ({ subject: `Welcome to ${B.name} — Let's Build Your Resume`, html: layout(`${h1(`Welcome aboard, ${d.firstName}.`)}${p("You've taken the first step toward a resume that gets interviews.")}${bullets(['<strong>Choose a template</strong> — 30+ ATS-optimized designs', '<strong>Import or build</strong> — upload PDF/DOCX or start fresh', '<strong>Enhance with AI</strong>', '<strong>Download & apply</strong>'])}${cta('Build Your Resume →', `${B.url}/dashboard`)}${sig()}`), text: `Welcome aboard, ${d.firstName}!` }),
    priority_ticket_ack: (d) => ({ subject: "We've Received Your Priority Request", html: layout(`<div style="margin-bottom:20px;">${badge(d.plan)}</div>${h1('Your request is at the front of our queue.')}${hi(d.firstName)}${p(`As a ${d.plan} member, your request has been prioritized. Expected response: ${d.responseTime}`)}${sig()}`), text: `Hi ${d.firstName}, your priority request is queued.` }),
    free_ticket_ack: (d) => ({ subject: "We're Reviewing Your Request", html: layout(`${h1("We've received your request.")}${hi(d.firstName)}${p("We'll respond within 48 hours.")}${sig()}`), text: `Hi ${d.firstName}, we'll respond within 48 hours.` }),
}

function getConfirmationTemplate(plan: string) { return ({ pro: 'pro_confirmation', premium: 'premium_confirmation', career_plus: 'career_plus_confirmation' } as Record<string, string>)[plan] || 'welcome_signup' }

export async function POST(request: NextRequest) {
    try {
        // Verify internal caller (service role key or same-origin)
        const apiSecret = request.headers.get('x-api-secret')
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (apiSecret && serviceKey && apiSecret !== serviceKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { type, userId, email: directEmail, firstName: directName, plan, template: directTemplate, data: extraData } = body

        let toEmail = directEmail
        let firstName = directName || 'there'

        if (userId && (!toEmail || !directName)) {
            const supabaseAdmin = getSupabaseAdmin()
            const { data: profile } = await supabaseAdmin.from('profiles').select('full_name, email').eq('id', userId).single()
            if (profile) { if (!toEmail) toEmail = profile.email; if (!directName) firstName = profile.full_name?.split(' ')[0] || 'there' }
            if (!toEmail) { const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId); toEmail = user?.email }
        }
        if (!toEmail) throw new Error('No email address found.')

        let templateName = directTemplate
        let templateData: Record<string, string> = { firstName, ...extraData }

        if (!templateName) {
            switch (type) {
                case 'plan_confirmation': templateName = getConfirmationTemplate(plan || 'free'); break
                case 'ticket_ack': {
                    if (['career_plus', 'premium', 'pro'].includes(plan || '')) {
                        templateName = 'priority_ticket_ack'
                        templateData = { ...templateData, plan: plan === 'career_plus' ? 'Career+' : plan === 'premium' ? 'Premium' : 'Pro', responseTime: plan === 'career_plus' ? 'Same business day' : 'Within 12 hours' }
                    } else { templateName = 'free_ticket_ack' }
                    break
                }
                case 'welcome': templateName = 'welcome_signup'; break
                case 'express_unlock': templateName = 'express_unlock_confirmation'; break
                case 'mock_pack': templateName = 'mock_pack_confirmation'; templateData.sessions = templateData.sessions || '3'; break
                default: templateName = 'welcome_signup'
            }
        }

        const templateFn = templates[templateName]
        if (!templateFn) throw new Error(`Unknown template: ${templateName}`)

        const emailContent = templateFn(templateData)
        const RESEND_API_KEY = process.env.RESEND_API_KEY
        if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured.')

        const FROM_ADDRESS = process.env.FROM_EMAIL || `${B.name} <hello@resumebuildin.com>`
        const REPLY_TO = process.env.REPLY_TO_EMAIL || B.supportEmail

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({ from: FROM_ADDRESS, reply_to: [REPLY_TO], to: [toEmail], subject: emailContent.subject, html: emailContent.html, text: emailContent.text, tags: [{ name: 'category', value: templateName || 'transactional' }] }),
        })
        if (!resendResponse.ok) { const errorData = await resendResponse.json(); throw new Error(`Resend failed: ${JSON.stringify(errorData)}`) }
        const resendResult = await resendResponse.json()

        return NextResponse.json({ sent: true, emailId: resendResult.id, template: templateName })
    } catch (error: any) {
        console.error('send-email error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

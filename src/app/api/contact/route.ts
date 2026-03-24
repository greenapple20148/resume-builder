import { NextRequest, NextResponse } from 'next/server'

// Rate limiting (in-memory, resets on cold starts)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

function isRateLimited(key: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(key)
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
        return false
    }
    entry.count++
    return entry.count > RATE_LIMIT_MAX
}

function buildAutoReplyHtml(name: string): string {
    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a2e; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #c9923c; font-size: 20px; margin: 0; font-weight: 400;">◈ Resume<em>BuildIn</em></h1>
      </div>
      <div style="background: #faf8f3; padding: 32px; border: 1px solid #e8e3d8; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="font-size: 18px; color: #1a1a2e; margin: 0 0 16px;">Thanks for reaching out, ${name}!</h2>
        <p style="font-size: 14px; line-height: 1.7; color: #555; margin: 0 0 16px;">We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>
        <p style="font-size: 14px; line-height: 1.7; color: #555; margin: 0 0 16px;">In the meantime, here are some helpful resources:</p>
        <ul style="font-size: 14px; line-height: 1.8; color: #555; padding-left: 20px; margin: 0 0 24px;">
          <li>Browse our <a href="https://resumebuildin.com/themes" style="color: #c9923c;">resume templates</a></li>
          <li>Check out our <a href="https://resumebuildin.com/blog" style="color: #c9923c;">blog</a> for career tips</li>
          <li>View our <a href="https://resumebuildin.com/pricing" style="color: #c9923c;">pricing plans</a></li>
        </ul>
        <hr style="border: none; border-top: 1px solid #e8e3d8; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999; margin: 0;">This is an automated confirmation. Please do not reply to this email.<br/>Resume BuildIn is operated by RZeal Solutions, United States.</p>
      </div>
    </div>`
}

function buildNotificationHtml(name: string, email: string, subject: string, message: string, ip: string): string {
    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a2e; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #c9923c; font-size: 18px; margin: 0; font-weight: 400;">◈ Resume<em>BuildIn</em> — Contact Form</h1>
      </div>
      <div style="background: #faf8f3; padding: 32px; border: 1px solid #e8e3d8; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          <tr><td style="padding: 8px 12px 8px 0; font-weight: 600; color: #666; vertical-align: top; width: 80px;">From:</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 12px 8px 0; font-weight: 600; color: #666; vertical-align: top;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #c9923c;">${email}</a></td></tr>
          <tr><td style="padding: 8px 12px 8px 0; font-weight: 600; color: #666; vertical-align: top;">Subject:</td><td style="padding: 8px 0;">${subject}</td></tr>
          <tr><td style="padding: 8px 12px 8px 0; font-weight: 600; color: #666; vertical-align: top;">IP:</td><td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #999;">${ip}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e8e3d8; margin: 20px 0;" />
        <div style="font-size: 14px; line-height: 1.7; color: #333; white-space: pre-wrap;">${message}</div>
        <hr style="border: none; border-top: 1px solid #e8e3d8; margin: 20px 0;" />
        <p style="font-size: 11px; color: #999; margin: 0;">Reply directly to this email to respond to the sender.</p>
      </div>
    </div>`
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, subject, message, _hp, _ts } = body

        // Honeypot check
        if (_hp) return NextResponse.json({ success: true })
        // Timing check
        if (_ts && Date.now() - Number(_ts) < 3000) return NextResponse.json({ success: true })

        if (!name || !email || !subject || !message) throw new Error('All fields are required.')
        if (name.length > 100 || subject.length > 200 || message.length > 5000) throw new Error('One or more fields exceed the maximum length.')
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address.')
        if ((message.match(/https?:\/\//gi) || []).length > 3) throw new Error('Message contains too many links.')
        if (isRateLimited(email.toLowerCase())) throw new Error('Too many submissions. Please wait 15 minutes.')

        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('cf-connecting-ip') || 'unknown'
        if (clientIP !== 'unknown' && isRateLimited(`ip:${clientIP}`)) throw new Error('Too many submissions from your network.')

        const RESEND_API_KEY = process.env.RESEND_API_KEY
        if (!RESEND_API_KEY) throw new Error('Email service not configured.')

        const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'hello@resumebuildin.com'
        const FROM_ADDRESS = process.env.FROM_EMAIL || 'Resume BuildIn <noreply@resumebuildin.com>'

        const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const safeName = esc(name), safeEmail = esc(email), safeSubject = esc(subject), safeMessage = esc(message)

        const notifResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({ from: FROM_ADDRESS, to: [CONTACT_TO_EMAIL], reply_to: email, subject: `[Contact Form] ${safeSubject}`, html: buildNotificationHtml(safeName, safeEmail, safeSubject, safeMessage, clientIP) }),
        })
        if (!notifResponse.ok) {
            const errorData = await notifResponse.json()
            console.error('Resend notification error:', errorData)
            throw new Error('Failed to send message. Please try again later.')
        }

        // Auto-reply (non-blocking)
        try {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
                body: JSON.stringify({ from: FROM_ADDRESS, to: [email], subject: `We received your message — Resume BuildIn`, html: buildAutoReplyHtml(safeName) }),
            })
        } catch (replyErr) { console.error('Auto-reply failed:', replyErr) }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 400 })
    }
}

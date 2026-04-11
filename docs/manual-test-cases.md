# Manual Test Cases — ResumeBuildIn

**App:** ResumeBuildIn
**Last Updated:** 2026-03-09
**Auth Provider:** Supabase
**Payments:** Stripe

---

## Test Environment Setup

Before running tests, ensure:
- [ ] Stripe test mode is active (test keys configured)
- [ ] Use Stripe test card `4242 4242 4242 4242`, exp `12/26`, CVC `123`
- [ ] Use Stripe test card for declined payment: `4000 0000 0000 9995`
- [ ] Supabase project is accessible
- [ ] Local dev server running or staging URL available
- [ ] Test email inbox accessible (e.g. Mailinator, Gmail alias)

---

## 1. Authentication

### 1.1 Sign Up — Email & Password

**TC-AUTH-001: Successful signup with valid credentials**
- Pre-condition: User does not already have an account
- Steps:
  1. Navigate to `/auth`
  2. Ensure "Sign Up" mode is active
  3. Enter full name: `Test User`
  4. Enter a new email address
  5. Enter password meeting all requirements: `Test@1234`
  6. Click "Create Account"
- Expected:
  - Confirmation email sent to the email address
  - User sees check-email screen or redirected to `/confirm-email`
  - No error messages

**TC-AUTH-002: Signup — missing uppercase**
- Steps:
  1. Navigate to `/auth` > Sign Up
  2. Enter password: `test@1234` (no uppercase)
- Expected: Inline validation error — must contain uppercase letter

**TC-AUTH-003: Signup — missing symbol**
- Steps:
  1. Enter password: `TestPass1` (no symbol)
- Expected: Validation error for missing special character

**TC-AUTH-004: Signup — too short**
- Steps:
  1. Enter password: `Ab1!` (< 8 chars)
- Expected: Validation error — minimum 8 characters

**TC-AUTH-005: Signup — duplicate email**
- Pre-condition: Account already exists with that email
- Steps:
  1. Attempt signup with existing email
- Expected: Error — email already in use. No new account created.

**TC-AUTH-006: Signup — invalid email format**
- Steps:
  1. Enter email: `notanemail`, click submit
- Expected: Inline validation error for invalid email format

**TC-AUTH-007: Signup — empty fields**
- Steps:
  1. Click submit without filling any fields
- Expected: Validation errors on all required fields

**TC-AUTH-008: Post-signup email confirmation — success**
- Pre-condition: Completed TC-AUTH-001
- Steps:
  1. Open confirmation email
  2. Click the confirmation link
- Expected:
  - Redirected to `/welcome`
  - User is logged in
  - Profile created with `plan = 'free'`

**TC-AUTH-009: Email confirmation — invalid/expired link**
- Steps:
  1. Alter the confirmation URL token and navigate to it
- Expected: Error — "Invalid or expired link"

---

### 1.2 Sign In — Email & Password

**TC-AUTH-010: Successful login**
- Pre-condition: Confirmed account exists
- Steps:
  1. Navigate to `/auth`, switch to Sign In
  2. Enter valid email and password
  3. Click "Sign In"
- Expected:
  - Redirected to `/dashboard`
  - Dashboard shows correct user name and plan

**TC-AUTH-011: Login — wrong password**
- Steps:
  1. Enter correct email, wrong password
- Expected: Error — invalid credentials. No redirect.

**TC-AUTH-012: Login — unregistered email**
- Steps:
  1. Enter email not in system
- Expected: Error — invalid credentials (must NOT reveal whether email exists)

**TC-AUTH-013: Login — unconfirmed email**
- Pre-condition: Account created but email not confirmed
- Steps:
  1. Attempt login with those credentials
- Expected: Error or prompt to confirm email first

**TC-AUTH-014: Login — empty fields**
- Steps:
  1. Click "Sign In" with no fields filled
- Expected: Validation errors on email and password fields

---

### 1.3 OAuth — Google

**TC-AUTH-015: Google OAuth — new user**
- Steps:
  1. Click "Continue with Google"
  2. Complete OAuth with a Google account not previously registered
- Expected:
  - Redirected to `/dashboard`
  - New profile created with `plan = 'free'`

**TC-AUTH-016: Google OAuth — existing user**
- Pre-condition: Previously signed up via Google
- Steps:
  1. Click "Continue with Google", select same account
- Expected: Redirected to `/dashboard`, existing session restored

**TC-AUTH-017: Google OAuth — cancel**
- Steps:
  1. Click "Continue with Google", cancel the OAuth prompt
- Expected: Returned to `/auth` gracefully, no crash

---

### 1.4 OAuth — LinkedIn

**TC-AUTH-018: LinkedIn OAuth — new user**
- Steps:
  1. Click "Continue with LinkedIn", complete OAuth
- Expected: Profile created, redirected to `/dashboard`

**TC-AUTH-019: LinkedIn OAuth — existing user**
- Steps:
  1. Click "Continue with LinkedIn", select same account
- Expected: Logged in, redirected to `/dashboard`

---

### 1.5 Password Reset

**TC-AUTH-020: Request reset — valid email**
- Steps:
  1. Navigate to `/auth`, click "Forgot password?"
  2. Enter a registered email
  3. Click "Send Reset Email"
- Expected:
  - Success message — "Check your email"
  - Reset email sent

**TC-AUTH-021: Request reset — unregistered email**
- Steps:
  1. Enter email not in system, click send
- Expected:
  - Same neutral success message (prevent email enumeration)
  - No reset email sent

**TC-AUTH-022: Request reset — empty email**
- Steps:
  1. Leave email blank, click send
- Expected: Validation error

**TC-AUTH-023: Complete reset — valid link**
- Pre-condition: Requested reset for valid email
- Steps:
  1. Open reset email, click the link
  2. Redirected to `/auth?mode=reset-password`
  3. Enter new password: `NewPass@5678`
  4. Confirm password
  5. Click "Update Password"
- Expected:
  - Password updated successfully
  - User can log in with new password
  - Old password no longer works

**TC-AUTH-024: Reset — passwords don't match**
- Steps:
  1. Enter `NewPass@5678` and `DifferentPass@1` in reset form
- Expected: Validation error — passwords do not match

**TC-AUTH-025: Reset — weak new password**
- Steps:
  1. Enter `weakpassword` (no uppercase, no symbol) in reset form
- Expected: Validation error — same rules as signup

**TC-AUTH-026: Reset — expired/invalid link**
- Steps:
  1. Alter reset URL token or use an old link
- Expected: Error — "Invalid or expired link"

---

### 1.6 Session & Logout

**TC-AUTH-027: Session persists across refresh**
- Steps:
  1. Log in, navigate to `/dashboard`
  2. Refresh the page
- Expected: User remains logged in, no redirect

**TC-AUTH-028: Logout**
- Steps:
  1. Log in, click logout button
- Expected:
  - Session cleared, redirected to `/` or `/auth`
  - `/dashboard` now redirects to `/auth`

**TC-AUTH-029: Protected route — logged out**
- Steps:
  1. While logged out, navigate to `/dashboard`
- Expected: Redirected to `/auth`

**TC-AUTH-030: Protected route — logged in**
- Steps:
  1. Log in, navigate to `/editor/new`
- Expected: Editor loads, no redirect

---

## 2. Pricing Page

**TC-PRICE-001: View pricing — guest**
- Steps:
  1. Navigate to `/pricing` while logged out
- Expected:
  - All plans visible (Free, Pro, Premium, Career+)
  - Monthly/Annual toggle works
  - Clicking upgrade prompts login

**TC-PRICE-002: View pricing — free user**
- Steps:
  1. Log in as free user, navigate to `/pricing`
- Expected:
  - Free plan shows "Current Plan" badge
  - Pro/Premium/Career+ show upgrade buttons

**TC-PRICE-003: Annual billing toggle**
- Steps:
  1. Toggle Monthly → Annual on `/pricing`
- Expected:
  - Pro: $14.99/mo → $79/yr
  - Premium: $24.99/mo → $119/yr
  - Career+: $34.99/mo → $149/yr

**TC-PRICE-004: Founding offer visible**
- Steps:
  1. Navigate to `/pricing` while spots remain
- Expected:
  - Founding offer card visible at $19/year
  - Spots counter displayed

**TC-PRICE-005: Pricing — Pro subscriber**
- Steps:
  1. Log in as Pro subscriber, navigate to `/pricing`
- Expected:
  - Pro shows "Current Plan"
  - Premium and Career+ show upgrade options

---

## 3. Stripe Checkout — Subscriptions

**TC-STRIPE-001: Pro monthly — success**
- Pre-condition: Free account, Stripe test mode active
- Steps:
  1. Navigate to `/pricing`, click "Upgrade to Pro" (Monthly)
  2. Enter card `4242 4242 4242 4242`, exp `12/26`, CVC `123`
  3. Complete checkout
- Expected:
  - Redirected to `/welcome`
  - `plan` = `pro`, `stripe_subscription_id` stored
  - `subscription_status` = `active` or `trialing`
  - Pro features unlocked

**TC-STRIPE-002: Pro monthly — 7-day trial**
- Steps: Same as TC-STRIPE-001
- Expected:
  - `subscription_status` = `trialing`
  - Pro features immediately accessible
  - No charge until trial ends (verify in Stripe dashboard)

**TC-STRIPE-003: Pro annual — success**
- Steps:
  1. Select Annual on `/pricing`, click "Upgrade to Pro"
  2. Complete checkout with test card
- Expected: `plan` = `pro`, annual subscription in Stripe

**TC-STRIPE-004: Checkout — declined card**
- Steps:
  1. Begin Pro checkout, enter card `4000 0000 0000 9995`
- Expected:
  - Stripe shows decline error
  - User remains on free plan, no subscription created

**TC-STRIPE-005: Checkout — cancel midway**
- Steps:
  1. Begin checkout, click "Back" or close Stripe tab
- Expected:
  - Returned to `/pricing?cancelled=true`
  - No subscription created, user remains free

**TC-STRIPE-006: Upgrade to Premium**
- Steps:
  1. Click "Upgrade to Premium", complete checkout
- Expected: `plan` = `premium`, Premium features unlocked

**TC-STRIPE-007: Upgrade to Career+**
- Steps:
  1. Click "Upgrade to Career+", complete checkout
- Expected: `plan` = `career_plus`, all Career+ features unlocked

**TC-STRIPE-008: Founding plan checkout**
- Pre-condition: Spots available (< 200 claimed)
- Steps:
  1. Click Founding plan upgrade, complete checkout
- Expected: `plan` = `founding`, Pro features at $19/yr

**TC-STRIPE-009: Founding plan — sold out**
- Pre-condition: 200 spots already claimed
- Steps:
  1. Attempt founding plan checkout
- Expected:
  - Edge function returns error — "Founding offer sold out"
  - No checkout session created, user sees error

**TC-STRIPE-010: Pro → Premium upgrade**
- Pre-condition: Active Pro subscriber
- Steps:
  1. Navigate to `/pricing`, click Premium upgrade
  2. Complete checkout
- Expected:
  - Old Pro subscription cancelled
  - New Premium subscription created
  - `plan` = `premium`, no duplicate subscriptions in Stripe

---

### 3.1 Webhooks

**TC-STRIPE-011: Webhook — checkout.session.completed**
- Steps:
  1. Complete a subscription checkout
  2. Check Stripe Dashboard > Webhooks for event receipt
- Expected:
  - Event processed
  - Profile updated: plan, subscription ID, period end
  - Confirmation email sent to user

**TC-STRIPE-012: Webhook — customer.subscription.updated**
- Steps:
  1. Manually update a test subscription in Stripe Dashboard
- Expected:
  - `subscription_status` and `subscription_period_end` updated in profile

**TC-STRIPE-013: Webhook — customer.subscription.deleted**
- Steps:
  1. Cancel a test subscription via Stripe Dashboard
- Expected:
  - `plan` downgraded to `free`
  - Paid features removed

**TC-STRIPE-014: Subscription sync after checkout**
- Steps:
  1. Complete checkout, observe redirect to `/welcome`
  2. Navigate to `/dashboard`
- Expected:
  - Plan reflected correctly without manual refresh
  - `verify-subscription` edge function ran

**TC-STRIPE-015: Webhook idempotency**
- Steps:
  1. Replay a Stripe webhook event via Stripe Dashboard "Resend"
- Expected:
  - Second event processed without error
  - Profile not double-updated (`stripe_events` table prevents duplicate)

---

## 4. Stripe Customer Portal

**TC-PORTAL-001: Access billing portal**
- Pre-condition: Active paid subscription
- Steps:
  1. Navigate to `/dashboard` or `/profile`
  2. Click "Manage Subscription" / "Billing Portal"
- Expected:
  - Redirected to Stripe Customer Portal
  - Current plan, invoices, cancel option visible

**TC-PORTAL-002: Cancel subscription via portal**
- Steps:
  1. Open billing portal, click "Cancel plan", confirm
- Expected:
  - Subscription cancelled
  - After effective date, `plan` downgrades to `free`

**TC-PORTAL-003: Update payment method**
- Steps:
  1. Open billing portal, update card to `4000 0566 5566 5556`
- Expected: Payment method updated, subscription continues

---

## 5. One-Time Purchases

### 5.1 Express 24-Hour Unlock ($9.99)

**TC-EXPRESS-001: Purchase — free user**
- Pre-condition: Free user, no active unlock
- Steps:
  1. Find Express Unlock CTA (dashboard or editor)
  2. Click "Express 24h Unlock — $9.99"
  3. Complete Stripe payment with test card
- Expected:
  - Redirected to `/dashboard?purchased=express_unlock`
  - `express_unlock_until` = now + 24h
  - Countdown timer (HH:MM:SS) on dashboard
  - `getEffectivePlan()` returns `pro`
  - All templates accessible, no watermark on PDF

**TC-EXPRESS-002: Verify Pro features during unlock**
- Pre-condition: Active Express Unlock
- Steps:
  1. Open editor, switch to premium template
  2. Download PDF
- Expected: Template accessible, PDF has no watermark

**TC-EXPRESS-003: Express Unlock hidden for paid users**
- Pre-condition: Active Pro subscription
- Steps:
  1. Look for Express Unlock CTA
- Expected: CTA not shown or disabled

**TC-EXPRESS-004: Expires after 24 hours**
- Pre-condition: Active Express Unlock
- Steps:
  1. Manually set `express_unlock_until` to past timestamp in DB
  2. Refresh dashboard
- Expected:
  - Countdown gone
  - `getEffectivePlan()` returns `free`
  - Watermark returns, premium templates locked

**TC-EXPRESS-005: Declined payment**
- Steps:
  1. Begin Express Unlock checkout, enter card `4000 0000 0000 9995`
- Expected: Declined in Stripe, no `express_unlock_until` set

---

### 5.2 Mock Interview Pack — 3 Sessions ($12.99)

**TC-MOCK-001: Purchase — free user**
- Steps:
  1. Navigate to `/tools/mock-interview`
  2. Find "Buy Mock Pack", complete $12.99 checkout
- Expected:
  - Redirected to `/tools/mock-interview?purchased=mock_pack`
  - `mock_sessions_purchased` += 3

**TC-MOCK-002: Purchase — Premium user topping up**
- Pre-condition: Premium user, 0 sessions remaining this month
- Steps:
  1. Purchase mock pack
- Expected: 3 sessions added to `mock_sessions_purchased`

**TC-MOCK-003: Session deducts purchased first**
- Pre-condition: 1 monthly session + 3 purchased
- Steps:
  1. Start a mock interview session
- Expected: `mock_sessions_purchased` 3→2, `mock_sessions_used` unchanged

**TC-MOCK-004: Falls back to monthly allowance**
- Pre-condition: 0 purchased + 2 monthly sessions remaining
- Steps:
  1. Start a mock interview session
- Expected: `mock_sessions_used` incremented, purchased unchanged

**TC-MOCK-005: No sessions — shows purchase prompt**
- Pre-condition: Free user, 0 sessions
- Steps:
  1. Navigate to `/tools/mock-interview`, try to start session
- Expected: Prompt to purchase pack or upgrade; session does not start

---

## 6. Resume Editor

**TC-EDITOR-001: Create resume — free user (first resume)**
- Steps:
  1. Log in as free user with no resumes
  2. Click "New Resume" → `/editor/new`
  3. Fill in name, email, experience
- Expected: Auto-saves within ~1.5s, appears in dashboard

**TC-EDITOR-002: Free user — resume limit (1)**
- Pre-condition: Free user already has 1 resume
- Steps:
  1. Click "New Resume"
- Expected: Upsell prompt — "Upgrade to Pro for more resumes". No resume created.

**TC-EDITOR-003: Pro — create up to 5 resumes**
- Pre-condition: Pro subscriber with 4 resumes
- Steps:
  1. Create 1 more (5th resume)
- Expected: Created successfully

**TC-EDITOR-004: Pro — limit enforced at 5**
- Pre-condition: Pro subscriber with 5 resumes
- Steps:
  1. Attempt to create 6th
- Expected: Upsell to Premium (10 resumes). Blocked.

**TC-EDITOR-005: Auto-save**
- Steps:
  1. Open editor, modify Summary field
  2. Wait ~2 seconds
- Expected: Status shows "Saving..." → "Saved". Refresh preserves change.

**TC-EDITOR-006: Theme selection — free (restricted)**
- Steps:
  1. Open editor as free user, browse themes
- Expected: 1 basic template available; others locked with upgrade prompt

**TC-EDITOR-007: Theme selection — Pro (all templates)**
- Steps:
  1. Open editor as Pro user, browse themes
- Expected: All 100+ templates accessible; preview updates live

**TC-EDITOR-008: ATS score visible**
- Steps:
  1. Open editor with filled resume
- Expected: ATS score (0-100) displayed, updates as content changes

**TC-EDITOR-009: Version history — Pro**
- Pre-condition: Pro user, resume edited multiple times
- Steps:
  1. Open "Version History" in editor
  2. View list, restore a previous version
- Expected: Up to 10 versions listed; restoring replaces current data

**TC-EDITOR-010: Version history — free blocked**
- Steps:
  1. Free user opens version history
- Expected: Feature locked with upgrade prompt

**TC-EDITOR-011: Delete resume**
- Steps:
  1. On dashboard, delete a resume and confirm
- Expected: Removed from list, URL no longer accessible

**TC-EDITOR-012: Edit resume title**
- Steps:
  1. Change resume title in editor or dashboard
- Expected: Title saved, dashboard reflects new name

---

## 7. PDF & Document Export

**TC-PDF-001: Download PDF — free (watermarked)**
- Steps:
  1. Log in as free user, open editor, click "Download PDF"
- Expected: PDF downloads, watermark visible, A4 size

**TC-PDF-002: Download PDF — Pro (no watermark)**
- Steps:
  1. Log in as Pro user, click "Download PDF"
- Expected: Clean PDF, no watermark, A4 size

**TC-PDF-003: Download PDF — Express Unlock active**
- Pre-condition: Free user with active Express Unlock
- Steps:
  1. Download PDF
- Expected: No watermark (treated as Pro)

**TC-PDF-004: Download DOCX — Pro**
- Steps:
  1. Log in as Pro, click "Download DOCX"
- Expected: DOCX file downloads, content matches resume

**TC-PDF-005: Download DOCX — free blocked**
- Steps:
  1. Free user attempts DOCX download
- Expected: Feature locked, upsell prompt shown

**TC-PDF-006: PDF with all sections**
- Steps:
  1. Fill all sections: personal info, summary, 2 jobs, education, 3 skills, certs, projects
  2. Download PDF
- Expected: All sections present, no overflow or cut content

---

## 8. Cover Letter Builder

**TC-COVER-001: Access — Pro user**
- Steps:
  1. Log in as Pro, navigate to `/tools/cover-letter`
- Expected: Builder loads

**TC-COVER-002: Create cover letter**
- Steps:
  1. Fill: Company Name, Job Title, Recipient, Body, Tone (Professional)
  2. Optionally link a resume, save
- Expected: Saved to DB, appears in list

**TC-COVER-003: Access — free user blocked**
- Steps:
  1. Free user navigates to `/tools/cover-letter`
- Expected: Upsell prompt or redirect to pricing

**TC-COVER-004: Delete cover letter**
- Steps:
  1. Delete a cover letter from the list
- Expected: Removed from list

---

## 9. AI Tools (Premium+)

**TC-AI-001: JD Match — Premium**
- Pre-condition: Premium subscriber
- Steps:
  1. Navigate to `/tools/ai`, paste a job description
  2. Select a resume, run JD match
- Expected: Match score and improvement suggestions returned

**TC-AI-002: AI Rewrite — Premium**
- Steps:
  1. Select "AI Rewrite" for a section (e.g. Summary)
- Expected: AI-generated rewrite shown; user can accept or discard

**TC-AI-003: AI tools — free/Pro blocked**
- Steps:
  1. Free or Pro user navigates to `/tools/ai`
- Expected: Tools locked, upsell to Premium

---

## 10. Public Resume Sharing

**TC-SHARE-001: Enable public sharing**
- Steps:
  1. On dashboard, toggle "Make Public" for a resume
- Expected: `is_public = true`, public slug generated, shareable URL displayed

**TC-SHARE-002: View as guest**
- Steps:
  1. Log out, navigate to public resume URL `/resume/[slug]`
- Expected: Resume renders with correct theme, no login required, no edit controls

**TC-SHARE-003: Disable public sharing**
- Steps:
  1. Toggle "Make Public" off
- Expected: URL returns 404 or "Not found"

---

## 11. Profile & Account

**TC-PROFILE-001: View profile**
- Steps:
  1. Navigate to `/profile`
- Expected: Name, email, current plan, account creation date all displayed

**TC-PROFILE-002: Update name**
- Steps:
  1. Edit name field, save
- Expected: Name updated in DB, reflected on page

**TC-PROFILE-003: Plan shown correctly**
- Steps:
  1. Check `/profile` for free, pro, premium, career+ accounts
- Expected: Correct plan name and subscription period end for paid plans

---

## 12. Feature Gating Matrix

| Feature | Free | Pro | Founding | Premium | Career+ |
|---------|:----:|:---:|:--------:|:-------:|:-------:|
| Max Resumes | 1 | 5 | 5 | 10 | Unlimited |
| Templates | 1 | All | All | All | All |
| Watermark-free PDF | ✗ | ✓ | ✓ | ✓ | ✓ |
| DOCX export | ✗ | ✓ | ✓ | ✓ | ✓ |
| Full ATS scan | ✗ | ✓ | ✓ | ✓ | ✓ |
| Cover letter | ✗ | ✓ | ✓ | ✓ | ✓ |
| Version history | ✗ | ✓ | ✓ | ✓ | ✓ |
| AI rewrite / JD match | ✗ | ✗ | ✗ | ✓ | ✓ |
| Monthly mock sessions | 0 | 0 | 0 | 3 | 20 |
| Interview dashboard | ✗ | ✗ | ✗ | ✗ | ✓ |

**TC-GATE-001 through TC-GATE-004:** For each plan tier, log in and verify the feature set matches the table above exactly.

---

## 13. Dashboard

**TC-DASH-001: Resume list correct**
- Steps: Log in, navigate to `/dashboard`
- Expected: All user resumes listed; no other users' data visible (RLS enforced)

**TC-DASH-002: Plan badge shown**
- Expected: Correct plan name in header/sidebar (Free / Pro / Premium / Career+ / Founding)

**TC-DASH-003: Express Unlock countdown**
- Pre-condition: Active Express Unlock
- Expected: Countdown (HH:MM:SS) visible on dashboard

**TC-DASH-004: Quick actions functional**
- Steps: Open resume, create resume, delete resume from dashboard
- Expected: Each action completes correctly

---

## 14. Welcome Page

**TC-WELCOME-001: After signup**
- Steps: Complete signup + email confirmation
- Expected: `/welcome` shows welcome message, onboarding CTA, free plan status

**TC-WELCOME-002: After paid checkout**
- Steps: Complete Pro subscription checkout
- Expected: `/welcome` confirms plan upgrade, highlights Pro features

---

## 15. General Navigation

**TC-NAV-001:** `/` loads with signup/login CTAs (logged out)
**TC-NAV-002:** `/themes` shows 100+ templates without login
**TC-NAV-003:** `/blog` lists articles and is readable
**TC-NAV-004:** `/terms`, `/privacy`, `/refund-policy`, `/cookies` all load without 404
**TC-NAV-005:** Unknown route (e.g. `/xyz123`) shows 404 page

---

## 16. Security

**TC-SEC-001: RLS — cross-user resume access**
- Steps:
  1. Get UUID of User A's resume
  2. Log in as User B, navigate to `/editor/[UserA-Resume-ID]`
- Expected: Access denied, resume data not returned

**TC-SEC-002: Unauthenticated edge function call**
- Steps: Call `create-checkout` without Authorization header
- Expected: 401 Unauthorized

**TC-SEC-003: Webhook — invalid Stripe signature**
- Steps: POST to webhook endpoint with missing/tampered `Stripe-Signature`
- Expected: 400/401 returned, event not processed

**TC-SEC-004: XSS in resume content**
- Steps:
  1. Enter `<script>alert('xss')</script>` in a resume field
  2. Generate PDF
- Expected: Script not executed; content rendered as plain text

**TC-SEC-005: Session expiry**
- Steps:
  1. Log in, let token expire (or simulate), attempt an action
- Expected: Session auto-refreshes, or user redirected to `/auth` with graceful message

---

## Test Execution Tracker

Fill in Status: `PASS` | `FAIL` | `SKIP` | `BLOCKED`

| Test ID | Description | Status | Notes | Tested By | Date |
|---------|-------------|:------:|-------|-----------|------|
| TC-AUTH-001 | Signup — valid credentials | | | | |
| TC-AUTH-002 | Signup — missing uppercase | | | | |
| TC-AUTH-003 | Signup — missing symbol | | | | |
| TC-AUTH-004 | Signup — too short | | | | |
| TC-AUTH-005 | Signup — duplicate email | | | | |
| TC-AUTH-006 | Signup — invalid email | | | | |
| TC-AUTH-007 | Signup — empty fields | | | | |
| TC-AUTH-008 | Email confirmation — success | | | | |
| TC-AUTH-009 | Email confirmation — invalid link | | | | |
| TC-AUTH-010 | Login — success | | | | |
| TC-AUTH-011 | Login — wrong password | | | | |
| TC-AUTH-012 | Login — unregistered email | | | | |
| TC-AUTH-013 | Login — unconfirmed email | | | | |
| TC-AUTH-014 | Login — empty fields | | | | |
| TC-AUTH-015 | Google OAuth — new user | | | | |
| TC-AUTH-016 | Google OAuth — existing user | | | | |
| TC-AUTH-017 | Google OAuth — cancel | | | | |
| TC-AUTH-018 | LinkedIn OAuth — new user | | | | |
| TC-AUTH-019 | LinkedIn OAuth — existing user | | | | |
| TC-AUTH-020 | Password reset — request valid email | | | | |
| TC-AUTH-021 | Password reset — unknown email | | | | |
| TC-AUTH-022 | Password reset — empty email | | | | |
| TC-AUTH-023 | Password reset — complete (valid) | | | | |
| TC-AUTH-024 | Password reset — mismatch | | | | |
| TC-AUTH-025 | Password reset — weak password | | | | |
| TC-AUTH-026 | Password reset — expired link | | | | |
| TC-AUTH-027 | Session persists on refresh | | | | |
| TC-AUTH-028 | Logout | | | | |
| TC-AUTH-029 | Protected route — logged out | | | | |
| TC-AUTH-030 | Protected route — logged in | | | | |
| TC-PRICE-001 | Pricing — guest view | | | | |
| TC-PRICE-002 | Pricing — free user | | | | |
| TC-PRICE-003 | Annual toggle | | | | |
| TC-PRICE-004 | Founding offer visible | | | | |
| TC-PRICE-005 | Pricing — Pro subscriber | | | | |
| TC-STRIPE-001 | Pro monthly — success | | | | |
| TC-STRIPE-002 | Pro monthly — 7-day trial | | | | |
| TC-STRIPE-003 | Pro annual — success | | | | |
| TC-STRIPE-004 | Checkout — declined card | | | | |
| TC-STRIPE-005 | Checkout — cancel midway | | | | |
| TC-STRIPE-006 | Premium checkout | | | | |
| TC-STRIPE-007 | Career+ checkout | | | | |
| TC-STRIPE-008 | Founding checkout | | | | |
| TC-STRIPE-009 | Founding — sold out | | | | |
| TC-STRIPE-010 | Pro → Premium upgrade | | | | |
| TC-STRIPE-011 | Webhook — checkout.session.completed | | | | |
| TC-STRIPE-012 | Webhook — subscription.updated | | | | |
| TC-STRIPE-013 | Webhook — subscription.deleted | | | | |
| TC-STRIPE-014 | Subscription sync after checkout | | | | |
| TC-STRIPE-015 | Webhook idempotency | | | | |
| TC-PORTAL-001 | Billing portal access | | | | |
| TC-PORTAL-002 | Cancel via portal | | | | |
| TC-PORTAL-003 | Update payment method | | | | |
| TC-EXPRESS-001 | Express Unlock — purchase | | | | |
| TC-EXPRESS-002 | Express Unlock — Pro features active | | | | |
| TC-EXPRESS-003 | Express Unlock — hidden for paid users | | | | |
| TC-EXPRESS-004 | Express Unlock — expires | | | | |
| TC-EXPRESS-005 | Express Unlock — declined | | | | |
| TC-MOCK-001 | Mock Pack — purchase (free user) | | | | |
| TC-MOCK-002 | Mock Pack — Premium topup | | | | |
| TC-MOCK-003 | Session deducts purchased first | | | | |
| TC-MOCK-004 | Session falls back to monthly | | | | |
| TC-MOCK-005 | No sessions — purchase prompt | | | | |
| TC-EDITOR-001 | Create resume — free (first) | | | | |
| TC-EDITOR-002 | Free — resume limit enforced | | | | |
| TC-EDITOR-003 | Pro — create up to 5 | | | | |
| TC-EDITOR-004 | Pro — 5 limit enforced | | | | |
| TC-EDITOR-005 | Auto-save | | | | |
| TC-EDITOR-006 | Theme — free restricted | | | | |
| TC-EDITOR-007 | Theme — Pro all templates | | | | |
| TC-EDITOR-008 | ATS score visible | | | | |
| TC-EDITOR-009 | Version history — Pro | | | | |
| TC-EDITOR-010 | Version history — free blocked | | | | |
| TC-EDITOR-011 | Delete resume | | | | |
| TC-EDITOR-012 | Edit resume title | | | | |
| TC-PDF-001 | PDF — free (watermarked) | | | | |
| TC-PDF-002 | PDF — Pro (no watermark) | | | | |
| TC-PDF-003 | PDF — Express Unlock | | | | |
| TC-PDF-004 | DOCX — Pro | | | | |
| TC-PDF-005 | DOCX — free blocked | | | | |
| TC-PDF-006 | PDF all sections | | | | |
| TC-COVER-001 | Cover letter — Pro access | | | | |
| TC-COVER-002 | Create cover letter | | | | |
| TC-COVER-003 | Cover letter — free blocked | | | | |
| TC-COVER-004 | Delete cover letter | | | | |
| TC-AI-001 | JD Match — Premium | | | | |
| TC-AI-002 | AI Rewrite — Premium | | | | |
| TC-AI-003 | AI tools — free/Pro blocked | | | | |
| TC-SHARE-001 | Enable public sharing | | | | |
| TC-SHARE-002 | View as guest | | | | |
| TC-SHARE-003 | Disable public sharing | | | | |
| TC-PROFILE-001 | View profile | | | | |
| TC-PROFILE-002 | Update name | | | | |
| TC-PROFILE-003 | Plan shown correctly | | | | |
| TC-GATE-001 | Free — feature set | | | | |
| TC-GATE-002 | Pro — feature set | | | | |
| TC-GATE-003 | Premium — AI tools | | | | |
| TC-GATE-004 | Career+ — full access | | | | |
| TC-DASH-001 | Dashboard — resume list | | | | |
| TC-DASH-002 | Dashboard — plan badge | | | | |
| TC-DASH-003 | Express Unlock countdown | | | | |
| TC-DASH-004 | Quick actions | | | | |
| TC-WELCOME-001 | Welcome — after signup | | | | |
| TC-WELCOME-002 | Welcome — after paid checkout | | | | |
| TC-NAV-001 | Landing page | | | | |
| TC-NAV-002 | Themes page | | | | |
| TC-NAV-003 | Blog page | | | | |
| TC-NAV-004 | Legal pages | | | | |
| TC-NAV-005 | 404 handling | | | | |
| TC-SEC-001 | RLS — cross-user access | | | | |
| TC-SEC-002 | Unauthenticated edge function | | | | |
| TC-SEC-003 | Webhook — invalid signature | | | | |
| TC-SEC-004 | XSS in resume content | | | | |
| TC-SEC-005 | Session expiry | | | | |

---

## Stripe Test Cards Reference

| Card Number | Behavior |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Declined — insufficient funds |
| `4000 0000 0000 0002` | Declined — generic decline |
| `4000 0566 5566 5556` | Success — debit card |
| `4000 0000 0000 3220` | 3D Secure required |
| `4000 0025 0000 3155` | 3D Secure — authentication failure |

All test cards: any future expiry (e.g. `12/26`), CVC `123`, any ZIP.

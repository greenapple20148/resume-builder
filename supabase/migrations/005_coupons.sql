-- ============================================================
-- Coupons System
-- Adds coupon support to profiles + a coupons table for code management
-- ============================================================

-- Add coupon columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS coupon_plan TEXT,
  ADD COLUMN IF NOT EXISTS coupon_redeemed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS coupon_expires_at TIMESTAMPTZ;

-- ============================================================
-- COUPONS TABLE
-- Stores redeemable coupon codes with usage limits
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'pro' CHECK (plan IN ('pro', 'premium', 'career_plus')),
  duration_days INTEGER NOT NULL DEFAULT 90,  -- 3 months = ~90 days
  max_redemptions INTEGER DEFAULT NULL,       -- NULL = unlimited
  current_redemptions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NULL         -- NULL = no code-level expiry
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS coupons_code_idx ON coupons(code);

-- ============================================================
-- RPC: Redeem a coupon code
-- Validates + applies the coupon atomically
-- ============================================================
CREATE OR REPLACE FUNCTION redeem_coupon(
  user_uuid UUID,
  coupon_code_input TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_coupon RECORD;
  v_profile RECORD;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Normalize code to uppercase
  coupon_code_input := UPPER(TRIM(coupon_code_input));

  -- Check if user already has an active coupon
  SELECT * INTO v_profile FROM profiles WHERE id = user_uuid;
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  IF v_profile.coupon_expires_at IS NOT NULL AND v_profile.coupon_expires_at > NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have an active coupon. Wait for it to expire or upgrade your plan.');
  END IF;

  -- Find the coupon
  SELECT * INTO v_coupon FROM coupons
    WHERE code = coupon_code_input
    AND is_active = TRUE;

  IF v_coupon IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired coupon code.');
  END IF;

  -- Check code-level expiry
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This coupon code has expired.');
  END IF;

  -- Check redemption limit
  IF v_coupon.max_redemptions IS NOT NULL AND v_coupon.current_redemptions >= v_coupon.max_redemptions THEN
    RETURN jsonb_build_object('success', false, 'error', 'This coupon has reached its redemption limit.');
  END IF;

  -- Check if user is already on a paid plan
  IF v_profile.plan != 'free' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Coupons are only available for free-tier users. You already have a paid plan.');
  END IF;

  -- Calculate expiry
  v_expires_at := NOW() + (v_coupon.duration_days || ' days')::INTERVAL;

  -- Apply coupon to profile
  UPDATE profiles SET
    coupon_code = coupon_code_input,
    coupon_plan = v_coupon.plan,
    coupon_redeemed_at = NOW(),
    coupon_expires_at = v_expires_at
  WHERE id = user_uuid;

  -- Increment coupon redemption count
  UPDATE coupons SET
    current_redemptions = current_redemptions + 1
  WHERE code = coupon_code_input;

  RETURN jsonb_build_object(
    'success', true,
    'plan', v_coupon.plan,
    'expires_at', v_expires_at,
    'duration_days', v_coupon.duration_days
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Seed: Example coupon codes (3 months free Pro)
-- ============================================================
INSERT INTO coupons (code, plan, duration_days, max_redemptions) VALUES
  ('LAUNCH3', 'pro', 90, 500),
  ('WELCOME90', 'pro', 90, 1000),
  ('RESUME3FREE', 'pro', 90, NULL)
ON CONFLICT (code) DO NOTHING;

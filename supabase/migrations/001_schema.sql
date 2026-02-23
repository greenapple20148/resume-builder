-- ============================================================
-- ResumeBuildIn Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Extended user data beyond auth.users
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_period_end TIMESTAMPTZ,
  resume_downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RESUMES TABLE
-- ============================================================
CREATE TABLE resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  theme_id TEXT NOT NULL DEFAULT 'classic',
  data JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  public_slug TEXT UNIQUE,
  thumbnail_url TEXT,
  last_edited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX resumes_user_id_idx ON resumes(user_id);
CREATE INDEX resumes_public_slug_idx ON resumes(public_slug) WHERE public_slug IS NOT NULL;

CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STRIPE EVENTS TABLE
-- Log webhook events for idempotency
-- ============================================================
CREATE TABLE stripe_events (
  id TEXT PRIMARY KEY, -- Stripe event ID
  type TEXT NOT NULL,
  data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Resumes: users can CRUD their own
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public resumes"
  ON resumes FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Thumbnails bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true);

CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own thumbnails"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get user's resume count
CREATE OR REPLACE FUNCTION get_resume_count(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM resumes WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user can create more resumes
CREATE OR REPLACE FUNCTION can_create_resume(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  resume_count INTEGER;
BEGIN
  SELECT plan INTO user_plan FROM profiles WHERE id = user_uuid;
  SELECT COUNT(*) INTO resume_count FROM resumes WHERE user_id = user_uuid;

  RETURN CASE
    WHEN user_plan = 'free' THEN resume_count < 3
    WHEN user_plan = 'pro' THEN resume_count < 25
    WHEN user_plan = 'team' THEN TRUE
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

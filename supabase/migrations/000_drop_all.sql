-- ============================================================
-- ResumeBuildIn — DROP ALL
-- Tears down everything created by 001_schema.sql
-- Run in Supabase SQL Editor to reset the database
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. STORAGE POLICIES & BUCKETS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view thumbnails"          ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own thumbnails"     ON storage.objects;

-- NOTE: Bucket 'thumbnails' must be deleted via Supabase Dashboard > Storage
-- (Supabase blocks direct SQL deletes on storage tables)

-- ────────────────────────────────────────────────────────────
-- 2. RLS POLICIES — cover_letters
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own cover letters"    ON cover_letters;
DROP POLICY IF EXISTS "Users can insert own cover letters"  ON cover_letters;
DROP POLICY IF EXISTS "Users can update own cover letters"  ON cover_letters;
DROP POLICY IF EXISTS "Users can delete own cover letters"  ON cover_letters;

-- ────────────────────────────────────────────────────────────
-- 3. RLS POLICIES — resumes
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own resumes"          ON resumes;
DROP POLICY IF EXISTS "Users can view public resumes"       ON resumes;
DROP POLICY IF EXISTS "Users can insert own resumes"        ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes"        ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes"        ON resumes;

-- ────────────────────────────────────────────────────────────
-- 4. RLS POLICIES — profiles
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own profile"          ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile"        ON profiles;
DROP POLICY IF EXISTS "Users can update own profile"        ON profiles;

-- ────────────────────────────────────────────────────────────
-- 5. TRIGGERS
-- ────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS cover_letters_updated_at ON cover_letters;
DROP TRIGGER IF EXISTS resumes_updated_at       ON resumes;
DROP TRIGGER IF EXISTS profiles_updated_at      ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created     ON auth.users;

-- ────────────────────────────────────────────────────────────
-- 6. FUNCTIONS
-- ────────────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS can_create_resume(UUID);
DROP FUNCTION IF EXISTS get_resume_count(UUID);
DROP FUNCTION IF EXISTS update_updated_at();
DROP FUNCTION IF EXISTS handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 7. TABLES  (order respects foreign-key dependencies)
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS stripe_events   CASCADE;
DROP TABLE IF EXISTS cover_letters   CASCADE;
DROP TABLE IF EXISTS resumes         CASCADE;
DROP TABLE IF EXISTS profiles        CASCADE;

-- ────────────────────────────────────────────────────────────
-- Done — database is clean.
-- ────────────────────────────────────────────────────────────

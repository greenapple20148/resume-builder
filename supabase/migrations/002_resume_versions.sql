-- ============================================================
-- Resume Version History
-- Stores snapshots of resume data on each save (max 10 per resume)
-- ============================================================

-- Create the resume_versions table
CREATE TABLE IF NOT EXISTS resume_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  title TEXT,
  theme_id TEXT,
  version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX resume_versions_resume_id_idx ON resume_versions(resume_id);
CREATE INDEX resume_versions_user_id_idx ON resume_versions(user_id);
CREATE INDEX resume_versions_created_at_idx ON resume_versions(resume_id, created_at DESC);

-- Row Level Security
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resume versions"
  ON resume_versions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume versions"
  ON resume_versions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resume versions"
  ON resume_versions FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-prune old versions (keep last 10 per resume)
CREATE OR REPLACE FUNCTION prune_resume_versions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM resume_versions
  WHERE resume_id = NEW.resume_id
    AND id NOT IN (
      SELECT id FROM resume_versions
      WHERE resume_id = NEW.resume_id
      ORDER BY created_at DESC
      LIMIT 10
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to prune after insert
CREATE TRIGGER prune_old_versions
  AFTER INSERT ON resume_versions
  FOR EACH ROW EXECUTE FUNCTION prune_resume_versions();

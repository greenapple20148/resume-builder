ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('free', 'pro', 'team', 'premium', 'career_plus', 'founding'));

CREATE OR REPLACE FUNCTION get_founding_spots_left()
RETURNS INTEGER AS $$
DECLARE
  claimed INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO claimed FROM profiles WHERE plan = 'founding';
  IF claimed >= 100 THEN
    RETURN 0;
  ELSE
    RETURN 100 - claimed;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

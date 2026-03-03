-- Create an RPC to securely check if an email already exists
CREATE OR REPLACE FUNCTION check_email_exists(lookup_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = lookup_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

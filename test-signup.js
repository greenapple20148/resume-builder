require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const email = `test-${Date.now()}@example.com`;
  
  console.log("1. Real Signup:");
  const res1 = await supabase.auth.signUp({ email, password: 'Password123!' });
  console.log("User:", res1.data?.user ? "Exists" : "Null");
  console.log("Identities:", res1.data?.user?.identities);
  console.log("Error:", res1.error);

  console.log("\n2. Fake Signup:");
  const res2 = await supabase.auth.signUp({ email, password: 'Password123!' });
  console.log("User:", res2.data?.user ? "Exists" : "Null");
  console.log("Identities:", res2.data?.user?.identities);
  console.log("Error:", res2.error);
}
test();

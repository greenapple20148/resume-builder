import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://qirpymijflyopppicacz.supabase.co', 'sb_publishable_zZ4v8PVh9QPsKDffputivA_NFQMVHSP');

async function test() {
    const email = `test-1772571819158@example.com`; // From the previous test run

    console.log("Fake Signup (Existing Email):");
    const res2 = await supabase.auth.signUp({ email, password: 'Password123!' });
    console.log("User:", res2.data?.user ? "Exists" : "Null");
    console.log("Identities length:", res2.data?.user?.identities?.length);
    console.log("Session:", res2.data?.session);
    console.log("Error:", res2.error?.message);
}
test();

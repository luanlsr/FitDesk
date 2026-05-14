const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[key.trim()] = value;
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log("Checking master@fitdesk.com.br / master123");
  const res = await supabaseAdmin.auth.signInWithPassword({
    email: 'master@fitdesk.com.br',
    password: 'master123'
  });
  console.log('Login res:', res.data?.user?.id, res.error);

  console.log("Checking michel@emailteste.com / 123456");
  const res2 = await supabaseAdmin.auth.signInWithPassword({
    email: 'michel@emailteste.com',
    password: '123456'
  });
  console.log('Login res 2:', res2.data?.user?.id, res2.error);
}

run();

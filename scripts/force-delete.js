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

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const ids = [
  'e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01',
  'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d',
  'c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f'
];

async function run() {
  for (const id of ids) {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);
    console.log(`Delete ${id}:`, error ? error.message : "Success");
  }
}
run();

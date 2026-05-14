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

async function run() {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
        console.error("List error:", error);
    } else {
        const matching = users.filter(u => ['master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com'].includes(u.email));
        console.log("Matching users found by email:", matching.map(u => ({ id: u.id, email: u.email })));
        
        for (const u of matching) {
            console.log("Deleting by new ID:", u.id);
            await supabaseAdmin.auth.admin.deleteUser(u.id);
        }
    }
}
run();

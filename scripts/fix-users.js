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

const usersToFix = [
  { id: 'e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', email: 'master@fitdesk.com.br', password: 'master123', name: 'Admin Master' },
  { id: 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', email: 'michel@emailteste.com', password: '123456', name: 'Michel Personal' },
  { id: 'c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', email: 'ana@emailteste.com', password: '123456', name: 'Ana Trainer' }
];

async function fixUsers() {
  console.log("🛠️  Corrigindo usuários do Supabase Auth...");

  for (const u of usersToFix) {
    console.log(`\nCriando usuário via API oficial: ${u.email}`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name }
    });

    if (error) {
      console.error(`❌ Erro ao criar ${u.email}:`, error.message);
    } else {
      console.log(`✅ Usuário ${u.email} criado com sucesso via API segura! ID: ${data.user.id}`);
      
      // Update public.users to match the new ID if it changed
      if (data.user.id !== u.id) {
        console.log(`Atualizando ID no public.users de ${u.id} para ${data.user.id}...`);
        await supabaseAdmin.from('users').update({ id: data.user.id }).eq('email', u.email);
        
        // Also update any other tables referencing the old ID
        await supabaseAdmin.from('student_groups').update({ personalId: data.user.id }).eq('personalId', u.id);
        await supabaseAdmin.from('students').update({ personalId: data.user.id }).eq('personalId', u.id);
        await supabaseAdmin.from('appointments').update({ personalId: data.user.id }).eq('personalId', u.id);
        await supabaseAdmin.from('financial_entries').update({ personalId: data.user.id }).eq('personalId', u.id);
        await supabaseAdmin.from('leads').update({ personalId: data.user.id }).eq('personalId', u.id);
      }
    }
  }
  console.log("\nPronto! Você já pode logar no painel com essas senhas.");
}

fixUsers();

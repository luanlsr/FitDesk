const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Carrega as variáveis do .env manualmente (como o dotenv não está instalado globalmente)
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key.trim()] = value;
    }
  });
} catch (e) {
  console.log('Arquivo .env não encontrado.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY faltando no .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function forceResetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log("Uso: node scripts/reset-password.js <email-do-usuario> <nova-senha>");
    process.exit(1);
  }

  console.log(`Buscando usuário: ${email}...`);
  
  // Lista todos os usuários (necessário buscar via admin)
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error("Erro ao listar usuários:", listError.message);
    process.exit(1);
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`Usuário com e-mail ${email} não encontrado no Supabase Auth.`);
    process.exit(1);
  }

  console.log(`Usuário encontrado (ID: ${user.id}). Alterando senha...`);

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
    email_confirm: true // Força confirmação de email caso não esteja
  });

  if (error) {
    console.error("Erro ao alterar senha:", error.message);
  } else {
    console.log("✅ Senha alterada com sucesso! Você já pode logar no painel com a nova senha.");
  }
}

forceResetPassword();

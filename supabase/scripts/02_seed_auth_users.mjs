import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis do .env na raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRO: Faltam variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY).");
  console.error("Certifique-se de que o arquivo .env existe na raiz do projeto.");
  process.exit(1);
}

// Inicializa o cliente do Supabase usando a chave de administrador (Service Role)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Definição dos usuários de teste base
const testUsers = [
  { email: 'master@fitdesk.com.br', password: 'master123', name: 'Admin Master', role: 'MASTER' },
  { email: 'michel@emailteste.com', password: '123456', name: 'Michel Personal', role: 'PERSONAL' },
  { email: 'ana@emailteste.com', password: '123456', name: 'Ana Trainer', role: 'PERSONAL' }
];

/**
 * Script robusto para inserção (Seed) de contas no Supabase.
 * Usa a API nativa de Admin (`createUser`) para garantir a consistência
 * do hash do bcrypt e a formatação exata da tabela interna `auth.users`,
 * evitando bugs comuns como "Database error querying schema".
 */
async function seedAuthUsers() {
  console.log("🚀 Iniciando criação segura e nativa de usuários no Supabase...");

  for (const u of testUsers) {
    try {
      // 1. Verifica se o usuário já existe na plataforma de autenticação
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find(user => user.email === u.email);

      // 2. Apaga o usuário anterior (seja ele manual/SQL ou nativo)
      if (existingUser) {
        console.log(`🗑️ Deletando usuário existente: ${u.email}...`);
        await supabase.auth.admin.deleteUser(existingUser.id);
      } else {
        // Tenta limpar registros residuais diretamente no banco público por segurança
        await supabase.from('users').delete().eq('email', u.email);
      }

      // 3. Cria a conta no sistema de Auth nativo
      console.log(`✅ Criando conta usando API nativa para: ${u.email}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true, // Auto-confirma o e-mail
        user_metadata: { name: u.name }
      });

      if (createError) throw createError;

      // 4. Insere e sincroniza o perfil do usuário na tabela public.users
      console.log(`👤 Atualizando perfil público de: ${u.email}...`);
      await supabase.from('users').upsert({
        id: newUser.user.id,
        email: u.email,
        name: u.name,
        role: u.role,
        password: u.password // Opcional, usado caso o sistema legado faça alguma validação textual
      }, { onConflict: 'email' });

      console.log(`🔥 SUCESSO absoluto para ${u.email}\n`);

    } catch (err) {
      console.error(`❌ Erro processando ${u.email}:`, err);
    }
  }

  console.log("🎉 CONCLUÍDO! Todos os usuários foram recriados e o login já está disponível.");
}

seedAuthUsers();

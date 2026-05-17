/**
 * ===============================================
 * Script: seed-auth-users.mjs
 * Descrição: Cria usuários no auth.users do Supabase
 * usando o Admin SDK (sem inserir diretamente no DB)
 * 
 * Uso: node supabase/scripts/seed-auth-users.mjs
 * ===============================================
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Dados dos usuários a serem criados no auth
const SEED_USERS = [
  {
    id: 'e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01',
    email: 'master@fitdesk.com.br',
    password: 'master123',
    displayName: 'Admin Master',
    role: 'MASTER',
  },
  {
    id: 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d',
    email: 'michel@emailteste.com',
    password: '123456',
    displayName: 'Michel Personal',
    role: 'PERSONAL',
  },
  {
    id: 'c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f',
    email: 'ana@emailteste.com',
    password: '123456',
    displayName: 'Ana Trainer',
    role: 'PERSONAL',
  },
];

async function seedAuthUsers() {
  console.log('🌱 Iniciando seed de usuários de autenticação...\n');

  for (const user of SEED_USERS) {
    try {
      // Criar usuário no auth.users
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          display_name: user.displayName,
        },
        email_confirm: true, // Marca como verificado automaticamente
      });

      if (error) {
        console.warn(`⚠️  ${user.email}: ${error.message}`);
        continue;
      }

      console.log(`✅ Criado: ${user.email} (ID: ${data.user.id})`);

      // Atualizar public.users com o ID correto do auth
      const { error: updateError } = await supabase
        .from('public.users')
        .upsert({
          id: data.user.id, // Usar ID do auth.users
          name: user.displayName,
          email: user.email,
          role: user.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (updateError) {
        console.error(`❌ Erro ao atualizar public.users para ${user.email}:`, updateError.message);
      } else {
        console.log(`   └─ Perfil público sincronizado`);
      }
    } catch (err) {
      console.error(`❌ Erro crítico para ${user.email}:`, err.message);
    }
  }

  console.log('\n✨ Seed de autenticação concluído!');
  process.exit(0);
}

seedAuthUsers();

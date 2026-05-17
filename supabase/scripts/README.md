# 🌱 Seed Scripts - FitDesk

Scripts para popular dados de teste no Supabase.

## Fluxo de Execução

### 1️⃣ Primeira vez: Criar usuários no Authentication

```bash
node supabase/scripts/seed-auth-users.mjs
```

Isso vai:
- ✅ Criar os 3 usuários no `auth.users` (com senhas corretas)
- ✅ Criar as identidades em `auth.identities`
- ✅ Sincronizar automaticamente com `public.users`

**Credenciais criadas:**
- `master@fitdesk.com.br` / `master123`
- `michel@emailteste.com` / `123456`
- `ana@emailteste.com` / `123456`

### 2️⃣ Em seguida: Executar SQL seed no Supabase

Via CLI:
```bash
supabase db push  # Executa migrations
supabase db seed  # Executa seed.sql
```

Ou via Dashboard do Supabase:
1. Vá para **SQL Editor**
2. Copie o conteúdo de `supabase/seeds/seed.sql`
3. Execute

Isso vai:
- ✅ Criar grupos de alunos
- ✅ Criar alunos
- ✅ Criar exercícios
- ✅ Criar agendas
- ✅ Criar registros financeiros
- ✅ Criar leads

## ⚠️ Importante

- **SEMPRE execute seed-auth-users.mjs ANTES de seed.sql**
- Se executar seed.sql sem ter os usuários no auth, vai falhar por foreign key
- O arquivo `seed.sql` NÃO cria mais usuários com `gen_salt()` - isso é feito pelo script Node.js

## 🔄 Reset Completo

Para limpar tudo e repopar:

```bash
# 1. Dropar todas as tabelas (migração 01)
supabase db push

# 2. Recriar schema (migrações 02-07)
supabase db push

# 3. Criar usuários no auth
node supabase/scripts/seed-auth-users.mjs

# 4. Popular dados de teste
supabase db seed
```

## 📋 Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
```

O script lê de `.env.local` automaticamente.

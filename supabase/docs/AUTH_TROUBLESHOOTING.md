# Guia Definitivo: Solução de Erros do Supabase Auth (GoTrue)

Este documento registra as causas e soluções para os erros de banco de dados internos mais comuns do Supabase Auth (`GoTrue`), especificamente quando ocorrem ao tentar fazer login (`signInWithPassword`) ou ao rodar `seeds` locais e remotos.

---

## 1. O Problema: `Database error querying schema` ou `Database error checking email`

### Sintomas
- Ao tentar logar no seu app (via NextAuth ou cliente do Supabase), você recebe o erro `CredentialsSignin`.
- Nos logs de debug, a API do Supabase retorna: `AuthApiError: Database error querying schema` ou `AuthApiError: Database error checking email`.
- Você tem certeza que a senha e e-mail estão corretos.

### A Causa Raiz
Esses erros **não** são problemas no seu código JavaScript/TypeScript. Eles são erros críticos de banco de dados no nível do serviço interno do Supabase (GoTrue). Geralmente acontecem por duas razões:

1. **Inserção SQL Direta no Schema Auth (`INSERT INTO auth.users`)**: 
   Quando você roda um arquivo `seed.sql` que faz inserts manuais pesados no `auth.users`, se você esquecer de declarar as colunas de tokens (`confirmation_token`, `email_change`, etc.) com strings vazias (`''`) ou se esbarrar em restrições únicas (ex: `phone`), o parser nativo do GoTrue falha catastroficamente ao tentar escanear o usuário do banco, gerando o erro de schema.
   
2. **Perda de Permissões Críticas do GoTrue**:
   Se você executar scripts como `DROP SCHEMA extensions CASCADE;` seguido de `CREATE SCHEMA extensions;`, você acidentalmente revoga os acessos da conta interna `supabase_auth_admin`. Como o GoTrue usa o tipo `citext` (que vive no schema `extensions`) para ler e-mails, a perda de permissão causa "Acesso Negado" silencioso no banco, resultando no erro `Database error checking email`.

---

## 2. A Solução (A Cura Definitiva)

Para resolver esses cenários, abandonamos as inserções diretas via SQL no `auth.users` e criamos ferramentas dedicadas.

### 🛠️ Script 1: Restaurar Permissões (SQL)
Se o seu banco na nuvem perdeu o acesso às extensões, você deve executar o script de cura no SQL Editor.
**Arquivo:** `supabase/scripts/01_fix_auth_permissions.sql`
**Uso:** Copie o conteúdo e rode no SQL Editor do Supabase (Dashboard Web). Isso restaura instantaneamente os privilégios da `supabase_auth_admin`.

### 🛠️ Script 2: Popular Usuários via API Oficial (Node.js)
Nunca mais crie usuários de teste usando `INSERT INTO auth.users`. O script JS oficial usa a função `admin.createUser()` da API nativa, que formata o hash da senha usando os parâmetros perfeitos do bcrypt que o GoTrue espera, e insere todos os registros auxiliares no `auth.identities` e `public.users` sem falhas.
**Arquivo:** `supabase/scripts/02_seed_auth_users.mjs`
**Uso:** Rode no terminal: `node supabase/scripts/02_seed_auth_users.mjs`

---

## 3. Prevenção para o Futuro
1. **Migrations Seguras:** Evite comandos agressivos de `DROP SCHEMA` em produção. Use `DROP TABLE IF EXISTS public.tabela CASCADE;`.
2. **Hashes de Senha:** O Postgres possui o `crypt('senha', gen_salt('bf', 10))`, mas as novas versões do GoTrue são estritas. Se precisar de usuários de teste consistentes e à prova de balas, use o script `02_seed_auth_users.mjs`.

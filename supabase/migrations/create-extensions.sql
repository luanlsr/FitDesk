-- 1. Recria o schema obrigatório do Supabase
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Restaura as permissões vitais do schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- 3. (Opcional) Recria extensões cruciais caso tenham se perdido
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- 4. Acorda a API!
NOTIFY pgrst, 'reload schema';

-- ==========================================
-- FitDesk - Migration: 02_create_extensions
-- Descrição: Configuração e permissões do schema
-- de extensões e ativação de módulos criptográficos.
-- ==========================================

-- 1. RECRIA O SCHEMA OBRIGATÓRIO DE EXTENSÕES
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. RESTAURA AS PERMISSÕES VITAIS DO SCHEMA
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- 3. RECRIA EXTENSÕES CRUCIAIS PARA CRIPTOGRAFIA E IDS ÚNICOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA extensions;

-- 4. RECARREGAR O CACHE DO POSTGREST API
NOTIFY pgrst, 'reload schema';

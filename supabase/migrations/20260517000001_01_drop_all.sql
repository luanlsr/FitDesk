-- ==========================================
-- FitDesk - Migration: 01_drop_all
-- Descrição: Limpeza total e agressiva de tabelas,
-- views, funções customizadas e dados de teste.
-- Remove TODO o banco inclusive auth em cascata.
-- ==========================================

-- 1. DELETAR TODAS AS VIEWS DO SCHEMA PUBLIC (Evita conflitos de dependências)
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP 
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE'; 
    END LOOP; 
END $$;

-- 2. DELETAR APENAS AS FUNÇÕES CUSTOMIZADAS DO SCHEMA PUBLIC (Protege funções nativas/extensões)
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (
        SELECT p.oid::regprocedure as func_name 
        FROM pg_proc p
        LEFT JOIN pg_depend d ON d.objid = p.oid AND d.deptype = 'e'
        WHERE p.pronamespace = 'public'::regnamespace 
        AND d.objid IS NULL
    ) LOOP 
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || r.func_name || ' CASCADE'; 
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Pulando função travada: %', r.func_name;
        END;
    END LOOP; 
END $$;

-- 3. DELETAR TODAS AS TABELAS DO SCHEMA PUBLIC (Limpeza completa do modelo)
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS anamneses CASCADE;
DROP TABLE IF EXISTS workout_items CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS library_exercises CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS financial_entries CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS student_groups CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- 4. DELETAR TODOS OS USUÁRIOS DO AUTH EM CASCATA
-- Remove identidades primeiro para evitar constraint violations
DELETE FROM auth.identities;

-- Remove todos os usuarios do auth (sem filtro - limpa tudo)
DELETE FROM auth.users;

-- 5. RESTAURAR E GARANTIR PERMISSÕES PADRÃO DO POSTGREST
-- Isso garante que a próxima migração possa criar tabelas e fazer ALTER com sucesso
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- Notifica o PostgREST para recarregar schema
NOTIFY pgrst, 'reload schema';


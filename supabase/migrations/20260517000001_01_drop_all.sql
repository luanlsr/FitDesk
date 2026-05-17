-- ==========================================
-- FitDesk - Migration: 01_drop_all
-- Descrição: Limpeza total e agressiva de tabelas,
-- views, funções customizadas e dados de teste.
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

-- 4. LIMPAR USUÁRIOS DE TESTE DO SCHEMA AUTH PELO E-MAIL (Evita chaves duplicadas no auth.users)
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com')
);
DELETE FROM auth.users WHERE email IN ('master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com');

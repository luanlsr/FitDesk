-- =========================================================================
-- SCRIPT DE CORREÇÃO: PERMISSÕES DO SUPABASE AUTH (GoTrue)
-- Execute este script no SQL Editor do seu painel Supabase caso o
-- login passe a falhar com: "Database error checking email"
-- =========================================================================

-- 1. Restaura o acesso global ao schema de extensões para as roles internas
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role, supabase_auth_admin, dashboard_user;

-- 2. Restaura o acesso ao schema public para a rotina de Auth e gatilhos
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;

-- 3. Concede privilégios de execução a todas as funções criptográficas e utilitárias 
--    (usa um bloco DO seguro que pula silenciosamente funções de sistema trancadas)
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (
        SELECT p.oid::regprocedure as func_name 
        FROM pg_proc p
        WHERE p.pronamespace = 'extensions'::regnamespace
    ) LOOP 
        BEGIN
            EXECUTE 'GRANT EXECUTE ON FUNCTION ' || r.func_name || ' TO postgres, anon, authenticated, service_role, supabase_auth_admin, dashboard_user'; 
        EXCEPTION WHEN OTHERS THEN
            -- Ignora silenciosamente funções trancadas do sistema (ex: pg_stat_statements_reset)
        END;
    END LOOP; 
END $$;

-- 4. Limpa possíveis registros de usuários manuais quebrados que causem conflito
DELETE FROM auth.identities WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('michel@emailteste.com', 'master@fitdesk.com.br', 'ana@emailteste.com')
);
DELETE FROM auth.users WHERE email IN ('michel@emailteste.com', 'master@fitdesk.com.br', 'ana@emailteste.com');
DELETE FROM public.users WHERE email IN ('michel@emailteste.com', 'master@fitdesk.com.br', 'ana@emailteste.com');

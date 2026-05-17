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
-- ==========================================
-- FitDesk - Migration: 03_create_schema
-- Descrição: Criação completa de tabelas, chaves
-- estrangeiras, ativação de RLS e políticas de segurança.
-- ==========================================

-- 1. CRIAÇÃO DAS TABELAS DO BANCO DE DADOS

CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text UNIQUE,
  "emailVerified" timestamp with time zone,
  image text,
  password text,
  role text DEFAULT 'PERSONAL',
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  cpf text,
  email text,
  phone text,
  "birthDate" timestamp with time zone,
  gender text,
  status text DEFAULT 'Ativo',
  goal text,
  "startDate" timestamp with time zone DEFAULT now(),
  "paymentDay" integer,
  "planValue" double precision,
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "groupId" uuid REFERENCES public.student_groups(id) ON DELETE SET NULL,
  "associatedUserId" uuid REFERENCES public.users(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  start timestamp with time zone NOT NULL,
  "end" timestamp with time zone NOT NULL,
  status text DEFAULT 'Agendado',
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "studentId" uuid REFERENCES public.students(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.financial_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount double precision NOT NULL,
  type text NOT NULL,
  category text NOT NULL,
  date timestamp with time zone DEFAULT now(),
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "studentId" uuid REFERENCES public.students(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  origin text,
  value double precision DEFAULT 0,
  status text DEFAULT 'Aguardando',
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.library_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  "videoUrl" text,
  "imageUrl" text,
  description text,
  "personalId" uuid REFERENCES public.users(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workouts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  "studentId" uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workout_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "workoutId" uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  "exerciseId" uuid NOT NULL REFERENCES public.library_exercises(id) ON DELETE CASCADE,
  sets integer NOT NULL,
  reps text NOT NULL,
  weight text,
  rest text,
  "createdAt" timestamp with time zone DEFAULT now()
);

-- 2. HABILITAÇÃO DO ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.library_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workout_items ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE CONTROLE DE ACESSO (SEGURANÇA DO TENANT)
CREATE POLICY "Users access own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Groups access" ON public.student_groups FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Students access" ON public.students FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Appointments access" ON public.appointments FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Financial access" ON public.financial_entries FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Leads access" ON public.leads FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Workouts access" ON public.workouts FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Exercises access" ON public.library_exercises FOR ALL USING (auth.uid() = "personalId" OR "personalId" IS NULL);
CREATE POLICY "Workout items access" ON public.workout_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE public.workouts.id = public.workout_items."workoutId" 
    AND public.workouts."personalId" = auth.uid()
  )
);

-- 4. RESTAURAR E GARANTIR PERMISSÕES PADRÃO DO POSTGREST DO SUPABASE
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 5. RECARREGAR O CACHE DO POSTGREST API
NOTIFY pgrst, 'reload schema';
-- ==========================================
-- FitDesk - Migration: 04_add_consent_fields
-- Descrição: Adiciona colunas para rastreabilidade de
-- consentimento (LGPD Art. 8) na tabela users.
-- ==========================================

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS "lgpd_consent_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "lgpd_consent_version" text;

-- Notifica o PostgREST para atualizar o schema cache
NOTIFY pgrst, 'reload schema';
-- ==========================================
-- FitDesk - Migration: 05_audit_logs
-- Descrição: Cria tabela para logs de auditoria
-- conforme Art. 37 da LGPD.
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID NOT NULL,
  action TEXT NOT NULL,          -- ex: 'student.create', 'student.delete'
  "resourceId" UUID,
  "resourceType" TEXT,
  metadata JSONB,
  "ipAddress" INET,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política de RLS: o personal pode ver apenas os logs onde ele mesmo disparou a ação
CREATE POLICY "Personal visualiza seus próprios logs"
ON audit_logs FOR SELECT
USING (auth.uid() = "userId");

-- Inserções geralmente são feitas pela aplicação via admin/server action (service_role ou trigger).
-- Se a inserção for via banco autenticado, permitimos insert:
CREATE POLICY "Permitir inserção de log pelo usuário autenticado"
ON audit_logs FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Notifica o PostgREST para atualizar o schema cache
NOTIFY pgrst, 'reload schema';
-- ======================================================
-- FitDesk - Migration: 06_master_features_and_student_access
-- Descrição: Expansão do schema para suporte a multi-planos,
-- assinaturas de alunos (Asaas), anamneses e avaliações.
-- ======================================================

-- 1. ADICIONAR NOVAS COLUNAS NAS TABELAS EXISTENTES
ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS "plan" text DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS "plan_status" text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "username" text UNIQUE,
ADD COLUMN IF NOT EXISTS "asaas_customer_id" text,
ADD COLUMN IF NOT EXISTS "asaas_subscription_id" text,
ADD COLUMN IF NOT EXISTS "sales_plan_value" double precision DEFAULT 199.90,
ADD COLUMN IF NOT EXISTS "sales_plan_description" text DEFAULT 'Consultoria Fitness Completa';

ALTER TABLE IF EXISTS public.students 
ADD COLUMN IF NOT EXISTS "asaas_customer_id" text,
ADD COLUMN IF NOT EXISTS "asaas_subscription_id" text,
ADD COLUMN IF NOT EXISTS "plan_status" text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "plan_name" text DEFAULT 'Mensal',
ADD COLUMN IF NOT EXISTS "asaas_card_token" text;

-- 2. CRIAR TABELA DE ANAMNESES (CRIPTOGRAFIA DE DADOS SENSÍVEIS NA APLICAÇÃO)
CREATE TABLE IF NOT EXISTS anamneses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "studentId" uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "encryptedData" text NOT NULL, -- Dados médicos e pessoais em JSON AES-256-GCM
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- 3. CRIAR TABELA DE AVALIAÇÕES (FÍSICA, NEUROMOTORA E POSTURAL)
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "studentId" uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "encryptedData" text NOT NULL, -- Perímetros, dobras cutâneas, desvios e testes em JSON AES-256-GCM
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- 4. HABILITAR RLS NAS NOVAS TABELAS
ALTER TABLE anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- 5. ATUALIZAR E CRIAR APÓLICES DE SEGURANÇA RLS PARA OS ALUNOS
-- Como os alunos agora acessam a plataforma, precisamos permitir que leiam e editem dados específicos deles.

-- 5.1 Students RLS
DROP POLICY IF EXISTS "Students access" ON students;
DROP POLICY IF EXISTS "Students self access" ON students;
DROP POLICY IF EXISTS "Students self select access" ON students;
DROP POLICY IF EXISTS "Students self update access" ON students;
CREATE POLICY "Students personal access" ON students FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Students self select access" ON students FOR SELECT USING (auth.uid() = "associatedUserId");
CREATE POLICY "Students self update access" ON students FOR UPDATE USING (auth.uid() = "associatedUserId");

-- 5.2 Workouts RLS
DROP POLICY IF EXISTS "Workouts access" ON workouts;
DROP POLICY IF EXISTS "Workouts personal access" ON workouts;
DROP POLICY IF EXISTS "Workouts student access" ON workouts;
CREATE POLICY "Workouts personal access" ON workouts FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Workouts student access" ON workouts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = workouts."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 5.3 Workout Items RLS
DROP POLICY IF EXISTS "Workout items access" ON workout_items;
DROP POLICY IF EXISTS "Workout items personal access" ON workout_items;
DROP POLICY IF EXISTS "Workout items student access" ON workout_items;
CREATE POLICY "Workout items personal access" ON workout_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_items."workoutId" 
    AND workouts."personalId" = auth.uid()
  )
);
CREATE POLICY "Workout items student access" ON workout_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM workouts 
    JOIN students ON students.id = workouts."studentId"
    WHERE workouts.id = workout_items."workoutId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 5.4 Appointments RLS
DROP POLICY IF EXISTS "Appointments access" ON appointments;
DROP POLICY IF EXISTS "Appointments personal access" ON appointments;
DROP POLICY IF EXISTS "Appointments student access" ON appointments;
CREATE POLICY "Appointments personal access" ON appointments FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Appointments student access" ON appointments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = appointments."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 5.5 Anamneses RLS
DROP POLICY IF EXISTS "Anamnese personal access" ON anamneses;
DROP POLICY IF EXISTS "Anamnese student access" ON anamneses;
CREATE POLICY "Anamnese personal access" ON anamneses FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Anamnese student access" ON anamneses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = anamneses."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 5.6 Evaluations RLS
DROP POLICY IF EXISTS "Evaluations personal access" ON evaluations;
DROP POLICY IF EXISTS "Evaluations student access" ON evaluations;
CREATE POLICY "Evaluations personal access" ON evaluations FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Evaluations student access" ON evaluations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = evaluations."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 6. POPULAR CATEGORIA DE ALONGAMENTOS NA BIBLIOTECA DE EXERCÍCIOS
INSERT INTO library_exercises (name, category, description, "personalId") VALUES
  ('Alongamento de Isquiotibiais (Sentado)', 'Alongamento', 'Sente com pernas estendidas e tente tocar a ponta dos pés, mantendo o joelho estendido.', NULL),
  ('Alongamento de Quadríceps (Em pé)', 'Alongamento', 'De pé, flexione uma perna puxando o calcanhar em direção ao glúteo. Mantenha os joelhos alinhados.', NULL),
  ('Alongamento de Panturrilha na Parede', 'Alongamento', 'Apoie as mãos na parede, dê um passo para trás e force o calcanhar do pé traseiro contra o chão.', NULL),
  ('Alongamento Peitoral no Batente', 'Alongamento', 'Apoie o antebraço no batente de uma porta e gire o tronco para o lado oposto suavemente.', NULL),
  ('Alongamento Lombar (Postura da Criança)', 'Alongamento', 'Ajoelhe-se no chão, sente sobre os calcanhares e estenda os braços à frente no chão, relaxando o tronco.', NULL),
  ('Alongamento de Tríceps', 'Alongamento', 'Eleve o braço sobre a cabeça, flexione o cotovelo apontando-o para cima e use a outra mão para puxar levemente.', NULL)
ON CONFLICT DO NOTHING;

-- Notifica o cache do PostgREST
NOTIFY pgrst, 'reload schema';
-- FitDesk - Migration: 07_workout_logs
-- Descrição: Cria tabela para histórico de execução e conclusão de treinos (Workout Logs)

CREATE TABLE IF NOT EXISTS public.workout_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "workoutId" uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  "studentId" uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  "personalId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "workoutName" text NOT NULL,
  "completedAt" timestamp with time zone DEFAULT now() NOT NULL,
  "duration" integer DEFAULT 0, -- em minutos
  "feedback" text,
  "details" jsonb NOT NULL -- representação detalhada das séries/reps marcadas pelo aluno
);

-- Habilitar RLS
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Personal visualiza todos os logs de seus alunos" 
ON public.workout_logs FOR SELECT 
USING (auth.uid() = "personalId");

CREATE POLICY "Aluno visualiza seus próprios logs" 
ON public.workout_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = workout_logs."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

CREATE POLICY "Aluno insere seus próprios logs" 
ON public.workout_logs FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = workout_logs."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

CREATE POLICY "Personal insere logs para seus alunos" 
ON public.workout_logs FOR INSERT 
WITH CHECK (auth.uid() = "personalId");

-- Recarregar schema para PostgREST
NOTIFY pgrst, 'reload schema';
-- ==========================================
-- FitDesk - Seed: seed.sql
-- Descrição: Inserts e população de dados de
-- exemplo para testes integrados e locais.
-- ==========================================

-- Garante que a extensão pgcrypto está disponível no schema público ou de busca
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================================
-- ATENÇÃO CRÍTICA: CRIAÇÃO DE USUÁRIOS NO AUTH
-- 
-- Os usuários NO AUTHENTICATION devem ser criados via script Node.js:
-- node supabase/scripts/seed-auth-users.mjs
--
-- ESTE SCRIPT APENAS INSERE NO public.users APÓS o auth estar populado.
-- O ID dos usuários em public.users DEVE CORRESPONDER AO ID EM auth.users
-- =========================================================================

-- IMPORTANTE: Execute o script de auth ANTES de rodar este seed!
-- Senão as foreign keys falharão.

-- 1. USUÁRIOS NO SCHEMA PUBLIC (vinculados ao auth.users via ID)
-- Estes dados são sincronizados pelo seed-auth-users.mjs
INSERT INTO public.users (id, name, email, role) VALUES 
  ('e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', 'Admin Master', 'master@fitdesk.com.br', 'MASTER'),
  ('f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'Michel Personal', 'michel@emailteste.com', 'PERSONAL'),
  ('c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', 'Ana Trainer', 'ana@emailteste.com', 'PERSONAL')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- 4. GRUPOS DE ESTUDANTES
INSERT INTO student_groups (id, name, description, color, "personalId") VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Emagrecimento', 'Foco em queima calórica', '#ef4444', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Hipertrofia', 'Ganho de massa muscular', '#10b981', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Terceira Idade', 'Mobilidade e força', '#3b82f6', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d')
ON CONFLICT (id) DO NOTHING;

-- 5. ESTUDANTES/ALUNOS
INSERT INTO students (id, name, email, status, goal, "planValue", "paymentDay", "personalId", "groupId") VALUES 
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'João da Silva', 'joao@email.com', 'Ativo', 'Perder 10kg', 350, 10, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
  ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Beatriz Santos', 'beatriz@email.com', 'Ativo', 'Massa Muscular', 400, 5, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'),
  ('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Carlos Souza', 'carlos@email.com', 'Ativo', 'Condicionamento', 300, 20, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f')
ON CONFLICT (id) DO NOTHING;

-- 6. BIBLIOTECA DE EXERCÍCIOS
INSERT INTO library_exercises (id, name, category, description, "personalId") VALUES
  ('64be5296-a19f-4318-b2a8-12c82301bfa8', 'Agachamento Livre', 'Pernas', 'Manter coluna ereta e joelhos alinhados', NULL),
  ('74ce5296-a19f-4318-b2a8-12c82301bfa9', 'Supino Reto', 'Peitoral', 'Controle da descida até o peito', NULL),
  ('84de5296-a19f-4318-b2a8-12c82301bfaa', 'Levantamento Terra', 'Costas', 'Foco na postura lombar', NULL),
  ('94ee5296-a19f-4318-b2a8-12c82301bfab', 'Rosca Direta', 'Biceps', 'Isolamento do movimento de cotovelo', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d')
ON CONFLICT (id) DO NOTHING;

-- 7. AGENDA DE COMPROMISSOS
INSERT INTO appointments (title, start, "end", "personalId", "studentId", status)
SELECT 
  'Treino Personal - ' || s.name,
  d + (h || ' hours')::interval,
  d + (h + 1 || ' hours')::interval,
  'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d',
  s.id,
  'Agendado'
FROM 
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '15 days', INTERVAL '1 day') AS d
CROSS JOIN 
  (VALUES (8), (14), (19)) AS h(h)
JOIN 
  (SELECT id, name FROM students WHERE "personalId" = 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d' LIMIT 1) s ON true;

-- 8. REGISTROS FINANCEIROS (Receitas de mensalidades)
INSERT INTO financial_entries (description, amount, type, category, date, "personalId", "studentId")
SELECT 
  'Mensalidade - ' || s.name,
  s."planValue",
  'IN',
  'Mensalidade',
  CURRENT_DATE - INTERVAL '1 month' + (s."paymentDay" || ' days')::interval,
  'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d',
  s.id
FROM students s WHERE s."personalId" = 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d';

-- Despesas administrativas de exemplo
INSERT INTO financial_entries (description, amount, type, category, date, "personalId") VALUES
  ('Aluguel Sala de Avaliação', 1200, 'OUT', 'Infraestrutura', CURRENT_DATE - INTERVAL '5 days', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('Campanha Marketing Redes', 300, 'OUT', 'Marketing', CURRENT_DATE - INTERVAL '10 days', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

-- 9. CAPTAÇÃO DE LEADS COMERCIAIS
INSERT INTO leads (name, email, phone, origin, value, status, "personalId") VALUES
  ('Fabio Nunes', 'fabio@leads.com', '11911112222', 'Instagram', 400, 'Aguardando', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('Gisele Barbosa', 'gisele@leads.com', '11933334444', 'Indicação', 350, 'Em Negociação', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

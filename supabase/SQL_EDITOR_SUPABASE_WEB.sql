-- =========================================================================
-- FITDESK - SCRIPT DE RESET E RE-INICIALIZAÇÃO COMPLETA (Hosted Supabase)
-- Execute este script completo no seu SQL Editor do Supabase (Web Dashboard).
-- Ele limpa a estrutura antiga pública, recria as tabelas/políticas e popula os seeds.
-- =========================================================================

-- ==========================================
-- PASSO 1: LIMPEZA COMPLETA (01_drop_all)
-- ==========================================

-- Deleta views públicas
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP 
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE'; 
    END LOOP; 
END $$;

-- Deleta apenas funções customizadas do schema public (evita tocar em funções nativas/extensões)
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
            RAISE NOTICE 'Pulando função: %', r.func_name;
        END;
    END LOOP; 
END $$;

-- Deleta tabelas públicas antigas
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

-- Limpa usuários de teste do auth.users (evita duplicidade no auth)
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com')
);
DELETE FROM auth.users WHERE email IN ('master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com');


-- ==========================================
-- PASSO 2: CRIAÇÃO DO SCHEMA (03_create_schema)
-- ==========================================

CREATE TABLE users (
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

CREATE TABLE student_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE students (
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
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "groupId" uuid REFERENCES student_groups(id) ON DELETE SET NULL,
  "associatedUserId" uuid REFERENCES users(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  start timestamp with time zone NOT NULL,
  "end" timestamp with time zone NOT NULL,
  status text DEFAULT 'Agendado',
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "studentId" uuid REFERENCES students(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE financial_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount double precision NOT NULL,
  type text NOT NULL,
  category text NOT NULL,
  date timestamp with time zone DEFAULT now(),
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "studentId" uuid REFERENCES students(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  origin text,
  value double precision DEFAULT 0,
  status text DEFAULT 'Aguardando',
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE library_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  "videoUrl" text,
  "imageUrl" text,
  description text,
  "personalId" uuid REFERENCES users(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE workouts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  "studentId" uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

CREATE TABLE workout_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "workoutId" uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  "exerciseId" uuid NOT NULL REFERENCES library_exercises(id) ON DELETE CASCADE,
  sets integer NOT NULL,
  reps text NOT NULL,
  weight text,
  rest text,
  "createdAt" timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_items ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users access own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Groups access" ON student_groups FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Students access" ON students FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Appointments access" ON appointments FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Financial access" ON financial_entries FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Leads access" ON leads FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Workouts access" ON workouts FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Exercises access" ON library_exercises FOR ALL USING (auth.uid() = "personalId" OR "personalId" IS NULL);
CREATE POLICY "Workout items access" ON workout_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_items."workoutId" 
    AND workouts."personalId" = auth.uid()
  )
);

-- ==========================================
-- PASSO 3: CONCENTIMENTO LGPD (04_add_consent_fields)
-- ==========================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "lgpd_consent_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "lgpd_consent_version" text;


-- ==========================================
-- PASSO 4: AUDITORIA LGPD (05_audit_logs)
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID NOT NULL,
  action TEXT NOT NULL,
  "resourceId" UUID,
  "resourceType" TEXT,
  metadata JSONB,
  "ipAddress" INET,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Personal visualiza seus próprios logs"
ON audit_logs FOR SELECT
USING (auth.uid() = "userId");

CREATE POLICY "Permitir inserção de log pelo usuário autenticado"
ON audit_logs FOR INSERT
WITH CHECK (auth.uid() = "userId");


-- ==========================================
-- PASSO 5: POPULAÇÃO DE SEEDS (seed)
-- ==========================================

-- =========================================================================
-- ATENÇÃO CRÍTICA: NÃO INSIRA DIRETAMENTE NA TABELA auth.users!
-- Para criar as contas de teste com senhas funcionais, rode na sua máquina:
-- node supabase/scripts/02_seed_auth_users.mjs
-- =========================================================================

-- 1. Popula public.users (O Auth é populado separamente via API)
INSERT INTO public.users (id, name, email, password, role) VALUES 
  ('e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', 'Admin Master', 'master@fitdesk.com.br', crypt('master123', gen_salt('bf', 10)), 'MASTER'),
  ('f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'Michel Personal', 'michel@emailteste.com', crypt('123456', gen_salt('bf', 10)), 'PERSONAL'),
  ('c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', 'Ana Trainer', 'ana@emailteste.com', crypt('123456', gen_salt('bf', 10)), 'PERSONAL')
ON CONFLICT (id) DO UPDATE SET 
  password = EXCLUDED.password;

-- 4. Popula student_groups
INSERT INTO student_groups (id, name, description, color, "personalId") VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Emagrecimento', 'Foco em queima calórica', '#ef4444', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Hipertrofia', 'Ganho de massa muscular', '#10b981', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Terceira Idade', 'Mobilidade e força', '#3b82f6', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d')
ON CONFLICT (id) DO NOTHING;

-- 5. Popula students
INSERT INTO students (id, name, email, status, goal, "planValue", "paymentDay", "personalId", "groupId") VALUES 
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'João da Silva', 'joao@email.com', 'Ativo', 'Perder 10kg', 350, 10, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
  ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Beatriz Santos', 'beatriz@email.com', 'Ativo', 'Massa Muscular', 400, 5, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'),
  ('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Carlos Souza', 'carlos@email.com', 'Ativo', 'Condicionamento', 300, 20, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f')
ON CONFLICT (id) DO NOTHING;

-- 6. Popula library_exercises
INSERT INTO library_exercises (id, name, category, description, "personalId") VALUES
  ('64be5296-a19f-4318-b2a8-12c82301bfa8', 'Agachamento Livre', 'Pernas', 'Manter coluna ereta e joelhos alinhados', NULL),
  ('74ce5296-a19f-4318-b2a8-12c82301bfa9', 'Supino Reto', 'Peitoral', 'Controle da descida até o peito', NULL),
  ('84de5296-a19f-4318-b2a8-12c82301bfaa', 'Levantamento Terra', 'Costas', 'Foco na postura lombar', NULL),
  ('94ee5296-a19f-4318-b2a8-12c82301bfab', 'Rosca Direta', 'Biceps', 'Isolamento do movimento de cotovelo', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d')
ON CONFLICT (id) DO NOTHING;

-- 7. Popula appointments
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

-- 8. Popula financial_entries
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

INSERT INTO financial_entries (description, amount, type, category, date, "personalId") VALUES
  ('Aluguel Sala de Avaliação', 1200, 'OUT', 'Infraestrutura', CURRENT_DATE - INTERVAL '5 days', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('Campanha Marketing Redes', 300, 'OUT', 'Marketing', CURRENT_DATE - INTERVAL '10 days', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

-- 9. Popula leads
INSERT INTO leads (name, email, phone, origin, value, status, "personalId") VALUES
  ('Fabio Nunes', 'fabio@leads.com', '11911112222', 'Instagram', 400, 'Aguardando', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  ('Gisele Barbosa', 'gisele@leads.com', '11933334444', 'Indicação', 350, 'Em Negociação', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

-- Finalização
NOTIFY pgrst, 'reload schema';

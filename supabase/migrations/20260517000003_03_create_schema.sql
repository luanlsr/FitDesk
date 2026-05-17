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

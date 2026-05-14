-- RESET TOTAL E AGRESSIVO DO BANCO
-- 1. Limpar tabelas do schema public
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

-- 2. Limpar usuários do schema auth pelo E-MAIL
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com')
);
DELETE FROM auth.users WHERE email IN ('master@fitdesk.com.br', 'michel@emailteste.com', 'ana@emailteste.com');

-- RECRIAÇÃO DAS TABELAS --

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

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_items ENABLE ROW LEVEL SECURITY;

-- Políticas
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

-- SEED COMPLETO E CONECTADO AO AUTH
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  role, aud, confirmation_token, recovery_token, email_change_token_new, email_change_token_current
)
VALUES 
  ('e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', '00000000-0000-0000-0000-000000000000', 'master@fitdesk.com.br', extensions.crypt('master123', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Admin Master"}', now(), now(), 'authenticated', 'authenticated', '', '', '', ''),
  ('f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', '00000000-0000-0000-0000-000000000000', 'michel@emailteste.com', extensions.crypt('123456', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Michel Personal"}', now(), now(), 'authenticated', 'authenticated', '', '', '', ''),
  ('c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', '00000000-0000-0000-0000-000000000000', 'ana@emailteste.com', extensions.crypt('123456', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Ana Trainer"}', now(), now(), 'authenticated', 'authenticated', '', '', '', '')
ON CONFLICT (id) DO UPDATE SET 
  encrypted_password = EXCLUDED.encrypted_password,
  confirmation_token = EXCLUDED.confirmation_token,
  recovery_token = EXCLUDED.recovery_token,
  email_change_token_new = EXCLUDED.email_change_token_new,
  email_change_token_current = EXCLUDED.email_change_token_current;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
VALUES 
  (gen_random_uuid(), 'e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', format('{"sub":"%s","email":"%s"}','e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01','master@fitdesk.com.br')::jsonb, 'email', now(), now(), now(), 'e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01'),
  (gen_random_uuid(), 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', format('{"sub":"%s","email":"%s"}','f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d','michel@emailteste.com')::jsonb, 'email', now(), now(), now(), 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
  (gen_random_uuid(), 'c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', format('{"sub":"%s","email":"%s"}','c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f','ana@emailteste.com')::jsonb, 'email', now(), now(), now(), 'c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f')
ON CONFLICT (provider_id, provider) DO NOTHING;

INSERT INTO public.users (id, name, email, password, role) VALUES 
('e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', 'Admin Master', 'master@fitdesk.com.br', extensions.crypt('master123', extensions.gen_salt('bf')), 'MASTER'),
('f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'Michel Personal', 'michel@emailteste.com', extensions.crypt('123456', extensions.gen_salt('bf')), 'PERSONAL'),
('c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', 'Ana Trainer', 'ana@emailteste.com', extensions.crypt('123456', extensions.gen_salt('bf')), 'PERSONAL')
ON CONFLICT (id) DO UPDATE SET 
  password = EXCLUDED.password;

-- Grupos e Alunos
INSERT INTO student_groups (id, name, description, color, "personalId") VALUES
(gen_random_uuid(), 'Emagrecimento', 'Foco em queima calórica', '#ef4444', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
(gen_random_uuid(), 'Hipertrofia', 'Ganho de massa muscular', '#10b981', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
(gen_random_uuid(), 'Terceira Idade', 'Mobilidade e força', '#3b82f6', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

INSERT INTO students (id, name, email, status, goal, "planValue", "paymentDay", "personalId") VALUES 
(gen_random_uuid(), 'João da Silva', 'joao@email.com', 'Ativo', 'Perder 10kg', 350, 10, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
(gen_random_uuid(), 'Beatriz Santos', 'beatriz@email.com', 'Ativo', 'Massa Muscular', 400, 5, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
(gen_random_uuid(), 'Carlos Souza', 'carlos@email.com', 'Ativo', 'Condicionamento', 300, 20, 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

-- Biblioteca e Treinos
INSERT INTO library_exercises (id, name, category, description, "personalId") VALUES
(gen_random_uuid(), 'Agachamento Livre', 'Pernas', 'Manter coluna ereta e joelhos alinhados', NULL),
(gen_random_uuid(), 'Supino Reto', 'Peitoral', 'Controle da descida até o peito', NULL),
(gen_random_uuid(), 'Levantamento Terra', 'Costas', 'Foco na postura lombar', NULL),
(gen_random_uuid(), 'Rosca Direta', 'Biceps', 'Isolamento do movimento de cotovelo', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

-- Agenda, Financeiro e Leads
INSERT INTO appointments (title, start, "end", "personalId", "studentId", status)
SELECT 
  'Treino Personal - ' || s.name,
  d + (h || ' hours')::interval,
  d + (h + 1 || ' hours')::interval,
  'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d',
  s.id,
  'Agendado'
FROM 
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', INTERVAL '1 day') AS d
CROSS JOIN 
  (VALUES (8), (14), (19)) AS h(h)
JOIN 
  (SELECT id, name FROM students WHERE "personalId" = 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d' LIMIT 1) s ON true;

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
('Aluguel Sala', 1200, 'OUT', 'Infraestrutura', CURRENT_DATE - INTERVAL '5 days', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
('Marketing Digital', 300, 'OUT', 'Marketing', CURRENT_DATE - INTERVAL '10 days', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

INSERT INTO leads (name, email, phone, origin, value, status, "personalId") VALUES
('Fabio Nunes', 'fabio@leads.com', '11911112222', 'Instagram', 400, 'Aguardando', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d'),
('Gisele B.', 'gisele@leads.com', '11933334444', 'Indicação', 350, 'Em Negociação', 'f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d');

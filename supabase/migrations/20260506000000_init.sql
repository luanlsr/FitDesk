-- RESET TOTAL DO BANCO
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

-- 1. Tabelas de Usuários e Auth
CREATE TABLE users (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text,
  email text UNIQUE,
  "emailVerified" timestamp with time zone,
  image text,
  password text,
  role text DEFAULT 'PERSONAL',
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- 2. Grupos de Alunos
CREATE TABLE student_groups (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now()
);

-- 3. Tabelas Core
CREATE TABLE students (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  "studentId" uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  "personalId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
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

-- Políticas
CREATE POLICY "Users access own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Groups access" ON student_groups FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Students access" ON students FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Appointments access" ON appointments FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Financial access" ON financial_entries FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Leads access" ON leads FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Workouts access" ON workouts FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Exercises access" ON library_exercises FOR ALL USING (auth.uid() = "personalId" OR "personalId" IS NULL);

-- SEED
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'master@fitdesk.com.br', crypt('master123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Admin Master"}', now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'michel@emailteste.com', crypt('123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Michel Personal"}', now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', format('{"sub":"%s","email":"%s"}','00000000-0000-0000-0000-000000000001','master@fitdesk.com.br')::jsonb, 'email', '00000000-0000-0000-0000-000000000001', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', format('{"sub":"%s","email":"%s"}','00000000-0000-0000-0000-000000000002','michel@emailteste.com')::jsonb, 'email', '00000000-0000-0000-0000-000000000002', now(), now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, name, email, password, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'Admin Master', 'master@fitdesk.com.br', '$2a$10$fV3z3h3qR1f5K8x.7uS6z1G5y3h3qR1f5K8x.7uS6z1G5y3h3qR1', 'MASTER'),
('00000000-0000-0000-0000-000000000002', 'Michel Personal', 'michel@emailteste.com', '$2a$10$nS9y3h3qR1f5K8x.7uS6z1G5y3h3qR1f5K8x.7uS6z1G5y3h3qR1', 'PERSONAL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_groups (id, name, description, color, "personalId") VALUES
('11111111-1111-1111-1111-111111111111', 'Emagrecimento', 'Foco em queima calórica', '#ef4444', '00000000-0000-0000-0000-000000000002'),
('22222222-2222-2222-2222-222222222222', 'Hipertrofia', 'Ganho de massa muscular', '#10b981', '00000000-0000-0000-0000-000000000002'),
('33333333-3333-3333-3333-333333333333', 'Terceira Idade', 'Mobilidade e força', '#3b82f6', '00000000-0000-0000-0000-000000000002');

INSERT INTO students (id, name, email, status, goal, "planValue", "paymentDay", "personalId", "groupId") VALUES 
('aaaaaaaa-1111-1111-1111-111111111111', 'João da Silva', 'joao@email.com', 'Ativo', 'Perder 10kg', 350, 10, '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-2222-2222-2222-222222222222', 'Beatriz Santos', 'beatriz@email.com', 'Ativo', 'Massa Muscular', 400, 5, '00000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-3333-3333-3333-333333333333', 'Carlos Souza', 'carlos@email.com', 'Ativo', 'Condicionamento', 300, 20, '00000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333'),
('aaaaaaaa-4444-4444-4444-444444444444', 'Daniela Lima', 'daniela@email.com', 'Ativo', 'Flexibilidade', 350, 15, '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-5555-5555-5555-555555555555', 'Eduardo Rocha', 'eduardo@email.com', 'Inativo', 'Saúde', 250, 1, '00000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333');

INSERT INTO appointments (title, start, "end", "personalId", "studentId", status)
SELECT 
  'Treino Personal - ' || s.name,
  d + (h || ' hours')::interval,
  d + (h + 1 || ' hours')::interval,
  '00000000-0000-0000-0000-000000000002',
  s.id,
  'Agendado'
FROM 
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', INTERVAL '1 day') AS d
CROSS JOIN 
  (VALUES (8), (14), (19)) AS h(h)
JOIN 
  (SELECT id, name FROM students WHERE "personalId" = '00000000-0000-0000-0000-000000000002' LIMIT 1) s ON true;

INSERT INTO financial_entries (description, amount, type, category, date, "personalId", "studentId")
SELECT 
  'Mensalidade - ' || s.name,
  s."planValue",
  'IN',
  'Mensalidade',
  CURRENT_DATE - INTERVAL '1 month' + (s."paymentDay" || ' days')::interval,
  '00000000-0000-0000-0000-000000000002',
  s.id
FROM students s WHERE s."personalId" = '00000000-0000-0000-0000-000000000002';

INSERT INTO financial_entries (description, amount, type, category, date, "personalId") VALUES
('Aluguel Sala', 1200, 'OUT', 'Infraestrutura', CURRENT_DATE - INTERVAL '5 days', '00000000-0000-0000-0000-000000000002'),
('Marketing Digital', 300, 'OUT', 'Marketing', CURRENT_DATE - INTERVAL '10 days', '00000000-0000-0000-0000-000000000002'),
('Suplementação/Equipamento', 450, 'OUT', 'Equipamentos', CURRENT_DATE - INTERVAL '15 days', '00000000-0000-0000-0000-000000000002');

INSERT INTO leads (name, email, phone, origin, value, status, "personalId") VALUES
('Fabio Nunes', 'fabio@leads.com', '11911112222', 'Instagram', 400, 'Aguardando', '00000000-0000-0000-0000-000000000002'),
('Gisele B.', 'gisele@leads.com', '11933334444', 'Indicação', 350, 'Em Negociação', '00000000-0000-0000-0000-000000000002'),
('Hugo Boss', 'hugo@leads.com', '11955556666', 'Google', 500, 'Interessado', '00000000-0000-0000-0000-000000000002');

INSERT INTO library_exercises (name, category, description, "personalId") VALUES
('Agachamento Livre', 'Pernas', 'Manter coluna ereta e joelhos alinhados', NULL),
('Supino Reto', 'Peitoral', 'Controle da descida até o peito', NULL),
('Levantamento Terra', 'Costas', 'Foco na postura lombar', NULL),
('Rosca Direta', 'Biceps', 'Isolamento do movimento de cotovelo', '00000000-0000-0000-0000-000000000002');

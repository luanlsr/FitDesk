-- ======================================================
-- FitDesk - Migration: 06_master_features_and_student_access
-- Descrição: Expansão do schema para suporte a multi-planos,
-- assinaturas de alunos (Asaas), anamneses e avaliações.
-- ======================================================

-- 1. ADICIONAR NOVAS COLUNAS NAS TABELAS EXISTENTES
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "plan" text DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS "plan_status" text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "username" text UNIQUE,
ADD COLUMN IF NOT EXISTS "asaas_customer_id" text,
ADD COLUMN IF NOT EXISTS "asaas_subscription_id" text,
ADD COLUMN IF NOT EXISTS "sales_plan_value" double precision DEFAULT 199.90,
ADD COLUMN IF NOT EXISTS "sales_plan_description" text DEFAULT 'Consultoria Fitness Completa';

ALTER TABLE students 
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
CREATE POLICY "Appointments personal access" ON appointments FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Appointments student access" ON appointments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = appointments."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 5.5 Anamneses RLS
CREATE POLICY "Anamnese personal access" ON anamneses FOR ALL USING (auth.uid() = "personalId");
CREATE POLICY "Anamnese student access" ON anamneses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = anamneses."studentId" 
    AND students."associatedUserId" = auth.uid()
  )
);

-- 5.6 Evaluations RLS
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

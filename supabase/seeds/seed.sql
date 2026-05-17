-- ==========================================
-- FitDesk - Seed: seed.sql
-- Descrição: Inserts e população de dados de
-- exemplo para testes integrados e locais.
-- ==========================================

-- Garante que a extensão pgcrypto está disponível no schema público ou de busca
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================================================================
-- ATENÇÃO CRÍTICA: NÃO INSIRA DIRETAMENTE NA TABELA auth.users!
-- Inserções diretas com gen_salt() causam erros de hash de senha no GoTrue 
-- moderno e podem gerar "Database error querying schema" caso colunas fiquem nulas.
-- 
-- PARA POPULAR USUÁRIOS DE TESTE, RODE O SCRIPT OFICIAL NO TERMINAL:
-- node supabase/scripts/02_seed_auth_users.mjs
-- =========================================================================

-- Os inserts diretos em auth.users e auth.identities foram abolidos para 
-- manter a integridade do schema nativo do Supabase Auth.
-- A partir de agora, o seed público se encarrega apenas de criar 
-- conteúdos do sistema.

INSERT INTO public.users (id, name, email, password, role) VALUES 
  ('e7b3a4d8-c1e2-4f3a-9b5d-0e6a7b8c9d01', 'Admin Master', 'master@fitdesk.com.br', crypt('master123', gen_salt('bf', 10)), 'MASTER'),
  ('f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d', 'Michel Personal', 'michel@emailteste.com', crypt('123456', gen_salt('bf', 10)), 'PERSONAL'),
  ('c9d8e7f6-a5b4-4c3d-2e1f-0a1b2c3d4e5f', 'Ana Trainer', 'ana@emailteste.com', crypt('123456', gen_salt('bf', 10)), 'PERSONAL')
ON CONFLICT (id) DO UPDATE SET 
  password = EXCLUDED.password;

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

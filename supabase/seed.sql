-- 1. Inserir Usuários no Supabase Auth
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'master@fitdesk.com.br', crypt('master123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Admin Master"}', now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'michel@emailteste.com', crypt('123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Michel Personal"}', now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'ana@emailteste.com', crypt('123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Ana Trainer"}', now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 2. Inserir Identidades (Política de conflito ajustada para provider_id + provider)
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', format('{"sub":"%s","email":"%s"}','00000000-0000-0000-0000-000000000001','master@fitdesk.com.br')::jsonb, 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', format('{"sub":"%s","email":"%s"}','00000000-0000-0000-0000-000000000002','michel@emailteste.com')::jsonb, 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', format('{"sub":"%s","email":"%s"}','00000000-0000-0000-0000-000000000003','ana@emailteste.com')::jsonb, 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000003')
ON CONFLICT (provider_id, provider) DO NOTHING;

-- 3. Inserir na tabela pública de usuários (public.users)
INSERT INTO public.users (id, name, email, password, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'Admin Master', 'master@fitdesk.com.br', '$2a$10$fV3z3h3qR1f5K8x.7uS6z1G5y3h3qR1f5K8x.7uS6z1G5y3h3qR1', 'MASTER'),
('00000000-0000-0000-0000-000000000002', 'Michel Personal', 'michel@emailteste.com', '$2a$10$nS9y3h3qR1f5K8x.7uS6z1G5y3h3qR1f5K8x.7uS6z1G5y3h3qR1', 'PERSONAL'),
('00000000-0000-0000-0000-000000000003', 'Ana Trainer', 'ana@emailteste.com', '$2a$10$nS9y3h3qR1f5K8x.7uS6z1G5y3h3qR1f5K8x.7uS6z1G5y3h3qR1', 'PERSONAL')
ON CONFLICT (id) DO NOTHING;

-- 4. Dados Adicionais (Alunos e Agenda)
INSERT INTO students (id, name, email, phone, "planValue", "paymentDay", "personalId") VALUES 
('00000000-0000-0000-0000-000000000011', 'João Silva', 'joao@email.com', '11999999999', 250, 10, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000012', 'Maria Oliveira', 'maria@email.com', '11888888888', 300, 15, '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointments (title, start, "end", "personalId", "studentId") VALUES 
('Treino Personal João', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hours', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011'),
('Avaliação Maria', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '4 hours', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012')
ON CONFLICT (id) DO NOTHING;

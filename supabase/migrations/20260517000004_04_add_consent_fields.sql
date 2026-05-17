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

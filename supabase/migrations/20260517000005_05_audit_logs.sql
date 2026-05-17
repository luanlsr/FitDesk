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

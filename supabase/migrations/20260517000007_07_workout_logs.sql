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

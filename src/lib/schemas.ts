import { z, ZodError } from "zod";

// ─────────────────────────────────────────────────────────
// Helpers reutilizáveis
// ─────────────────────────────────────────────────────────
const uuidSchema = z.string().uuid({ message: "ID inválido." });

// ─────────────────────────────────────────────────────────
// Alunos (students)
// ─────────────────────────────────────────────────────────
export const createStudentSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres.").max(100),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido.")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["M", "F", "Outro"]).optional(),
  goal: z.string().max(200).optional().or(z.literal("")),
  planValue: z.number().min(0).max(99999),
  paymentDay: z.number().int().min(1).max(31),
  groupId: uuidSchema.optional().or(z.literal("").transform(() => undefined)),
});

export const updateStudentSchema = createStudentSchema.partial();

// ─────────────────────────────────────────────────────────
// Leads
// ─────────────────────────────────────────────────────────
export const createLeadSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres.").max(100),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  origin: z.string().max(50).optional().or(z.literal("")),
  value: z.number().min(0).max(99999).default(0),
  status: z
    .enum(["Aguardando", "Em Negociação", "Convertido", "Perdido"])
    .default("Aguardando"),
});

export const updateLeadStatusSchema = z.object({
  id: uuidSchema,
  status: z.enum(["Aguardando", "Em Negociação", "Convertido", "Perdido"]),
});

// ─────────────────────────────────────────────────────────
// Agendamentos (appointments)
// ─────────────────────────────────────────────────────────
export const createAppointmentSchema = z.object({
  title: z.string().min(2, "Título obrigatório.").max(150),
  description: z.string().max(500).optional().or(z.literal("")),
  start: z.string().datetime({ message: "Data de início inválida." }),
  end: z.string().datetime({ message: "Data de fim inválida." }),
  status: z
    .enum(["Agendado", "Realizado", "Cancelado"])
    .default("Agendado"),
  studentId: uuidSchema.optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

// ─────────────────────────────────────────────────────────
// Lançamentos Financeiros (financial_entries)
// ─────────────────────────────────────────────────────────
export const createFinancialEntrySchema = z.object({
  description: z.string().min(2, "Descrição obrigatória.").max(200),
  amount: z.number().positive("Valor deve ser positivo.").max(9999999),
  type: z.enum(["IN", "OUT"]),
  category: z.string().min(1, "Categoria obrigatória.").max(50),
  date: z.string().datetime({ message: "Data inválida." }),
  studentId: uuidSchema.optional(),
});

// ─────────────────────────────────────────────────────────
// Exercícios da Biblioteca
// ─────────────────────────────────────────────────────────
export const createExerciseSchema = z.object({
  name: z.string().min(2, "Nome do exercício obrigatório.").max(100),
  category: z.string().min(1, "Categoria obrigatória.").max(50),
  description: z.string().max(500).optional().or(z.literal("")),
  videoUrl: z
    .string()
    .url("URL inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  imageUrl: z
    .string()
    .url("URL inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

// ─────────────────────────────────────────────────────────
// Treinos (workouts)
// ─────────────────────────────────────────────────────────
export const createWorkoutSchema = z.object({
  name: z.string().min(2, "Nome do treino obrigatório.").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  studentId: uuidSchema,
});

export const addWorkoutExerciseSchema = z.object({
  workoutId: uuidSchema,
  exerciseId: uuidSchema,
  sets: z.number().int().min(1).max(20),
  reps: z.string().min(1).max(20),
  weight: z.string().max(20).optional().or(z.literal("")),
  rest: z.string().max(20).optional().or(z.literal("")),
});

// ─────────────────────────────────────────────────────────
// Grupos de Alunos
// ─────────────────────────────────────────────────────────
export const createGroupSchema = z.object({
  name: z.string().min(2, "Nome do grupo obrigatório.").max(80),
  description: z.string().max(300).optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida.")
    .default("#3b82f6"),
});

// ─────────────────────────────────────────────────────────
// Helper: formata erros Zod para string legível
// ─────────────────────────────────────────────────────────
export function formatZodError(error: ZodError): string {
  return error.issues.map((e) => e.message).join(" | ");
}

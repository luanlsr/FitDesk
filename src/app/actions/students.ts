"use server";

import { requireAuth } from "@/lib/auth-session";
import { studentService } from "@/services/studentService";
import { auditService } from "@/services/auditService";
import { createStudentSchema, updateStudentSchema, formatZodError } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  try {
    const { db, userId } = await requireAuth();
    return await studentService.getAll(db, userId);
  } catch {
    return [];
  }
}

export async function createStudent(formData: FormData) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = createStudentSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      cpf: formData.get("cpf") || "",
      gender: formData.get("gender") || undefined,
      goal: formData.get("goal") || "",
      planValue: parseFloat(formData.get("planValue") as string) || 0,
      paymentDay: parseInt(formData.get("paymentDay") as string) || 1,
      groupId: formData.get("groupId") || "",
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    // Controle de Limites do Plano do Personal Trainer
    const { data: personal, error: pError } = await db
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    if (pError) throw new Error("Erro ao consultar plano do personal trainer.");

    const plan = personal?.plan || "starter";
    const limits: Record<string, number> = { starter: 10, pro: 50, studio: 999999 };
    const limit = limits[plan] || 10;

    const activeCount = await studentService.getActiveCount(db, userId);
    if (activeCount >= limit) {
      return { 
        success: false, 
        error: `Você atingiu o limite de ${limit} alunos ativos do seu plano ${plan.toUpperCase()}. Faça um upgrade na aba financeira para cadastrar mais alunos.` 
      };
    }

    const student = await studentService.create(db, { ...parsed.data, personalId: userId });
    
    await auditService.log(db, {
      userId,
      action: "student.create",
      resourceId: student.id,
      resourceType: "students",
      metadata: { name: parsed.data.name }
    });

    revalidatePath("/alunos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao criar aluno" };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = updateStudentSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      cpf: formData.get("cpf") || "",
      gender: formData.get("gender") || undefined,
      goal: formData.get("goal") || "",
      planValue: formData.get("planValue") ? parseFloat(formData.get("planValue") as string) : undefined,
      paymentDay: formData.get("paymentDay") ? parseInt(formData.get("paymentDay") as string) : undefined,
      groupId: formData.get("groupId") || "",
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await studentService.update(db, id, userId, parsed.data);

    await auditService.log(db, {
      userId,
      action: "student.update",
      resourceId: id,
      resourceType: "students"
    });

    revalidatePath("/alunos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao atualizar aluno" };
  }
}

export async function deleteStudent(id: string) {
  try {
    const { db, userId } = await requireAuth();
    await studentService.delete(db, id, userId);

    await auditService.log(db, {
      userId,
      action: "student.delete",
      resourceId: id,
      resourceType: "students"
    });

    revalidatePath("/alunos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao remover aluno" };
  }
}

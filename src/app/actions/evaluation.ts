"use server";

import { requireAuth } from "@/lib/auth-session";
import { evaluationService } from "@/services/evaluationService";
import { auditService } from "@/services/auditService";
import { revalidatePath } from "next/cache";

export async function getStudentEvaluations(studentId: string) {
  try {
    const { db, userId } = await requireAuth();
    const list = await evaluationService.getByStudentId(db, studentId, userId);
    
    // Log de auditoria (Acesso a dados de avaliação física - LGPD)
    await auditService.log(db, {
      userId,
      action: "evaluation.read",
      resourceId: studentId,
      resourceType: "students",
      metadata: { description: "Leitura de avaliações físicas/posturais criptografadas" }
    });

    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar avaliações." };
  }
}

export async function createStudentEvaluation(studentId: string, evaluationData: any) {
  try {
    const { db, userId } = await requireAuth();
    const result = await evaluationService.save(db, { studentId, personalId: userId, evaluationData });

    // Log de auditoria (Criação de nova avaliação - LGPD)
    await auditService.log(db, {
      userId,
      action: "evaluation.create",
      resourceId: studentId,
      resourceType: "students",
      metadata: { description: "Criação de nova avaliação física, neuromotora ou postural" }
    });

    revalidatePath(`/alunos/${studentId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar avaliação." };
  }
}

export async function deleteStudentEvaluation(id: string, studentId: string) {
  try {
    const { db, userId } = await requireAuth();
    await evaluationService.delete(db, id, userId);

    // Log de auditoria (Exclusão de avaliação - LGPD)
    await auditService.log(db, {
      userId,
      action: "evaluation.delete",
      resourceId: studentId,
      resourceType: "students",
      metadata: { description: "Exclusão de avaliação física do aluno" }
    });

    revalidatePath(`/alunos/${studentId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir avaliação." };
  }
}

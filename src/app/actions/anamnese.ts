"use server";

import { requireAuth } from "@/lib/auth-session";
import { anamneseService } from "@/services/anamneseService";
import { auditService } from "@/services/auditService";
import { revalidatePath } from "next/cache";

export async function getStudentAnamnese(studentId: string) {
  try {
    const { db, userId } = await requireAuth();
    const anamnese = await anamneseService.getByStudentId(db, studentId, userId);
    
    // Log de auditoria (Acesso a dados sensíveis de saúde - LGPD)
    await auditService.log(db, {
      userId,
      action: "anamnese.read",
      resourceId: studentId,
      resourceType: "students",
      metadata: { description: "Leitura de anamnese criptografada do aluno" }
    });

    return { success: true, data: anamnese };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar anamnese." };
  }
}

export async function saveStudentAnamnese(studentId: string, anamneseData: any) {
  try {
    const { db, userId } = await requireAuth();
    const result = await anamneseService.save(db, { studentId, personalId: userId, anamneseData });

    // Log de auditoria (Alteração de dados sensíveis - LGPD)
    await auditService.log(db, {
      userId,
      action: "anamnese.write",
      resourceId: studentId,
      resourceType: "students",
      metadata: { description: "Gravação/atualização de anamnese criptografada" }
    });

    revalidatePath(`/alunos/${studentId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao salvar anamnese." };
  }
}

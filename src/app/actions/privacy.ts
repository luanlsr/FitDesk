"use server";

import { requireAuth } from "@/lib/auth-session";
import { supabaseAdmin } from "@/lib/supabase";
import { studentService } from "@/services/studentService";
import { financialService } from "@/services/financialService";

export async function exportUserData() {
  try {
    const { db, userId } = await requireAuth();

    // Buscar dados do usuário (perfil)
    const { data: userProfile, error: profileError } = await db
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Buscar alunos vinculados
    const students = await studentService.getAll(db, userId);

    // Buscar dados financeiros (exemplo: últimos 100 registros)
    const { data: finances } = await db
      .from("financial_entries")
      .select("*")
      .eq("personalId", userId)
      .limit(100);

    const exportData = {
      profile: userProfile,
      students,
      finances,
      exportedAt: new Date().toISOString(),
    };

    return { success: true, data: JSON.stringify(exportData, null, 2) };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao exportar dados." };
  }
}

export async function deleteUserAccount() {
  try {
    const { db, userId } = await requireAuth();

    // 1. Anonimizar perfil do usuário
    const { error: updateError } = await db
      .from("users")
      .update({
        name: "Usuário Excluído",
        email: `deleted_${userId}@fitdesk.com.br`,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 2. Desabilitar usuário na Auth usando Supabase Admin (service_role)
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: "876000h", // Banimento efetivo permanente
    });

    if (authError) throw authError;

    // Nota: Em um sistema real, poderíamos disparar exclusão em cascata ou hard delete
    // mas por segurança jurídica (LGPD Art. 18, IV), manter as faturas é obrigação legal.

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir conta." };
  }
}

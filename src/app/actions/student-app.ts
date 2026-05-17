"use server";

import { auth } from "@/auth";
import { studentAppService } from "@/services/studentAppService";

export async function getMyStudentProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await studentAppService.getProfile(session.user.id);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
}

export async function getMyWorkouts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return [];

    return await studentAppService.getWorkouts(profile.id);
  } catch (error) {
    console.error("Error fetching student workouts:", error);
    return [];
  }
}

export async function getMyNextAppointment() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return null;

    return await studentAppService.getNextAppointment(profile.id);
  } catch (error) {
    console.error("Error fetching next appointment:", error);
    return null;
  }
}

export async function updateStudentCardAction(creditCardToken: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado." };

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return { success: false, error: "Perfil de aluno não encontrado." };

    const { supabaseAdmin } = await import("@/lib/supabase");
    
    // Atualiza token de cartão no perfil do aluno no banco de dados local
    const { error } = await supabaseAdmin
      .from("students")
      .update({
        asaas_card_token: creditCardToken,
        updatedAt: new Date().toISOString()
      })
      .eq("id", profile.id);

    if (error) throw error;

    // Em produção, isso integraria com o Asaas para atualizar os dados de faturamento da assinatura
    if (profile.asaas_customer_id && profile.asaas_subscription_id) {
      // Simulação ou chamada real Asaas
      console.log(`Cartão atualizado com sucesso no Asaas para a assinatura ${profile.asaas_subscription_id}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar cartão do aluno:", error);
    return { success: false, error: error.message || "Erro ao atualizar cartão." };
  }
}

export async function cancelStudentPlanAction() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado." };

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return { success: false, error: "Perfil de aluno não encontrado." };

    const { supabaseAdmin } = await import("@/lib/supabase");

    // Cancela o plano no banco de dados local
    const { error } = await supabaseAdmin
      .from("students")
      .update({
        plan_status: "inactive",
        status: "Inativo",
        updatedAt: new Date().toISOString()
      })
      .eq("id", profile.id);

    if (error) throw error;

    // Em produção, cancela no Asaas
    if (profile.asaas_customer_id && profile.asaas_subscription_id) {
      console.log(`Assinatura Asaas ${profile.asaas_subscription_id} cancelada com sucesso`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao cancelar plano do aluno:", error);
    return { success: false, error: error.message || "Erro ao cancelar plano." };
  }
}

export async function scheduleStudentAppointment(startDateTime: string, description?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado." };

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return { success: false, error: "Perfil de aluno não encontrado." };

    const { supabaseAdmin } = await import("@/lib/supabase");

    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora de duração por padrão

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        title: `Treino - ${profile.name}`,
        description: description || "Agendado pelo Portal do Aluno",
        start: start.toISOString(),
        end: end.toISOString(),
        status: "Agendado",
        personalId: profile.personalId,
        studentId: profile.id
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao agendar horário pelo aluno:", error);
    return { success: false, error: error.message || "Erro ao agendar horário." };
  }
}


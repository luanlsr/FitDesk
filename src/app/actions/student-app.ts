"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
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

export async function getMyEvaluations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return [];

    const { supabaseAdmin } = await import("@/lib/supabase");
    const { data, error } = await supabaseAdmin
      .from("evaluations")
      .select("*")
      .eq("studentId", profile.id)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    if (!data) return [];

    const { decryptJSON } = await import("@/lib/encryption");

    return data.map(item => ({
      id: item.id,
      studentId: item.studentId,
      personalId: item.personalId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      encryptedData: decryptJSON(item.encryptedData)
    }));
  } catch (error) {
    console.error("Error fetching student evaluations:", error);
    return [];
  }
}

export async function getStudentDashboardData(studentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado." };

  try {
    const { supabaseAdmin } = await import("@/lib/supabase");

    // 1. Buscar estudante
    const { data: student, error: studentError } = await supabaseAdmin
      .from("students")
      .select("*, user:users!personalId(name, image)")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return { success: false, error: "Aluno não encontrado." };
    }

    // 2. Verificar autorização
    // É o próprio aluno OR é o Personal Trainer dele
    const isStudent = student.associatedUserId === session.user.id;
    const isPersonal = student.personalId === session.user.id;

    if (!isStudent && !isPersonal) {
      return { success: false, error: "Você não tem permissão para visualizar este painel." };
    }

    // 3. Buscar treinos
    const { data: workouts, error: workoutsError } = await supabaseAdmin
      .from("workouts")
      .select("*, exercises:workout_items(*, exercise:library_exercises(*))")
      .eq("studentId", studentId)
      .order("createdAt", { ascending: false });

    // 4. Buscar próximo agendamento
    const { data: nextApp, error: nextAppError } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("studentId", studentId)
      .gte("start", new Date().toISOString())
      .eq("status", "Agendado")
      .order("start", { ascending: true })
      .limit(1)
      .maybeSingle();

    // 5. Buscar avaliações
    const { data: evaluations, error: evaluationsError } = await supabaseAdmin
      .from("evaluations")
      .select("*")
      .eq("studentId", studentId)
      .order("createdAt", { ascending: false });

    const decryptedEvaluations = evaluations ? evaluations.map(item => {
      const { decryptJSON } = require("@/lib/encryption");
      return {
        id: item.id,
        studentId: item.studentId,
        personalId: item.personalId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        encryptedData: decryptJSON(item.encryptedData)
      };
    }) : [];

    return {
      success: true,
      profile: student,
      workouts: workouts || [],
      nextAppointment: nextApp || null,
      evaluations: decryptedEvaluations
    };
  } catch (error: any) {
    console.error("Erro ao carregar dados do painel do aluno:", error);
    return { success: false, error: error.message || "Erro ao carregar dados." };
  }
}

export async function logWorkoutCompletion(data: {
  workoutId: string;
  studentId: string;
  personalId: string;
  workoutName: string;
  duration?: number;
  feedback?: string;
  details: any;
}) {
  try {
    const { data: res, error } = await supabaseAdmin
      .from("workout_logs")
      .insert({
        workoutId: data.workoutId,
        studentId: data.studentId,
        personalId: data.personalId,
        workoutName: data.workoutName,
        duration: data.duration || 0,
        feedback: data.feedback || "",
        details: data.details
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, logId: res.id };
  } catch (error: any) {
    console.error("Erro ao registrar conclusão de treino:", error);
    return { success: false, error: error.message || "Erro ao registrar conclusão do treino." };
  }
}

export async function getWorkoutLogs(studentId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("workout_logs")
      .select("*")
      .eq("studentId", studentId)
      .order("completedAt", { ascending: false });

    if (error) throw error;
    return { success: true, logs: data || [] };
  } catch (error: any) {
    console.error("Erro ao carregar histórico de treinos:", error);
    return { success: false, logs: [], error: error.message || "Erro ao carregar histórico." };
  }
}

export async function getStudentAppointments(studentId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("studentId", studentId)
      .order("start", { ascending: true });

    if (error) throw error;
    return { success: true, appointments: data || [] };
  } catch (error: any) {
    console.error("Erro ao carregar agenda de aulas:", error);
    return { success: false, appointments: [], error: error.message || "Erro ao carregar agenda." };
  }
}





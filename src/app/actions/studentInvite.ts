"use server";

import { supabaseAdmin } from "@/lib/supabase";

function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

export async function registerStudentFromInvite(payload: {
  personalId: string;
  email: string;
  password: string;
  studentId: string;
  lgpdConsent: boolean;
}) {
  try {
    const { personalId, email, password, studentId, lgpdConsent } = payload;

    if (!email || !email.includes("@")) throw new Error("E-mail inválido.");
    if (!isStrongPassword(password)) {
      throw new Error("A senha deve ter no mínimo 8 caracteres, incluindo letras e números.");
    }
    if (!lgpdConsent) {
      throw new Error("Você deve aceitar os termos de consentimento da LGPD.");
    }

    // 1. Verificar se o aluno existe no banco
    const { data: student, error: studentError } = await supabaseAdmin
      .from("students")
      .select("id, name, personalId, associatedUserId")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      throw new Error("Aluno não encontrado no cadastro.");
    }

    if (student.personalId !== personalId) {
      throw new Error("Inconsistência de dados: Personal Trainer divergente.");
    }

    // 2. Verificar se já existe um usuário com este e-mail no auth do Supabase
    if (student.associatedUserId) {
      throw new Error("Este aluno já possui uma conta de acesso ativa. Faça o login.");
    }

    // 3. Criar a conta de acesso (Supabase Auth com e-mail confirmado direto)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "STUDENT",
        name: student.name,
      }
    });

    if (authError || !authData.user) {
      if (authError?.message?.includes("already exists") || authError?.message?.includes("email_exists")) {
        throw new Error("Já existe uma conta cadastrada com este e-mail. Entre em contato com o suporte.");
      }
      throw new Error(authError?.message || "Erro ao criar conta de acesso.");
    }

    const studentUserId = authData.user.id;

    // 4. Inserir o perfil público na tabela 'users'
    const { error: userInsertError } = await supabaseAdmin
      .from("users")
      .upsert({
        id: studentUserId,
        name: student.name,
        email,
        role: "STUDENT",
        lgpd_consent_at: new Date().toISOString(),
        lgpd_consent_version: 'v1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    if (userInsertError) {
      console.error("Erro ao sincronizar dados do usuário do aluno:", userInsertError.message);
      throw new Error("Erro ao sincronizar perfil do aluno.");
    }

    // 5. Atualizar o registro do estudante para apontar para o novo associatedUserId
    const { error: studentUpdateError } = await supabaseAdmin
      .from("students")
      .update({
        associatedUserId: studentUserId,
        status: "Ativo",
        updatedAt: new Date().toISOString()
      })
      .eq("id", studentId);

    if (studentUpdateError) {
      console.error("Erro ao vincular conta de acesso ao aluno:", studentUpdateError.message);
      throw new Error("Erro ao vincular acesso ao perfil do aluno.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao registrar aluno do convite:", error);
    return { success: false, error: error.message || "Erro desconhecido ao registrar." };
  }
}

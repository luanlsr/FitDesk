"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function getUserRoleAndRedirectPath() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autenticado", path: "/login" };

  try {
    // 1. Buscar o usuário na tabela 'users' para verificar papel (role) e username
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("role, id, username")
      .eq("id", session.user.id)
      .single();

    if (error || !user) {
      return { role: "PERSONAL", path: "/dashboard" }; // fallback seguro
    }

    if (user.role === "STUDENT") {
      // 2. Buscar o perfil do aluno associado ao userId logado
      const { data: student, error: studentError } = await supabaseAdmin
        .from("students")
        .select("id, personalId")
        .eq("associatedUserId", session.user.id)
        .single();

      if (studentError || !student) {
        return { role: "STUDENT", path: "/aluno" }; // fallback
      }

      // 3. Buscar o username do Personal Trainer dele
      const { data: personal } = await supabaseAdmin
        .from("users")
        .select("username")
        .eq("id", student.personalId)
        .single();

      const personalSegment = personal?.username || student.personalId;
      return { 
        role: "STUDENT", 
        path: `/${personalSegment}/${student.id}` 
      };
    }

    // Se for PERSONAL
    return { role: "PERSONAL", path: "/dashboard" };
  } catch (err) {
    console.error("Erro ao obter papel do usuário e rota de redirecionamento:", err);
    return { role: "PERSONAL", path: "/dashboard" };
  }
}

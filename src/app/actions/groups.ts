"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getStudentGroups() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const { data, error } = await supabaseAdmin
      .from("student_groups")
      .select("*")
      .eq("personalId", session.user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
}

export async function createStudentGroup(name: string, color: string = "#3b82f6") {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    const { data, error } = await supabaseAdmin
      .from("student_groups")
      .insert({ name, color, personalId: session.user.id })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/alunos");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: "Falha ao criar grupo" };
  }
}

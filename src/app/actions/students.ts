"use server";

import { auth } from "@/auth";
import { studentService } from "@/services/studentService";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await studentService.getAll(session.user.id);
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export async function createStudent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const planValue = parseFloat(formData.get("planValue") as string) || 0;
  const paymentDay = parseInt(formData.get("paymentDay") as string) || 1;

  try {
    await studentService.create({
      name,
      email,
      phone,
      planValue,
      paymentDay,
      personalId: session.user.id,
    });

    revalidatePath("/alunos");
    return { success: true };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: "Falha ao criar aluno" };
  }
}

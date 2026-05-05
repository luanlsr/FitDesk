"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const where = session.user.role === "MASTER" ? {} : { userId: session.user.id };

    return await prisma.student.findMany({
      where,
      orderBy: { name: "asc" },
      include: { assessments: true },
    });
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
  const goal = formData.get("goal") as string;
  const status = "Ativo";
  const lesions = formData.get("lesions") as string;
  const conditions = formData.get("conditions") as string;
  const medications = formData.get("medications") as string;
  const restricoes = formData.get("restricoes") as string;
  const cirurgias = formData.get("cirurgias") as string;
  const hipertensao = formData.get("hipertensao") === "true";
  const diabetes = formData.get("diabetes") === "true";
  const fumante = formData.get("fumante") === "true";
  const observacoes = formData.get("observacoes") as string;
  const planValue = formData.get("planValue") ? parseFloat(formData.get("planValue") as string) : null;
  const paymentDay = formData.get("paymentDay") ? parseInt(formData.get("paymentDay") as string) : null;

  try {
    await prisma.student.create({
      data: {
        name,
        email,
        phone,
        goal,
        status,
        lesions,
        conditions,
        medications,
        restricoes,
        cirurgias,
        hipertensao,
        diabetes,
        fumante,
        observacoes,
        planValue,
        paymentDay,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard/alunos");
    return { success: true };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: "Falha ao criar aluno" };
  }
}

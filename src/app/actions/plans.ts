"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStudentPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  const planValue = parseFloat(formData.get("planValue") as string);
  const paymentDay = parseInt(formData.get("paymentDay") as string);

  try {
    await prisma.student.update({
      where: { id },
      data: { planValue, paymentDay }
    });
    revalidatePath("/dashboard/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false };
  }
}

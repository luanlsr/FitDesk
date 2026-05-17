"use server";

import { auth } from "@/auth";
import { studentService } from "@/services/studentService";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateStudentPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  const planValue = parseFloat(formData.get("planValue") as string);
  const paymentDay = parseInt(formData.get("paymentDay") as string);

  try {
    await studentService.update(supabaseAdmin, id, session.user.id, { planValue, paymentDay });
    revalidatePath("/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false };
  }
}


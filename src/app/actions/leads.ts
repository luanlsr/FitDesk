"use server";

import { auth } from "@/auth";
import { leadService } from "@/services/leadService";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await leadService.getAll(session.user.id);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function createLead(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const origin = formData.get("origin") as string;
  const value = parseFloat(formData.get("value") as string) || 0;

  try {
    await leadService.create({
      name,
      email,
      phone,
      origin,
      value,
      personalId: session.user.id,
    });
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Falha ao criar lead" };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await leadService.update(id, session.user.id, { status });
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Falha ao atualizar status" };
  }
}

export async function deleteLead(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await leadService.delete(id, session.user.id);
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Falha ao remover lead" };
  }
}

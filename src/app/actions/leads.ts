"use server";

import { requireAuth } from "@/lib/auth-session";
import { leadService } from "@/services/leadService";
import { createLeadSchema, updateLeadStatusSchema, formatZodError } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    const { db, userId } = await requireAuth();
    return await leadService.getAll(db, userId);
  } catch {
    return [];
  }
}

export async function createLead(formData: FormData) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = createLeadSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      origin: formData.get("origin") || "",
      value: parseFloat(formData.get("value") as string) || 0,
      status: formData.get("status") || "Aguardando",
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await leadService.create(db, { ...parsed.data, personalId: userId });
    revalidatePath("/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao criar lead" };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = updateLeadStatusSchema.safeParse({ id, status });
    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await leadService.update(db, id, userId, { status: parsed.data.status });
    revalidatePath("/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao atualizar status" };
  }
}

export async function deleteLead(id: string) {
  try {
    const { db, userId } = await requireAuth();
    await leadService.delete(db, id, userId);
    revalidatePath("/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao remover lead" };
  }
}

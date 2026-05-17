"use server";

import { requireAuth } from "@/lib/auth-session";
import { financialService } from "@/services/financialService";
import { createFinancialEntrySchema, formatZodError } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getTransactions(month?: Date) {
  try {
    const { db, userId } = await requireAuth();
    const start = startOfMonth(month ?? new Date());
    const end = endOfMonth(month ?? new Date());
    return await financialService.getByRange(db, userId, start, end);
  } catch {
    return [];
  }
}

export async function getFinancialStats(month?: Date) {
  try {
    const { db, userId } = await requireAuth();
    const start = startOfMonth(month ?? new Date());
    const end = endOfMonth(month ?? new Date());
    return await financialService.getStatsByRange(db, userId, start, end);
  } catch {
    return { in: 0, out: 0, balance: 0 };
  }
}

export async function createTransaction(formData: FormData) {
  try {
    const { db, userId } = await requireAuth();

    const dateRaw = formData.get("date") as string;
    const studentIdRaw = formData.get("studentId") as string;

    const parsed = createFinancialEntrySchema.safeParse({
      description: formData.get("description"),
      amount: parseFloat(formData.get("amount") as string),
      type: formData.get("type"),
      category: formData.get("category"),
      date: dateRaw ? new Date(dateRaw).toISOString() : new Date().toISOString(),
      studentId: studentIdRaw && studentIdRaw !== "none" ? studentIdRaw : undefined,
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await financialService.create(db, { ...parsed.data, personalId: userId });
    revalidatePath("/financeiro");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao registrar transação" };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const { db, userId } = await requireAuth();
    await financialService.delete(db, id, userId);
    revalidatePath("/financeiro");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao remover transação" };
  }
}

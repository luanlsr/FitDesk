"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getTransactions(month?: Date) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const start = month ? startOfMonth(month) : startOfMonth(new Date());
  const end = month ? endOfMonth(month) : endOfMonth(new Date());

  try {
    return await prisma.financialEntry.findMany({
      where: {
        userId: session.user.id,
        date: { gte: start, lte: end }
      },
      include: { student: { select: { name: true } } },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getFinancialStats(month?: Date) {
  const session = await auth();
  if (!session?.user?.id) return { in: 0, out: 0, balance: 0 };

  const start = month ? startOfMonth(month) : startOfMonth(new Date());
  const end = month ? endOfMonth(month) : endOfMonth(new Date());

  try {
    const transactions = await prisma.financialEntry.findMany({
      where: {
        userId: session.user.id,
        date: { gte: start, lte: end }
      }
    });

    const income = transactions.filter(t => t.type === "IN").reduce((acc: number, t: any) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === "OUT").reduce((acc: number, t: any) => acc + t.amount, 0);

    return {
      in: income,
      out: expense,
      balance: income - expense
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { in: 0, out: 0, balance: 0 };
  }
}

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string; // IN or OUT
  const category = formData.get("category") as string;
  const studentId = formData.get("studentId") as string || null;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await prisma.financialEntry.create({
      data: {
        description,
        amount,
        type,
        category,
        date,
        studentId: studentId === "none" ? null : studentId,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Falha ao registrar transação" };
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.financialEntry.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/dashboard/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Falha ao remover transação" };
  }
}

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export async function getBillingStatus() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  try {
    const [students, transactions] = await Promise.all([
      prisma.student.findMany({
        where: { userId: session.user.id, status: "Ativo" },
        select: { id: true, name: true, planValue: true, paymentDay: true, phone: true }
      }),
      prisma.financialEntry.findMany({
        where: {
          userId: session.user.id,
          type: "IN",
          category: "Mensalidade",
          date: { gte: start, lte: end }
        },
        select: { studentId: true, amount: true, date: true }
      })
    ]);

    return students.map((student: any) => {
      const payment: any = transactions.find((t: any) => t.studentId === student.id);
      return {
        ...student,
        paid: !!payment,
        paymentDate: payment?.date || null,
        status: !!payment ? "Pago" : (student.paymentDay && new Date().getDate() > student.paymentDay ? "Atrasado" : "Pendente")
      };
    });
  } catch (error) {
    console.error("Error fetching billing status:", error);
    return [];
  }
}

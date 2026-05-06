import { supabaseAdmin } from "@/lib/supabase";
import { startOfMonth, endOfMonth } from "date-fns";

export const billingService = {
  async getStatus(personalId: string) {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    // 1. Busca alunos ativos do personal
    const { data: students, error: sError } = await supabaseAdmin
      .from("students")
      .select("id, name, planValue, paymentDay, phone")
      .eq("personalId", personalId)
      .eq("status", "Ativo");

    if (sError) throw sError;

    // 2. Busca pagamentos do personal
    const { data: transactions, error: tError } = await supabaseAdmin
      .from("financial_entries")
      .select("studentId, amount, date")
      .eq("personalId", personalId)
      .eq("type", "IN")
      .eq("category", "Mensalidade")
      .gte("date", start.toISOString())
      .lte("date", end.toISOString());

    if (tError) throw tError;

    // 3. Cruzamento de dados
    return students.map((student: any) => {
      const payment: any = transactions.find((t: any) => t.studentId === student.id);
      const isOverdue = student.paymentDay && new Date().getDate() > student.paymentDay;
      
      return {
        ...student,
        paid: !!payment,
        paymentDate: payment?.date || null,
        status: !!payment ? "Pago" : (isOverdue ? "Atrasado" : "Pendente")
      };
    });
  }
};

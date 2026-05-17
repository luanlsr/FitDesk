import type { SupabaseClient } from "@supabase/supabase-js";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";

export const dashboardService = {
  async getPersonalStats(db: SupabaseClient, personalId: string) {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const [students, appointments, finance] = await Promise.all([
      db.from("students").select("count").eq("personalId", personalId).eq("status", "Ativo"),
      db.from("appointments").select("count").eq("personalId", personalId).gte("start", start.toISOString()).lte("end", end.toISOString()),
      db.from("financial_entries").select("amount").eq("personalId", personalId).eq("type", "IN").gte("date", start.toISOString()).lte("date", end.toISOString()),
    ]);

    const totalRevenue = finance.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    return [
      { label: "Alunos Ativos", val: students.data?.[0]?.count || 0, trend: "+2 este mês" },
      { label: "Aulas no Mês", val: appointments.data?.[0]?.count || 0, trend: "Agenda Lotada" },
      { label: "Receita Mensal", val: `R$ ${totalRevenue.toLocaleString("pt-BR")}`, trend: "Crescimento 12%" },
      { label: "Alertas", val: "02", trend: "Verificar Pendências" },
    ];
  },

  async getTodayAgenda(db: SupabaseClient, personalId: string) {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());

    const { data, error } = await db
      .from("appointments")
      .select("*, student:students(name, groupId)")
      .eq("personalId", personalId)
      .gte("start", start.toISOString())
      .lte("start", end.toISOString())
      .order("start", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getRecentLeads(db: SupabaseClient, personalId: string) {
    const { data, error } = await db
      .from("leads")
      .select("*")
      .eq("personalId", personalId)
      .order("createdAt", { ascending: false })
      .limit(3);

    if (error) throw error;
    return data || [];
  },
};

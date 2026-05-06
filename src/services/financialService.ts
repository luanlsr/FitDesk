import { supabaseAdmin } from "@/lib/supabase";

export const financialService = {
  async getByRange(personalId: string, start: Date, end: Date) {
    const { data, error } = await supabaseAdmin
      .from("financial_entries")
      .select("*, student:students(name)")
      .eq("personalId", personalId)
      .gte("date", start.toISOString())
      .lte("date", end.toISOString())
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(entryData: any) {
    const { data, error } = await supabaseAdmin
      .from("financial_entries")
      .insert(entryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStatsByRange(personalId: string, start: Date, end: Date) {
    const { data, error } = await supabaseAdmin
      .from("financial_entries")
      .select("amount, type")
      .eq("personalId", personalId)
      .gte("date", start.toISOString())
      .lte("date", end.toISOString());

    if (error) throw error;

    const stats = data.reduce(
      (acc: any, curr: any) => {
        if (curr.type === "IN") acc.in += curr.amount;
        else acc.out += curr.amount;
        return acc;
      },
      { in: 0, out: 0 }
    );

    stats.balance = stats.in - stats.out;
    return stats;
  },

  async delete(id: string, personalId: string) {
    const { error } = await supabaseAdmin
      .from("financial_entries")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  }
};

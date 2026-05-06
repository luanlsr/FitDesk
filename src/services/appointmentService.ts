import { supabaseAdmin } from "@/lib/supabase";

export const appointmentService = {
  async getByRange(personalId: string, start: Date, end: Date) {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("*, student:students(name)")
      .eq("personalId", personalId)
      .gte("start", start.toISOString())
      .lte("end", end.toISOString())
      .order("start", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(appointmentData: any) {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert(appointmentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, personalId: string, updateData: any) {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .eq("personalId", personalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string, personalId: string) {
    const { error } = await supabaseAdmin
      .from("appointments")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  }
};

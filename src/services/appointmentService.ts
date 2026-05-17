import type { SupabaseClient } from "@supabase/supabase-js";

export const appointmentService = {
  async getByRange(db: SupabaseClient, personalId: string, start: Date, end: Date) {
    const { data, error } = await db
      .from("appointments")
      .select("*, student:students(name)")
      .eq("personalId", personalId)
      .gte("start", start.toISOString())
      .lte("end", end.toISOString())
      .order("start", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(db: SupabaseClient, appointmentData: any) {
    const { data, error } = await db
      .from("appointments")
      .insert(appointmentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(db: SupabaseClient, id: string, personalId: string, updateData: any) {
    const { data, error } = await db
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .eq("personalId", personalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(db: SupabaseClient, id: string, personalId: string) {
    const { error } = await db
      .from("appointments")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  },
};

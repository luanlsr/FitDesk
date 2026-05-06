import { supabaseAdmin } from "@/lib/supabase";

export const exerciseService = {
  async getAll(personalId: string, isMaster: boolean = false) {
    let query = supabaseAdmin
      .from("library_exercises")
      .select("*")
      .order("name", { ascending: true });

    if (!isMaster) {
      query = query.or(`personalId.is.null,personalId.eq.${personalId}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(exerciseData: any) {
    const { data, error } = await supabaseAdmin
      .from("library_exercises")
      .insert(exerciseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string, personalId: string, isMaster: boolean = false) {
    let query = supabaseAdmin
      .from("library_exercises")
      .delete()
      .eq("id", id);

    if (!isMaster) {
      query = query.eq("personalId", personalId);
    }

    const { error } = await query;
    if (error) throw error;
    return true;
  }
};

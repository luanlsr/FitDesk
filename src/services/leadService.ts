import { supabaseAdmin } from "@/lib/supabase";

export const leadService = {
  async getAll(personalId: string) {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("personalId", personalId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(leadData: any) {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, personalId: string, updateData: any) {
    const { data, error } = await supabaseAdmin
      .from("leads")
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
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  }
};

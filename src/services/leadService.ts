import type { SupabaseClient } from "@supabase/supabase-js";

export const leadService = {
  async getAll(db: SupabaseClient, personalId: string) {
    const { data, error } = await db
      .from("leads")
      .select("*")
      .eq("personalId", personalId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(db: SupabaseClient, leadData: any) {
    const { data, error } = await db
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(db: SupabaseClient, id: string, personalId: string, updateData: any) {
    const { data, error } = await db
      .from("leads")
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
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  },
};

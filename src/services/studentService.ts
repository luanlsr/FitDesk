import type { SupabaseClient } from "@supabase/supabase-js";

export const studentService = {
  async getAll(db: SupabaseClient, personalId: string) {
    const { data, error } = await db
      .from("students")
      .select("*, group:student_groups(name, color)")
      .eq("personalId", personalId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(db: SupabaseClient, id: string, personalId: string) {
    const { data, error } = await db
      .from("students")
      .select("*")
      .eq("id", id)
      .eq("personalId", personalId)
      .single();

    if (error) throw error;
    return data;
  },

  async create(db: SupabaseClient, studentData: any) {
    const { data, error } = await db
      .from("students")
      .insert(studentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(db: SupabaseClient, id: string, personalId: string, updateData: any) {
    const { data, error } = await db
      .from("students")
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
      .from("students")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  },

  async getActiveCount(db: SupabaseClient, personalId: string): Promise<number> {
    const { count, error } = await db
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("personalId", personalId)
      .eq("status", "Ativo");

    if (error) throw error;
    return count || 0;
  },
};


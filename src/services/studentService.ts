import { supabaseAdmin } from "@/lib/supabase";

export const studentService = {
  async getAll(personalId: string) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*, group:student_groups(name, color)")
      .eq("personalId", personalId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string, personalId: string) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("id", id)
      .eq("personalId", personalId)
      .single();

    if (error) throw error;
    return data;
  },

  async create(studentData: any) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .insert(studentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, personalId: string, updateData: any) {
    const { data, error } = await supabaseAdmin
      .from("students")
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
      .from("students")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  }
};

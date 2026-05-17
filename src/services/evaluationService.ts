import type { SupabaseClient } from "@supabase/supabase-js";
import { encryptJSON, decryptJSON } from "@/lib/encryption";

export const evaluationService = {
  async getByStudentId(db: SupabaseClient, studentId: string, personalId: string) {
    const { data, error } = await db
      .from("evaluations")
      .select("*")
      .eq("studentId", studentId)
      .eq("personalId", personalId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      studentId: item.studentId,
      personalId: item.personalId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      data: decryptJSON(item.encryptedData)
    }));
  },

  async save(db: SupabaseClient, { studentId, personalId, evaluationData }: { studentId: string; personalId: string; evaluationData: any }) {
    const encryptedData = encryptJSON(evaluationData);

    const { data, error } = await db
      .from("evaluations")
      .insert({
        studentId,
        personalId,
        encryptedData
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, data: evaluationData };
  },

  async delete(db: SupabaseClient, id: string, personalId: string) {
    const { error } = await db
      .from("evaluations")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  }
};

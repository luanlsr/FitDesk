import type { SupabaseClient } from "@supabase/supabase-js";
import { encryptJSON, decryptJSON } from "@/lib/encryption";

export const anamneseService = {
  async getByStudentId(db: SupabaseClient, studentId: string, personalId: string) {
    const { data, error } = await db
      .from("anamneses")
      .select("*")
      .eq("studentId", studentId)
      .eq("personalId", personalId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      studentId: data.studentId,
      personalId: data.personalId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      data: decryptJSON(data.encryptedData)
    };
  },

  async save(db: SupabaseClient, { studentId, personalId, anamneseData }: { studentId: string; personalId: string; anamneseData: any }) {
    const existing = await this.getByStudentId(db, studentId, personalId);
    const encryptedData = encryptJSON(anamneseData);

    if (existing) {
      const { data, error } = await db
        .from("anamneses")
        .update({
          encryptedData,
          updatedAt: new Date().toISOString()
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, data: anamneseData };
    } else {
      const { data, error } = await db
        .from("anamneses")
        .insert({
          studentId,
          personalId,
          encryptedData
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, data: anamneseData };
    }
  }
};

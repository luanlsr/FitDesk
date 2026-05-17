import { supabaseAdmin } from "@/lib/supabase";

export const studentAppService = {
  async getProfile(associatedUserId: string) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*, user:users!personalId(name, image)")
      .eq("associatedUserId", associatedUserId)
      .single();

    if (error) throw error;
    return data;
  },

  async getWorkouts(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from("workouts")
      .select("*, exercises:workout_items(*)")
      .eq("studentId", studentId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getNextAppointment(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("studentId", studentId)
      .gte("start", new Date().toISOString())
      .eq("status", "Agendado")
      .order("start", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};

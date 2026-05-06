import { supabaseAdmin } from "@/lib/supabase";

export const workoutService = {
  async getAll(personalId: string, studentId?: string) {
    let query = supabaseAdmin
      .from("workouts")
      .select("*, student:students(name), exercises:workout_items(*, exercise:library_exercises(name))")
      .eq("personalId", personalId)
      .order("createdAt", { ascending: false });

    if (studentId) {
      query = query.eq("studentId", studentId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(workoutData: any) {
    const { data, error } = await supabaseAdmin
      .from("workouts")
      .insert(workoutData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addExercise(workoutId: string, exerciseData: any) {
    const { data, error } = await supabaseAdmin
      .from("workout_items")
      .insert({ ...exerciseData, workoutId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string, personalId: string) {
    const { error } = await supabaseAdmin
      .from("workouts")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  }
};

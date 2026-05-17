import type { SupabaseClient } from "@supabase/supabase-js";

export const workoutService = {
  async getAll(db: SupabaseClient, personalId: string, studentId?: string) {
    let query = db
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

  async create(db: SupabaseClient, workoutData: any) {
    const { data, error } = await db
      .from("workouts")
      .insert(workoutData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addExercise(db: SupabaseClient, workoutId: string, exerciseData: any) {
    const { data, error } = await db
      .from("workout_items")
      .insert({ ...exerciseData, workoutId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(db: SupabaseClient, id: string, personalId: string) {
    const { error } = await db
      .from("workouts")
      .delete()
      .eq("id", id)
      .eq("personalId", personalId);

    if (error) throw error;
    return true;
  },
};

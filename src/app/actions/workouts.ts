"use server";

import { requireAuth } from "@/lib/auth-session";
import { workoutService } from "@/services/workoutService";
import { createWorkoutSchema, addWorkoutExerciseSchema, formatZodError } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getWorkouts(studentId?: string) {
  try {
    const { db, userId } = await requireAuth();
    return await workoutService.getAll(db, userId, studentId);
  } catch {
    return [];
  }
}

export async function createWorkout(studentId: string, name: string, description?: string) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = createWorkoutSchema.safeParse({ name, description: description || "", studentId });
    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    const workout = await workoutService.create(db, { ...parsed.data, personalId: userId });
    revalidatePath("/treinos");
    return { success: true, workoutId: workout.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao criar treino" };
  }
}

export async function addExerciseToWorkout(
  workoutId: string,
  data: { exerciseId: string; sets: number; reps: string; weight?: string; rest?: string }
) {
  try {
    const { db } = await requireAuth();

    const parsed = addWorkoutExerciseSchema.safeParse({ workoutId, ...data });
    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    const { workoutId: wId, ...exerciseData } = parsed.data;
    await workoutService.addExercise(db, wId, exerciseData);
    revalidatePath("/treinos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao adicionar exercício" };
  }
}

export async function deleteWorkout(id: string) {
  try {
    const { db, userId } = await requireAuth();
    await workoutService.delete(db, id, userId);
    revalidatePath("/treinos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao remover treino" };
  }
}

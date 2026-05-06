"use server";

import { auth } from "@/auth";
import { workoutService } from "@/services/workoutService";
import { revalidatePath } from "next/cache";

export async function getWorkouts(studentId?: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await workoutService.getAll(session.user.id, studentId);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
}

export async function createWorkout(studentId: string, name: string, description?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    const workout = await workoutService.create({
      name,
      description,
      studentId,
      personalId: session.user.id,
    });
    revalidatePath("/treinos");
    return { success: true, workoutId: workout.id };
  } catch (error) {
    console.error("Error creating workout:", error);
    return { success: false, error: "Falha ao criar treino" };
  }
}

export async function addExerciseToWorkout(workoutId: string, data: {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await workoutService.addExercise(workoutId, data);
    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    console.error("Error adding exercise:", error);
    return { success: false, error: "Falha ao adicionar exercício" };
  }
}

export async function deleteWorkout(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await workoutService.delete(id, session.user.id);
    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting workout:", error);
    return { success: false, error: "Falha ao remover treino" };
  }
}

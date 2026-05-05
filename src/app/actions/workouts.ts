"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkouts(studentId?: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const where: any = { userId: session.user.id };
    if (studentId) where.studentId = studentId;

    return await prisma.workout.findMany({
      where,
      include: {
        exercises: true,
        student: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
}

export async function createWorkout(studentId: string, name: string, description?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        studentId,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard/treinos");
    return { success: true, workoutId: workout.id };
  } catch (error) {
    console.error("Error creating workout:", error);
    return { success: false, error: "Falha ao criar treino" };
  }
}

export async function addExerciseToWorkout(workoutId: string, data: {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    // Verificar se o workout pertence ao usuário
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId, userId: session.user.id }
    });

    if (!workout) return { success: false, error: "Treino não encontrado" };

    await prisma.exercise.create({
      data: {
        ...data,
        workoutId,
      },
    });
    revalidatePath("/dashboard/treinos");
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
    await prisma.workout.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/dashboard/treinos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting workout:", error);
    return { success: false, error: "Falha ao remover treino" };
  }
}

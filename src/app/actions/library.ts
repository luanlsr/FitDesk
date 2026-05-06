"use server";

import { auth } from "@/auth";
import { exerciseService } from "@/services/exerciseService";
import { revalidatePath } from "next/cache";

export async function getLibraryExercises() {
  const session = await auth();
  const isMaster = session?.user?.role === "MASTER";
  const userId = session?.user?.id || 'none';

  try {
    return await exerciseService.getAll(userId, isMaster);
  } catch (error) {
    console.error("Error fetching library exercises:", error);
    return [];
  }
}

export async function createLibraryExercise(name: string, category: string, videoUrl?: string, description?: string, imageUrl?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await exerciseService.create({
      name,
      category,
      videoUrl,
      description,
      imageUrl,
      personalId: session.user.role === "MASTER" ? null : session.user.id,
    });
    revalidatePath("/biblioteca");
    return { success: true };
  } catch (error) {
    console.error("Error creating library exercise:", error);
    return { success: false, error: "Falha ao criar exercício na biblioteca" };
  }
}

export async function deleteLibraryExercise(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const isMaster = session.user.role === "MASTER";

  try {
    await exerciseService.delete(id, session.user.id, isMaster);
    revalidatePath("/biblioteca");
    return { success: true };
  } catch (error) {
    console.error("Error deleting library exercise:", error);
    return { success: false, error: "Falha ao remover exercício" };
  }
}

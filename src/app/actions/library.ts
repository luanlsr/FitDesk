"use server";

import { requireAuth } from "@/lib/auth-session";
import { exerciseService } from "@/services/exerciseService";
import { createExerciseSchema, formatZodError } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getLibraryExercises() {
  try {
    const { db, userId, session } = await requireAuth();
    const isMaster = session.user.role === "MASTER";
    return await exerciseService.getAll(db, userId, isMaster);
  } catch {
    return [];
  }
}

export async function createLibraryExercise(
  name: string,
  category: string,
  videoUrl?: string,
  description?: string,
  imageUrl?: string
) {
  try {
    const { db, userId, session } = await requireAuth();

    const parsed = createExerciseSchema.safeParse({
      name,
      category,
      videoUrl: videoUrl || "",
      description: description || "",
      imageUrl: imageUrl || "",
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await exerciseService.create(db, {
      ...parsed.data,
      personalId: session.user.role === "MASTER" ? null : userId,
    });
    revalidatePath("/biblioteca");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao criar exercício na biblioteca" };
  }
}

export async function deleteLibraryExercise(id: string) {
  try {
    const { db, userId, session } = await requireAuth();
    const isMaster = session.user.role === "MASTER";
    await exerciseService.delete(db, id, userId, isMaster);
    revalidatePath("/biblioteca");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao remover exercício" };
  }
}

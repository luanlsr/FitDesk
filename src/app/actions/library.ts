"use server";

// @ts-nocheck
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLibraryExercises() {
  const session = await auth();
  
  // Se for MASTER, vê TUDO. Se for PERSONAL, vê os globais (userId: null) + os dele.
  const where = session?.user?.role === "MASTER" 
    ? {} 
    : {
        OR: [
          { userId: null },
          { userId: session?.user?.id || 'none' }
        ]
      };

  try {
    const exercises = await prisma.$queryRawUnsafe(`
      SELECT * FROM LibraryExercise 
      ORDER BY name ASC
    `) as any[];

    // Filtro manual de segurança (equivalente ao 'where' anterior)
    const filtered = (exercises as any[]).filter(ex => {
      if (session?.user?.role === "MASTER") return true;
      return ex.userId === null || ex.userId === session?.user?.id;
    });

    return filtered as any[];
  } catch (error) {
    console.error("Error fetching library exercises:", error);
    return [];
  }
}

export async function createLibraryExercise(name: string, category: string, videoUrl?: string, description?: string, imageUrl?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await (prisma.libraryExercise as any).create({
      data: {
        name,
        category,
        videoUrl,
        description,
        imageUrl,
        userId: session.user.role === "MASTER" ? null : session.user.id,
      },
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

  try {
    // Apenas o dono ou MASTER pode deletar
    const exercise = await prisma.libraryExercise.findUnique({ where: { id } });
    if (!exercise) return { success: false, error: "Exercício não encontrado" };

    if (session.user.role !== "MASTER" && exercise.userId !== session.user.id) {
       return { success: false, error: "Sem permissão para deletar este item" };
    }

    await prisma.libraryExercise.delete({
      where: { id },
    });
    revalidatePath("/biblioteca");
    return { success: true };
  } catch (error) {
    console.error("Error deleting library exercise:", error);
    return { success: false, error: "Falha ao remover exercício" };
  }
}

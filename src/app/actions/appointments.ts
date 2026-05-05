"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppointments(start: Date, end: Date) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
        start: { gte: start },
        end: { lte: end },
      },
      include: {
        student: {
          select: { name: true, phone: true }
        }
      },
      orderBy: { start: "asc" },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function createAppointment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const start = new Date(formData.get("start") as string);
  const end = new Date(formData.get("end") as string);
  const studentId = formData.get("studentId") as string || null;

  try {
    await prisma.appointment.create({
      data: {
        title,
        description,
        start,
        end,
        userId: session.user.id,
        studentId: studentId === "block" ? null : studentId,
      },
    });
    revalidatePath("/dashboard/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Falha ao agendar" };
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.appointment.update({
      where: { id, userId: session.user.id },
      data: { status },
    });
    revalidatePath("/dashboard/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, error: "Falha ao atualizar status" };
  }
}

export async function deleteAppointment(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.appointment.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/dashboard/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: "Falha ao remover agendamento" };
  }
}

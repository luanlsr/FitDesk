"use server";

import { auth } from "@/auth";
import { appointmentService } from "@/services/appointmentService";
import { revalidatePath } from "next/cache";

export async function getAppointments(start: Date, end: Date) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await appointmentService.getByRange(session.user.id, start, end);
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
  const studentId = formData.get("studentId") as string;
  const start = new Date(formData.get("start") as string);
  const end = new Date(formData.get("end") as string);

  try {
    await appointmentService.create({
      title,
      description,
      studentId: studentId === "none" ? null : studentId,
      start: start.toISOString(),
      end: end.toISOString(),
      personalId: session.user.id,
    });
    
    revalidatePath("/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Falha ao criar agendamento" };
  }
}

export async function updateAppointment(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  try {
    await appointmentService.update(id, session.user.id, {
      title,
      description,
      status,
    });
    
    revalidatePath("/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, error: "Falha ao atualizar agendamento" };
  }
}

export async function deleteAppointment(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await appointmentService.delete(id, session.user.id);
    revalidatePath("/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: "Falha ao remover agendamento" };
  }
}

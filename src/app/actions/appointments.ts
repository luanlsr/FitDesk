"use server";

import { requireAuth } from "@/lib/auth-session";
import { appointmentService } from "@/services/appointmentService";
import { createAppointmentSchema, updateAppointmentSchema, formatZodError } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getAppointments(start: Date, end: Date) {
  try {
    const { db, userId } = await requireAuth();
    return await appointmentService.getByRange(db, userId, start, end);
  } catch {
    return [];
  }
}

export async function createAppointment(formData: FormData) {
  try {
    const { db, userId } = await requireAuth();

    const studentIdRaw = formData.get("studentId") as string;
    const parsed = createAppointmentSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description") || "",
      start: formData.get("start"),
      end: formData.get("end"),
      status: formData.get("status") || "Agendado",
      studentId: studentIdRaw && studentIdRaw !== "none" ? studentIdRaw : undefined,
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await appointmentService.create(db, { ...parsed.data, personalId: userId });
    revalidatePath("/agenda");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao criar agendamento" };
  }
}

export async function updateAppointment(id: string, formData: FormData) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = updateAppointmentSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description") || "",
      status: formData.get("status"),
    });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await appointmentService.update(db, id, userId, parsed.data);
    revalidatePath("/agenda");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao atualizar agendamento" };
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const { db, userId } = await requireAuth();

    const parsed = z
      .object({ id: z.string().uuid(), status: z.enum(["Agendado", "Realizado", "Cancelado"]) })
      .safeParse({ id, status });

    if (!parsed.success) {
      return { success: false, error: formatZodError(parsed.error) };
    }

    await appointmentService.update(db, id, userId, { status: parsed.data.status });
    revalidatePath("/agenda");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao atualizar status" };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const { db, userId } = await requireAuth();
    await appointmentService.delete(db, id, userId);
    revalidatePath("/agenda");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao remover agendamento" };
  }
}

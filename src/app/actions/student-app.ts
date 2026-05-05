"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getMyStudentProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await prisma.student.findUnique({
      where: { associatedUserId: session.user.id },
      include: {
        user: { select: { name: true, image: true } }, // Personal Trainer info
      }
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
}

export async function getMyWorkouts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const student = await prisma.student.findUnique({
      where: { associatedUserId: session.user.id },
      select: { id: true }
    });

    if (!student) return [];

    return await prisma.workout.findMany({
      where: { studentId: student.id },
      include: { exercises: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching student workouts:", error);
    return [];
  }
}

export async function getMyNextAppointment() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const student = await prisma.student.findUnique({
      where: { associatedUserId: session.user.id },
      select: { id: true }
    });

    if (!student) return null;

    return await prisma.appointment.findFirst({
      where: { 
        studentId: student.id,
        start: { gte: new Date() },
        status: "Agendado"
      },
      orderBy: { start: "asc" }
    });
  } catch (error) {
    console.error("Error fetching next appointment:", error);
    return null;
  }
}

"use server";

import { auth } from "@/auth";
import { studentAppService } from "@/services/studentAppService";

export async function getMyStudentProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await studentAppService.getProfile(session.user.id);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
}

export async function getMyWorkouts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return [];

    return await studentAppService.getWorkouts(profile.id);
  } catch (error) {
    console.error("Error fetching student workouts:", error);
    return [];
  }
}

export async function getMyNextAppointment() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const profile = await studentAppService.getProfile(session.user.id);
    if (!profile) return null;

    return await studentAppService.getNextAppointment(profile.id);
  } catch (error) {
    console.error("Error fetching next appointment:", error);
    return null;
  }
}

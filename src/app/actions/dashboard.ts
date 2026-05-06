"use server";

import { auth } from "@/auth";
import { dashboardService } from "@/services/dashboardService";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const [stats, agenda, leads] = await Promise.all([
      dashboardService.getPersonalStats(session.user.id),
      dashboardService.getTodayAgenda(session.user.id),
      dashboardService.getRecentLeads(session.user.id)
    ]);

    return { stats, agenda, leads };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

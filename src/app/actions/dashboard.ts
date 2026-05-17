"use server";

import { auth } from "@/auth";
import { dashboardService } from "@/services/dashboardService";
import { supabaseAdmin } from "@/lib/supabase";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const [stats, agenda, leads] = await Promise.all([
      dashboardService.getPersonalStats(supabaseAdmin, session.user.id),
      dashboardService.getTodayAgenda(supabaseAdmin, session.user.id),
      dashboardService.getRecentLeads(supabaseAdmin, session.user.id)
    ]);

    return { stats, agenda, leads };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

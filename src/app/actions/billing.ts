"use server";

import { auth } from "@/auth";
import { billingService } from "@/services/billingService";
import { supabaseAdmin } from "@/lib/supabase";

export async function getBillingStatus() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await billingService.getStatus(supabaseAdmin, session.user.id);
  } catch (error) {
    console.error("Error fetching billing status:", error);
    return [];
  }
}

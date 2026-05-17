import { SupabaseClient } from "@supabase/supabase-js";

export interface AuditLogData {
  userId: string;
  action: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: any;
  ipAddress?: string;
}

export const auditService = {
  async log(db: SupabaseClient, data: AuditLogData) {
    try {
      const { error } = await db.from("audit_logs").insert([data]);
      if (error) {
        console.error("Failed to write audit log:", error);
      }
    } catch (err) {
      console.error("Failed to write audit log exception:", err);
    }
  }
};

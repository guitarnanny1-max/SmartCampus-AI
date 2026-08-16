"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function updateLeadStatus(leadId: string, newStatus: string) {
  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: "Supabase credentials are not configured." };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase
    .from("crm_leads")
    .update({ 
      status: newStatus,
      lead_status: newStatus,
      updated_at: new Date().toISOString() 
    })
    .eq("id", leadId);

  if (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLeadDetails(
  leadId: string, 
  updates: { notes?: string; priority?: string; status?: string }
) {
  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: "Supabase credentials are not configured." };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase
    .from("crm_leads")
    .update({ 
      ...updates,
      updated_at: new Date().toISOString() 
    })
    .eq("id", leadId);

  if (error) {
    console.error("Failed to update lead details:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

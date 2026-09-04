import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

type TeacherActivityInput = {
  teacherId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
};

export async function logTeacherActivity({
  teacherId,
  action,
  description,
  metadata = {},
}: TeacherActivityInput) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase.from("teacher_activity").insert({
      teacher_id: teacherId,
      action,
      description,
      metadata,
    });

    if (error) {
      console.error("Teacher activity log error:", error);
    }
  } catch (error) {
    console.error("Teacher activity exception:", error);
  }
}

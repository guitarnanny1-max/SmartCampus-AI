import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Supabase configuration is incomplete.",
        },
        { status: 500 }
      ),
    };
  }

  const supabaseAuth = createServerClient(
    supabaseUrl,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Read-only request context.
          }
        },
      },
    }
  );

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !authUser?.email) {
    return {
      error: NextResponse.json(
        {
          authenticated: false,
          error: "Authentication required.",
        },
        { status: 401 }
      ),
    };
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: appUser, error: userError } =
    await supabaseAdmin
      .from("User")
      .select("id, tenantId, email, name, role")
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Unable to load application user.",
          details: userError.message,
        },
        { status: 500 }
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "User is not associated with a tenant.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId as string,
  };
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const auth = await getAuthContext();

    if ("error" in auth) {
      return auth.error;
    }

    const { supabaseAdmin, tenantId } = auth;
    const { id: examId } = await context.params;

    const body = await request.json().catch(() => ({}));

    const requestedStatus = body.status;

    if (
      requestedStatus !== "PUBLISHED" &&
      requestedStatus !== "DRAFT"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Status must be either "PUBLISHED" or "DRAFT".',
        },
        { status: 400 }
      );
    }

    const { data: exam, error: examError } =
      await supabaseAdmin
        .from("exams")
        .select(
          "id, tenantId, academic_year_id, name, status"
        )
        .eq("id", examId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (examError) {
      throw examError;
    }

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: "Examination not found.",
        },
        { status: 404 }
      );
    }

    if (
      requestedStatus === "PUBLISHED" &&
      exam.status === "PUBLISHED"
    ) {
      return NextResponse.json({
        success: true,
        exam,
        message: "Examination is already published.",
      });
    }

    const { data: updatedExam, error: updateError } =
      await supabaseAdmin
        .from("exams")
        .update({
          status: requestedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", examId)
        .eq("tenantId", tenantId)
        .select(
          "id, tenantId, academic_year_id, name, exam_type, start_date, end_date, status, updated_at"
        )
        .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      exam: updatedExam,
      message:
        requestedStatus === "PUBLISHED"
          ? "Examination results published successfully."
          : "Examination moved back to draft.",
    });
  } catch (error: any) {
    console.error("Exam publish API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update examination status.",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

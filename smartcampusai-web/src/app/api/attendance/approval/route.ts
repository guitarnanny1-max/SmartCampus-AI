import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type AuditAction =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "RESUBMITTED";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !publishableKey ||
    !serviceRoleKey
  ) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error:
            "Supabase environment is not fully configured.",
        },
        { status: 500 },
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
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            // Ignore read-only cookie environments.
          }
        },
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user?.email) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        { status: 401 },
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
    },
  );

  const { data: appUser, error: userError } =
    await supabaseAdmin
      .from("User")
      .select(
        'id, "tenantId", email, name, role',
      )
      .eq("email", user.email)
      .maybeSingle();

  if (userError) {
    console.error(
      "Attendance approval user lookup error:",
      userError,
    );

    return {
      error: NextResponse.json(
        {
          success: false,
          error:
            "Unable to load application user.",
        },
        { status: 500 },
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error:
            "Authenticated user has no tenant.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId as string,
    appUser,
  };
}

function isSchoolAdmin(role: unknown) {
  return role === "SCHOOL_ADMIN";
}

async function loadAttendanceStudent(
  supabaseAdmin: any,
  tenantId: string,
  attendanceStudentId: string,
) {
  const { data, error } = await supabaseAdmin
    .from("class_period_attendance_students")
    .select(
      `
        id,
        tenantId,
        class_period_attendance_id,
        student_id,
        status,
        notes
      `,
    )
    .eq("id", attendanceStudentId)
    .eq("tenantId", tenantId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function loadApproval(
  supabaseAdmin: any,
  tenantId: string,
  attendanceStudentId: string,
) {
  const { data, error } = await supabaseAdmin
    .from("attendance_approvals")
    .select(
      `
        id,
        "tenantId",
        attendance_student_id,
        status,
        reason,
        acted_by,
        acted_at,
        created_at,
        updated_at
      `,
    )
    .eq("tenantId", tenantId)
    .eq(
      "attendance_student_id",
      attendanceStudentId,
    )
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function writeAuditEvent(
  supabaseAdmin: any,
  input: {
    tenantId: string;
    attendanceStudentId: string;
    approvalId: string | null;
    action: AuditAction;
    oldStatus: ApprovalStatus | null;
    newStatus: ApprovalStatus;
    reason: string | null;
    performedBy: string;
  },
) {
  const { error } = await supabaseAdmin
    .from("attendance_approval_audit")
    .insert({
      id: `attendance_approval_audit_${crypto.randomUUID()}`,
      tenantId: input.tenantId,
      attendance_student_id:
        input.attendanceStudentId,
      approval_id: input.approvalId,
      action: input.action,
      old_status: input.oldStatus,
      new_status: input.newStatus,
      reason: input.reason,
      performed_by: input.performedBy,
      performed_at: new Date().toISOString(),
    });

  if (error) {
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = context;

    const url = new URL(request.url);

    const attendanceStudentId =
      (
        url.searchParams.get(
          "attendance_student_id",
        ) || ""
      ).trim();

    const attendanceStudentIdsParam =
      (
        url.searchParams.get(
          "attendance_student_ids",
        ) || ""
      ).trim();

    if (
      !attendanceStudentId &&
      !attendanceStudentIdsParam
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "attendance_student_id or attendance_student_ids is required.",
        },
        { status: 400 },
      );
    }

    const ids = attendanceStudentIdsParam
      ? Array.from(
          new Set(
            attendanceStudentIdsParam
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        )
      : [attendanceStudentId];

    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one attendance student ID is required.",
        },
        { status: 400 },
      );
    }

    const { data: attendanceStudents, error: attendanceError } =
      await supabaseAdmin
        .from("class_period_attendance_students")
        .select("id, tenantId")
        .eq("tenantId", tenantId)
        .in("id", ids);

    if (attendanceError) {
      throw attendanceError;
    }

    const validIds = new Set(
      (attendanceStudents ?? []).map(
        (item: { id: string }) => item.id,
      ),
    );

    const { data: approvals, error: approvalError } =
      await supabaseAdmin
        .from("attendance_approvals")
        .select(
          `
            id,
            "tenantId",
            attendance_student_id,
            status,
            reason,
            acted_by,
            acted_at,
            created_at,
            updated_at
          `,
        )
        .eq("tenantId", tenantId)
        .in("attendance_student_id", ids);

    if (approvalError) {
      throw approvalError;
    }

    if (attendanceStudentId) {
      if (!validIds.has(attendanceStudentId)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Attendance student record not found.",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        approval:
          (approvals ?? []).find(
            (item: {
              attendance_student_id: string;
            }) =>
              item.attendance_student_id ===
              attendanceStudentId,
          ) ?? null,
      });
    }

    const approvalMap = Object.fromEntries(
      (approvals ?? []).map(
        (item: {
          attendance_student_id: string;
        }) => [
          item.attendance_student_id,
          item,
        ],
      ),
    );

    return NextResponse.json({
      success: true,
      approvals: approvalMap,
    });
  } catch (error: any) {
    console.error(
      "GET /api/attendance/approval error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load attendance approval.",
        details:
          process.env.NODE_ENV === "development"
            ? error?.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      supabaseAdmin,
      tenantId,
      appUser,
    } = context;

    const body = await request.json();

    const attendanceStudentId =
      String(
        body?.attendance_student_id ?? "",
      ).trim();

    if (!attendanceStudentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "attendance_student_id is required.",
        },
        { status: 400 },
      );
    }

    const attendanceStudent =
      await loadAttendanceStudent(
        supabaseAdmin,
        tenantId,
        attendanceStudentId,
      );

    if (!attendanceStudent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Attendance student record not found.",
        },
        { status: 404 },
      );
    }

    const existing = await loadApproval(
      supabaseAdmin,
      tenantId,
      attendanceStudentId,
    );

    if (existing?.status === "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Approved attendance cannot be submitted again.",
        },
        { status: 409 },
      );
    }

    const previousStatus =
      (existing?.status as ApprovalStatus | null) ??
      null;

    const action: AuditAction =
      previousStatus === "REJECTED"
        ? "RESUBMITTED"
        : "SUBMITTED";

    const now = new Date().toISOString();

    const payload = {
      id:
        existing?.id ??
        `attendance_approval_${crypto.randomUUID()}`,
      tenantId,
      attendance_student_id:
        attendanceStudentId,
      status: "PENDING" as ApprovalStatus,
      reason: null,
      acted_by: appUser.id,
      acted_at: now,
      updated_at: now,
    };

    const { data: approval, error } =
      await supabaseAdmin
        .from("attendance_approvals")
        .upsert(payload, {
          onConflict:
            "attendance_student_id",
        })
        .select(
          `
            id,
            "tenantId",
            attendance_student_id,
            status,
            reason,
            acted_by,
            acted_at,
            created_at,
            updated_at
          `,
        )
        .single();

    if (error) {
      throw error;
    }

    await writeAuditEvent(
      supabaseAdmin,
      {
        tenantId,
        attendanceStudentId,
        approvalId: approval.id,
        action,
        oldStatus: previousStatus,
        newStatus: "PENDING",
        reason: null,
        performedBy: appUser.id,
      },
    );

    return NextResponse.json({
      success: true,
      approval,
    });
  } catch (error: any) {
    console.error(
      "POST /api/attendance/approval error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to submit attendance for approval.",
        details:
          process.env.NODE_ENV === "development"
            ? error?.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      supabaseAdmin,
      tenantId,
      appUser,
    } = context;

    if (!isSchoolAdmin(appUser.role)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only a school administrator can approve or reject attendance.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const attendanceStudentId =
      String(
        body?.attendance_student_id ?? "",
      ).trim();

    const requestedStatus =
      body?.status;

    const reason =
      body?.reason == null
        ? null
        : String(body.reason).trim() || null;

    if (!attendanceStudentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "attendance_student_id is required.",
        },
        { status: 400 },
      );
    }

    if (
      requestedStatus !== "APPROVED" &&
      requestedStatus !== "REJECTED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Admin action must be APPROVED or REJECTED.",
        },
        { status: 400 },
      );
    }

    const attendanceStudent =
      await loadAttendanceStudent(
        supabaseAdmin,
        tenantId,
        attendanceStudentId,
      );

    if (!attendanceStudent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Attendance student record not found.",
        },
        { status: 404 },
      );
    }

    const existing = await loadApproval(
      supabaseAdmin,
      tenantId,
      attendanceStudentId,
    );

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Attendance has not been submitted for approval.",
        },
        { status: 409 },
      );
    }

    if (existing.status === "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          error:
            "This attendance is already approved.",
        },
        { status: 409 },
      );
    }

    const oldStatus =
      existing.status as ApprovalStatus;

    const now = new Date().toISOString();

    const {
      data: approval,
      error,
    } = await supabaseAdmin
      .from("attendance_approvals")
      .update({
        status: requestedStatus,
        reason,
        acted_by: appUser.id,
        acted_at: now,
        updated_at: now,
      })
      .eq("id", existing.id)
      .eq("tenantId", tenantId)
      .select(
        `
          id,
          "tenantId",
          attendance_student_id,
          status,
          reason,
          acted_by,
          acted_at,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw error;
    }

    await writeAuditEvent(
      supabaseAdmin,
      {
        tenantId,
        attendanceStudentId,
        approvalId: approval.id,
        action:
          requestedStatus === "APPROVED"
            ? "APPROVED"
            : "REJECTED",
        oldStatus,
        newStatus:
          requestedStatus as ApprovalStatus,
        reason,
        performedBy: appUser.id,
      },
    );

    return NextResponse.json({
      success: true,
      approval,
    });
  } catch (error: any) {
    console.error(
      "PATCH /api/attendance/approval error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update attendance approval.",
        details:
          process.env.NODE_ENV === "development"
            ? error?.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

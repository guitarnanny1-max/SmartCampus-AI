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
        { error: "Supabase configuration is incomplete." },
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Read-only request context.
          }
        },
      },
    },
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
      .select("id, tenantId, email, name, role")
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    console.error("Student Fees User lookup error:", userError);

    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 },
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        { error: "Application user has no tenant." },
        { status: 403 },
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
  };
}

/*
 * ============================================================
 * GET — LIST STUDENT FEES
 * ============================================================
 */

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const url = new URL(request.url);

    const studentId =
      (url.searchParams.get("student_id") || "").trim();

    const academicYearId =
      (url.searchParams.get("academic_year_id") || "").trim();

    let query = supabaseAdmin
      .from("student_fees")
      .select(
        `
          id,
          "tenantId",
          student_id,
          enrollment_id,
          academic_year_id,
          fee_structure_id,
          fee_type_id,
          amount,
          discount_amount,
          net_amount,
          due_date,
          status,
          remarks,
          created_at,
          updated_at
        `,
      )
      .eq("tenantId", tenantId)
      .order("due_date", { ascending: true })
      .order("created_at", { ascending: false });

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    if (academicYearId) {
      query = query.eq("academic_year_id", academicYearId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Student Fees GET error:", error);

      return NextResponse.json(
        { error: "Unable to load student fees." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      studentFees: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/student-fees error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load student fees.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — ASSIGN FEE TO STUDENT
 * ============================================================
 */

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const studentId =
      typeof body.student_id === "string"
        ? body.student_id.trim()
        : "";

    const enrollmentId =
      typeof body.enrollment_id === "string"
        ? body.enrollment_id.trim()
        : "";

    const academicYearId =
      typeof body.academic_year_id === "string"
        ? body.academic_year_id.trim()
        : "";

    const feeStructureId =
      typeof body.fee_structure_id === "string"
        ? body.fee_structure_id.trim()
        : "";

    const remarks =
      typeof body.remarks === "string"
        ? body.remarks.trim()
        : "";

    const discountAmount =
      typeof body.discount_amount === "number"
        ? body.discount_amount
        : Number(body.discount_amount ?? 0);

    if (!studentId) {
      return NextResponse.json(
        { error: "Student is required." },
        { status: 400 },
      );
    }

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "Student enrollment is required." },
        { status: 400 },
      );
    }

    if (!academicYearId) {
      return NextResponse.json(
        { error: "Academic year is required." },
        { status: 400 },
      );
    }

    if (!feeStructureId) {
      return NextResponse.json(
        { error: "Fee structure is required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(discountAmount) || discountAmount < 0) {
      return NextResponse.json(
        { error: "Discount amount must be a valid non-negative number." },
        { status: 400 },
      );
    }

    /*
     * Verify student belongs to the current tenant.
     */

    const { data: student, error: studentError } =
      await supabaseAdmin
        .from("Student")
        .select("id")
        .eq("id", studentId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (studentError) {
      console.error("Student fee student lookup error:", studentError);

      return NextResponse.json(
        { error: "Unable to validate student." },
        { status: 500 },
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    /*
     * Verify enrollment belongs to this student and tenant.
     */

    const { data: enrollment, error: enrollmentError } =
      await supabaseAdmin
        .from("student_enrollments")
        .select(
          `
            id,
            student_id,
            academic_year_id,
            "tenantId"
          `,
        )
        .eq("id", enrollmentId)
        .eq("student_id", studentId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (enrollmentError) {
      console.error(
        "Student fee enrollment lookup error:",
        enrollmentError,
      );

      return NextResponse.json(
        { error: "Unable to validate student enrollment." },
        { status: 500 },
      );
    }

    if (!enrollment) {
      return NextResponse.json(
        { error: "Student enrollment not found." },
        { status: 404 },
      );
    }

    if (enrollment.academic_year_id !== academicYearId) {
      return NextResponse.json(
        {
          error:
            "Student enrollment does not belong to the selected academic year.",
        },
        { status: 400 },
      );
    }

    /*
     * Load and validate the fee structure.
     */

    const { data: feeStructure, error: structureError } =
      await supabaseAdmin
        .from("fee_structures")
        .select(
          `
            id,
            "tenantId",
            academic_year_id,
            class_id,
            fee_type_id,
            amount,
            due_date,
            status
          `,
        )
        .eq("id", feeStructureId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (structureError) {
      console.error(
        "Student fee structure lookup error:",
        structureError,
      );

      return NextResponse.json(
        { error: "Unable to validate fee structure." },
        { status: 500 },
      );
    }

    if (!feeStructure) {
      return NextResponse.json(
        { error: "Fee structure not found." },
        { status: 404 },
      );
    }

    if (feeStructure.academic_year_id !== academicYearId) {
      return NextResponse.json(
        {
          error:
            "Fee structure does not belong to the selected academic year.",
        },
        { status: 400 },
      );
    }

    if (feeStructure.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Only active fee structures can be assigned." },
        { status: 400 },
      );
    }

    const amount = Number(feeStructure.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: "Fee structure amount is invalid." },
        { status: 400 },
      );
    }

    if (discountAmount > amount) {
      return NextResponse.json(
        {
          error:
            "Discount amount cannot be greater than the fee amount.",
        },
        { status: 400 },
      );
    }

    const netAmount = amount - discountAmount;

    /*
     * Prevent duplicate assignment of the same fee structure
     * to the same student enrollment.
     */

    const { data: existingFee, error: existingError } =
      await supabaseAdmin
        .from("student_fees")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("student_id", studentId)
        .eq("enrollment_id", enrollmentId)
        .eq("fee_structure_id", feeStructureId)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Student fee duplicate lookup error:",
        existingError,
      );

      return NextResponse.json(
        { error: "Unable to validate existing student fee." },
        { status: 500 },
      );
    }

    if (existingFee) {
      return NextResponse.json(
        {
          error:
            "This fee structure is already assigned to this student.",
        },
        { status: 409 },
      );
    }

    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { data, error } = await supabaseAdmin
      .from("student_fees")
      .insert({
        id: `student_fee_${id}`,
        tenantId,
        student_id: studentId,
        enrollment_id: enrollmentId,
        academic_year_id: academicYearId,
        fee_structure_id: feeStructureId,
        fee_type_id: feeStructure.fee_type_id,
        amount,
        discount_amount: discountAmount,
        net_amount: netAmount,
        due_date: feeStructure.due_date ?? null,
        status: "PENDING",
        remarks: remarks || null,
      })
      .select(
        `
          id,
          "tenantId",
          student_id,
          enrollment_id,
          academic_year_id,
          fee_structure_id,
          fee_type_id,
          amount,
          discount_amount,
          net_amount,
          due_date,
          status,
          remarks,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This fee structure is already assigned to this student.",
          },
          { status: 409 },
        );
      }

      if (error.code === "23503") {
        return NextResponse.json(
          {
            error:
              "One of the selected student, enrollment, academic year, fee structure, or fee type records could not be found.",
          },
          { status: 400 },
        );
      }

      console.error("Student Fee POST error:", error);

      return NextResponse.json(
        { error: "Unable to assign fee to student." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        studentFee: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/student-fees error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to assign fee to student.",
      },
      { status: 500 },
    );
  }
}

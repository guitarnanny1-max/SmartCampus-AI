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
    console.error("Fee Payments User lookup error:", userError);

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
    userId: appUser.id,
  };
}

/*
 * ============================================================
 * GET — LIST FEE PAYMENTS
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

    const status =
      (url.searchParams.get("status") || "").trim();

    let query = supabaseAdmin
      .from("fee_payments")
      .select(
        `
          id,
          "tenantId",
          student_id,
          academic_year_id,
          payment_date,
          amount,
          payment_method,
          transaction_reference,
          status,
          remarks,
          collected_by,
          created_at,
          updated_at
        `,
      )
      .eq("tenantId", tenantId)
      .order("payment_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    if (academicYearId) {
      query = query.eq("academic_year_id", academicYearId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Fee Payments GET error:", error);

      return NextResponse.json(
        { error: "Unable to load fee payments." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      payments: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/fee-payments error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load fee payments.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — RECORD PAYMENT
 * ============================================================
 */

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId, userId } = context;

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

    const academicYearId =
      typeof body.academic_year_id === "string"
        ? body.academic_year_id.trim()
        : "";

    const studentFeeId =
      typeof body.student_fee_id === "string"
        ? body.student_fee_id.trim()
        : "";

    const paymentMethod =
      typeof body.payment_method === "string"
        ? body.payment_method.trim().toUpperCase()
        : "CASH";

    const transactionReference =
      typeof body.transaction_reference === "string"
        ? body.transaction_reference.trim()
        : "";

    const remarks =
      typeof body.remarks === "string"
        ? body.remarks.trim()
        : "";

    const paymentDate =
      typeof body.payment_date === "string"
        ? body.payment_date.trim()
        : new Date().toISOString().slice(0, 10);

    const amount =
      typeof body.amount === "number"
        ? body.amount
        : Number(body.amount ?? 0);

    const allowedMethods = [
      "CASH",
      "UPI",
      "BANK_TRANSFER",
      "CARD",
      "CHEQUE",
      "ONLINE",
    ];

    if (!studentId) {
      return NextResponse.json(
        { error: "Student is required." },
        { status: 400 },
      );
    }

    if (!academicYearId) {
      return NextResponse.json(
        { error: "Academic year is required." },
        { status: 400 },
      );
    }

    if (!studentFeeId) {
      return NextResponse.json(
        { error: "Student fee is required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Payment amount must be greater than zero." },
        { status: 400 },
      );
    }

    if (!allowedMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          error:
            "Invalid payment method. Use CASH, UPI, BANK_TRANSFER, CARD, CHEQUE, or ONLINE.",
        },
        { status: 400 },
      );
    }

    if (!paymentDate) {
      return NextResponse.json(
        { error: "Payment date is required." },
        { status: 400 },
      );
    }

    /*
     * Verify student belongs to the tenant.
     */

    const { data: student, error: studentError } =
      await supabaseAdmin
        .from("Student")
        .select("id")
        .eq("id", studentId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (studentError) {
      console.error(
        "Fee payment student lookup error:",
        studentError,
      );

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
     * Load the student fee.
     */

    const { data: studentFee, error: studentFeeError } =
      await supabaseAdmin
        .from("student_fees")
        .select(
          `
            id,
            "tenantId",
            student_id,
            academic_year_id,
            amount,
            discount_amount,
            net_amount,
            due_date,
            status
          `,
        )
        .eq("id", studentFeeId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (studentFeeError) {
      console.error(
        "Fee payment student fee lookup error:",
        studentFeeError,
      );

      return NextResponse.json(
        { error: "Unable to validate student fee." },
        { status: 500 },
      );
    }

    if (!studentFee) {
      return NextResponse.json(
        { error: "Student fee not found." },
        { status: 404 },
      );
    }

    if (studentFee.student_id !== studentId) {
      return NextResponse.json(
        {
          error:
            "The selected student fee does not belong to this student.",
        },
        { status: 400 },
      );
    }

    if (studentFee.academic_year_id !== academicYearId) {
      return NextResponse.json(
        {
          error:
            "The selected student fee does not belong to this academic year.",
        },
        { status: 400 },
      );
    }

    /*
     * Calculate already allocated amount.
     */

    const { data: allocations, error: allocationsError } =
      await supabaseAdmin
        .from("fee_payment_allocations")
        .select(
          `
            id,
            payment_id,
            student_fee_id,
            amount
          `,
        )
        .eq("tenantId", tenantId)
        .eq("student_fee_id", studentFeeId);

    if (allocationsError) {
      console.error(
        "Fee payment allocations lookup error:",
        allocationsError,
      );

      return NextResponse.json(
        { error: "Unable to calculate existing fee payments." },
        { status: 500 },
      );
    }

    /*
     * Only COMPLETED payments count toward the balance.
     */

    const paymentIds = [
      ...new Set(
        (allocations ?? [])
          .map((allocation) => allocation.payment_id)
          .filter(Boolean),
      ),
    ];

    let completedPaymentIds = new Set<string>();

    if (paymentIds.length > 0) {
      const { data: existingPayments, error: existingPaymentsError } =
        await supabaseAdmin
          .from("fee_payments")
          .select("id, status")
          .eq("tenantId", tenantId)
          .in("id", paymentIds);

      if (existingPaymentsError) {
        console.error(
          "Fee payment existing payments lookup error:",
          existingPaymentsError,
        );

        return NextResponse.json(
          { error: "Unable to calculate existing payments." },
          { status: 500 },
        );
      }

      completedPaymentIds = new Set(
        (existingPayments ?? [])
          .filter((payment) => payment.status === "COMPLETED")
          .map((payment) => payment.id),
      );
    }

    const paidAmount = (allocations ?? [])
      .filter((allocation) =>
        completedPaymentIds.has(allocation.payment_id),
      )
      .reduce(
        (total, allocation) =>
          total + Number(allocation.amount ?? 0),
        0,
      );

    const netAmount = Number(studentFee.net_amount ?? 0);
    const balanceBefore = Math.max(0, netAmount - paidAmount);

    if (balanceBefore <= 0) {
      return NextResponse.json(
        {
          error: "This student fee is already fully paid.",
        },
        { status: 409 },
      );
    }

    if (amount > balanceBefore) {
      return NextResponse.json(
        {
          error: `Payment exceeds the outstanding balance of ₹${balanceBefore.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}.`,
        },
        { status: 409 },
      );
    }

    /*
     * Create payment.
     */

    const paymentUuid =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const paymentId = `fee_payment_${paymentUuid}`;

    const { data: payment, error: paymentError } =
      await supabaseAdmin
        .from("fee_payments")
        .insert({
          id: paymentId,
          tenantId,
          student_id: studentId,
          academic_year_id: academicYearId,
          payment_date: paymentDate,
          amount,
          payment_method: paymentMethod,
          transaction_reference:
            transactionReference || null,
          status: "COMPLETED",
          remarks: remarks || null,
          collected_by: userId,
        })
        .select(
          `
            id,
            "tenantId",
            student_id,
            academic_year_id,
            payment_date,
            amount,
            payment_method,
            transaction_reference,
            status,
            remarks,
            collected_by,
            created_at,
            updated_at
          `,
        )
        .single();

    if (paymentError) {
      console.error(
        "Fee payment insert error:",
        paymentError,
      );

      if (paymentError.code === "23503") {
        return NextResponse.json(
          {
            error:
              "Unable to create payment because a referenced record could not be found.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Unable to record fee payment." },
        { status: 500 },
      );
    }

    /*
     * Allocate payment to the selected student fee.
     */

    const allocationUuid =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const allocationId = `fee_allocation_${allocationUuid}`;

    const { data: allocation, error: allocationError } =
      await supabaseAdmin
        .from("fee_payment_allocations")
        .insert({
          id: allocationId,
          tenantId,
          payment_id: paymentId,
          student_fee_id: studentFeeId,
          amount,
        })
        .select(
          `
            id,
            "tenantId",
            payment_id,
            student_fee_id,
            amount
          `,
        )
        .single();

    if (allocationError) {
      console.error(
        "Fee payment allocation error:",
        allocationError,
      );

      /*
       * Roll back the payment if allocation fails.
       */

      await supabaseAdmin
        .from("fee_payments")
        .delete()
        .eq("id", paymentId)
        .eq("tenantId", tenantId);

      return NextResponse.json(
        { error: "Unable to allocate fee payment." },
        { status: 500 },
      );
    }

    /*
     * Calculate the new balance and update student fee status.
     */

    const paidAfterPayment = paidAmount + amount;
    const balanceAfter = Math.max(
      0,
      netAmount - paidAfterPayment,
    );

    const newStatus =
      balanceAfter <= 0 ? "PAID" : "PARTIAL";

    const { data: updatedStudentFee, error: updateFeeError } =
      await supabaseAdmin
        .from("student_fees")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentFeeId)
        .eq("tenantId", tenantId)
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

    if (updateFeeError) {
      console.error(
        "Student fee status update error:",
        updateFeeError,
      );

      /*
       * Remove allocation and payment if status update fails.
       */

      await supabaseAdmin
        .from("fee_payment_allocations")
        .delete()
        .eq("id", allocationId)
        .eq("tenantId", tenantId);

      await supabaseAdmin
        .from("fee_payments")
        .delete()
        .eq("id", paymentId)
        .eq("tenantId", tenantId);

      return NextResponse.json(
        { error: "Unable to update student fee status." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        payment,
        allocation,
        studentFee: updatedStudentFee,
        balanceBefore,
        paidAmount,
        amountPaid: amount,
        balanceAfter,
        status: newStatus,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/fee-payments error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to record fee payment.",
      },
      { status: 500 },
    );
  }
}

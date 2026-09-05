import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data: appUser, error: appUserError } = await admin
      .from("User")
      .select('id, "tenantId", email, name, role')
      .eq("email", user.email)
      .maybeSingle();

    if (appUserError || !appUser) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");
    const academicYearId = searchParams.get("academic_year_id");

    let feesQuery = admin
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
        remarks
        `,
      )
      .eq("tenantId", appUser.tenantId)
      .order("due_date", { ascending: true });

    if (studentId) {
      feesQuery = feesQuery.eq("student_id", studentId);
    }

    if (academicYearId) {
      feesQuery = feesQuery.eq("academic_year_id", academicYearId);
    }

    const { data: fees, error: feesError } = await feesQuery;

    if (feesError) {
      return NextResponse.json(
        { error: feesError.message },
        { status: 500 },
      );
    }

    const feeRows = fees ?? [];

    if (feeRows.length === 0) {
      return NextResponse.json({
        success: true,
        dues: [],
        total: 0,
        totalOutstanding: 0,
      });
    }

    const feeIds = feeRows.map((fee) => fee.id);

    const { data: allocations, error: allocationsError } = await admin
      .from("fee_payment_allocations")
      .select("student_fee_id, amount, payment_id")
      .eq("tenantId", appUser.tenantId)
      .in("student_fee_id", feeIds);

    if (allocationsError) {
      return NextResponse.json(
        { error: allocationsError.message },
        { status: 500 },
      );
    }

    const paymentIds = [
      ...new Set((allocations ?? []).map((item) => item.payment_id)),
    ];

    let completedPaymentIds = new Set<string>();

    if (paymentIds.length > 0) {
      const { data: payments, error: paymentsError } = await admin
        .from("fee_payments")
        .select("id")
        .eq("tenantId", appUser.tenantId)
        .eq("status", "COMPLETED")
        .in("id", paymentIds);

      if (paymentsError) {
        return NextResponse.json(
          { error: paymentsError.message },
          { status: 500 },
        );
      }

      completedPaymentIds = new Set(
        (payments ?? []).map((payment) => payment.id),
      );
    }

    const paidByFee = new Map<string, number>();

    for (const allocation of allocations ?? []) {
      if (!completedPaymentIds.has(allocation.payment_id)) {
        continue;
      }

      const current = paidByFee.get(allocation.student_fee_id) ?? 0;
      paidByFee.set(
        allocation.student_fee_id,
        current + Number(allocation.amount ?? 0),
      );
    }

    const dues = feeRows.map((fee) => {
      const netAmount = Number(fee.net_amount ?? 0);
      const paidAmount = paidByFee.get(fee.id) ?? 0;
      const outstandingAmount = Math.max(
        0,
        netAmount - paidAmount,
      );

      let status = fee.status ?? "PENDING";

      if (outstandingAmount === 0 && netAmount > 0) {
        status = "PAID";
      } else if (paidAmount > 0) {
        status = "PARTIAL";
      } else {
        status = "PENDING";
      }

      return {
        ...fee,
        paid_amount: paidAmount,
        outstanding_amount: outstandingAmount,
        calculated_status: status,
      };
    });

    const outstandingDues = dues.filter(
      (fee) => fee.outstanding_amount > 0,
    );

    const totalOutstanding = outstandingDues.reduce(
      (total, fee) => total + Number(fee.outstanding_amount ?? 0),
      0,
    );

    return NextResponse.json({
      success: true,
      dues: outstandingDues,
      total: outstandingDues.length,
      totalOutstanding,
    });
  } catch (error) {
    console.error("GET /api/fee-dues error:", error);

    return NextResponse.json(
      { error: "Unable to load fee dues." },
      { status: 500 },
    );
  }
}

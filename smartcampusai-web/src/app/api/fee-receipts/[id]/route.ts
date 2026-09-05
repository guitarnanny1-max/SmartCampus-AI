import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getContext() {
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
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return { error: "Unauthorized" };
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: appUser, error: userError } = await admin
    .from("User")
    .select('id, "tenantId", email, name, role')
    .eq("email", user.email)
    .maybeSingle();

  if (userError || !appUser) {
    return { error: "Application user not found" };
  }

  return { admin, appUser };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getContext();

    if ("error" in context) {
      return NextResponse.json(
        { success: false, error: context.error },
        { status: 401 }
      );
    }

    const { admin, appUser } = context;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Receipt ID is required" },
        { status: 400 }
      );
    }

    const { data: receipt, error: receiptError } = await admin
      .from("fee_receipts")
      .select("*")
      .eq("id", id)
      .eq('"tenantId"', appUser.tenantId)
      .maybeSingle();

    if (receiptError) {
      return NextResponse.json(
        { success: false, error: receiptError.message },
        { status: 500 }
      );
    }

    if (!receipt) {
      return NextResponse.json(
        { success: false, error: "Receipt not found" },
        { status: 404 }
      );
    }

    const { data: payment, error: paymentError } = await admin
      .from("fee_payments")
      .select("*")
      .eq("id", receipt.payment_id)
      .eq('"tenantId"', appUser.tenantId)
      .maybeSingle();

    if (paymentError) {
      return NextResponse.json(
        { success: false, error: paymentError.message },
        { status: 500 }
      );
    }

    const { data: student, error: studentError } = await admin
      .from("Student")
      .select("*")
      .eq("id", receipt.issued_to_student_id)
      .maybeSingle();

    if (studentError) {
      return NextResponse.json(
        { success: false, error: studentError.message },
        { status: 500 }
      );
    }

    let academicYear = null;
    let enrollment = null;
    let classRecord = null;
    let sectionRecord = null;

    if (payment?.academic_year_id) {
      const { data } = await admin
        .from("academic_years")
        .select("*")
        .eq("id", payment.academic_year_id)
        .maybeSingle();

      academicYear = data || null;

      const { data: enrollmentData, error: enrollmentError } =
        await admin
          .from("student_enrollments")
          .select(
            "id, student_id, academic_year_id, class_id, section_id, roll_number, status"
          )
          .eq('"tenantId"', appUser.tenantId)
          .eq("student_id", receipt.issued_to_student_id)
          .eq("academic_year_id", payment.academic_year_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

      if (enrollmentError) {
        return NextResponse.json(
          { success: false, error: enrollmentError.message },
          { status: 500 }
        );
      }

      enrollment = enrollmentData || null;

      if (enrollment?.class_id) {
        const { data } = await admin
          .from("classes")
          .select("id, name")
          .eq('"tenantId"', appUser.tenantId)
          .eq("id", enrollment.class_id)
          .maybeSingle();

        classRecord = data || null;
      }

      if (enrollment?.section_id) {
        const { data } = await admin
          .from("sections")
          .select("id, name")
          .eq('"tenantId"', appUser.tenantId)
          .eq("id", enrollment.section_id)
          .maybeSingle();

        sectionRecord = data || null;
      }
    }

    const { data: allocations, error: allocationError } = await admin
      .from("fee_payment_allocations")
      .select("*")
      .eq("payment_id", receipt.payment_id)
      .eq('"tenantId"', appUser.tenantId);

    if (allocationError) {
      return NextResponse.json(
        { success: false, error: allocationError.message },
        { status: 500 }
      );
    }

    const studentFeeIds = (allocations || []).map(
      (allocation) => allocation.student_fee_id
    );

    let studentFees: any[] = [];

    if (studentFeeIds.length > 0) {
      const { data } = await admin
        .from("student_fees")
        .select("*")
        .eq('"tenantId"', appUser.tenantId)
        .in("id", studentFeeIds);

      studentFees = data || [];
    }

    const feeTypeIds = [
      ...new Set(
        studentFees
          .map((fee) => fee.fee_type_id)
          .filter(Boolean)
      ),
    ];

    let feeTypes: any[] = [];

    if (feeTypeIds.length > 0) {
      const { data } = await admin
        .from("fee_types")
        .select("*")
        .eq('"tenantId"', appUser.tenantId)
        .in("id", feeTypeIds);

      feeTypes = data || [];
    }

    const feeDetails = studentFees.map((fee) => {
      const feeType = feeTypes.find(
        (type) => type.id === fee.fee_type_id
      );

      const allocation = (allocations || []).find(
        (item) => item.student_fee_id === fee.id
      );

      return {
        ...fee,
        fee_type: feeType || null,
        allocated_amount: allocation?.amount || 0,
      };
    });

    return NextResponse.json({
      success: true,
      receipt,
      payment: payment || null,
      student: student || null,
      academicYear,
      enrollment,
      classRecord,
      sectionRecord,
      allocations: allocations || [],
      feeDetails,
      issuedBy: {
        id: appUser.id,
        name: appUser.name,
        email: appUser.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error",
      },
      { status: 500 }
    );
  }
}

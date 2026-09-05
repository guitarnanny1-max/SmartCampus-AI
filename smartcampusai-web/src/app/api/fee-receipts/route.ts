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

  return { admin, user, appUser };
}

export async function GET(request: Request) {
  try {
    const context = await getContext();

    if ("error" in context) {
      return NextResponse.json(
        { success: false, error: context.error },
        { status: 401 }
      );
    }

    const { admin, appUser } = context;
    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get("student_id");
    const academicYearId = searchParams.get("academic_year_id");
    const status = searchParams.get("status");

    let query = admin
      .from("fee_receipts")
      .select("*")
      .eq('"tenantId"', appUser.tenantId)
      .order("receipt_date", { ascending: false });

    if (studentId) {
      query = query.eq("issued_to_student_id", studentId);
    }

    if (academicYearId) {
      const { data: payments } = await admin
        .from("fee_payments")
        .select("id")
        .eq('"tenantId"', appUser.tenantId)
        .eq("academic_year_id", academicYearId);

      const paymentIds = (payments || []).map((payment) => payment.id);

      if (paymentIds.length === 0) {
        return NextResponse.json({
          success: true,
          receipts: [],
          total: 0,
        });
      }

      query = query.in("payment_id", paymentIds);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      receipts: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getContext();

    if ("error" in context) {
      return NextResponse.json(
        { success: false, error: context.error },
        { status: 401 }
      );
    }

    const { admin, appUser } = context;
    const body = await request.json();

    const paymentId = String(body.payment_id || "").trim();

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          error: "payment_id is required",
        },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } = await admin
      .from("fee_payments")
      .select(
        "id, \"tenantId\", student_id, academic_year_id, payment_date, amount, status, remarks"
      )
      .eq("id", paymentId)
      .eq('"tenantId"', appUser.tenantId)
      .maybeSingle();

    if (paymentError) {
      return NextResponse.json(
        {
          success: false,
          error: paymentError.message,
        },
        { status: 500 }
      );
    }

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment not found",
        },
        { status: 404 }
      );
    }

    if (payment.status !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: "Only completed payments can have receipts.",
        },
        { status: 400 }
      );
    }

    const { data: existingReceipt } = await admin
      .from("fee_receipts")
      .select("*")
      .eq('"tenantId"', appUser.tenantId)
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (existingReceipt) {
      return NextResponse.json({
        success: true,
        receipt: existingReceipt,
        existing: true,
      });
    }

    const receiptNumber =
      String(body.receipt_number || "").trim() ||
      `REC-${new Date().getFullYear()}-${Date.now()}`;

    const receiptDate =
      String(body.receipt_date || "").trim() || payment.payment_date;

    const remarks =
      body.remarks !== undefined
        ? body.remarks
        : payment.remarks || null;

    const receipt = {
      id: `fee_receipt_${crypto.randomUUID()}`,
      tenantId: appUser.tenantId,
      payment_id: payment.id,
      receipt_number: receiptNumber,
      receipt_date: receiptDate,
      issued_to_student_id: payment.student_id,
      total_amount: Number(payment.amount),
      status: "ISSUED",
      remarks,
    };

    const { data: createdReceipt, error: insertError } = await admin
      .from("fee_receipts")
      .insert(receipt)
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        receipt: createdReceipt,
        existing: false,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}

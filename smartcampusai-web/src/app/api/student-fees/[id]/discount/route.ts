import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAdminContext() {
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
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: appUser, error: appUserError } = await admin
    .from("User")
    .select('id, "tenantId", email, name, role')
    .eq("email", user.email)
    .maybeSingle();

  if (appUserError || !appUser) {
    return {
      error: NextResponse.json(
        { success: false, error: "Application user not found" },
        { status: 403 }
      ),
    };
  }

  return { admin, appUser };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAdminContext();

    if ("error" in context) {
      return context.error;
    }

    const { admin, appUser } = context;
    const { id } = await params;

    const { data: studentFee, error: feeError } = await admin
      .from("student_fees")
      .select("*")
      .eq("id", id)
      .eq('"tenantId"', appUser.tenantId)
      .maybeSingle();

    if (feeError) {
      return NextResponse.json(
        { success: false, error: feeError.message },
        { status: 500 }
      );
    }

    if (!studentFee) {
      return NextResponse.json(
        { success: false, error: "Student fee not found" },
        { status: 404 }
      );
    }

    const { data: discounts, error: discountError } = await admin
      .from("student_fee_discounts")
      .select(`
        *,
        fee_discounts (
          id,
          name,
          code,
          discount_type,
          value,
          description,
          status
        )
      `)
      .eq('"tenantId"', appUser.tenantId)
      .eq("student_fee_id", id)
      .order("created_at", { ascending: false });

    if (discountError) {
      return NextResponse.json(
        { success: false, error: discountError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      studentFee,
      discounts: discounts || [],
      total: discounts?.length || 0,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAdminContext();

    if ("error" in context) {
      return context.error;
    }

    const { admin, appUser } = context;
    const { id } = await params;
    const body = await request.json();

    const feeDiscountId = String(body.fee_discount_id || "").trim();
    const remarks = body.remarks ? String(body.remarks).trim() : null;

    if (!feeDiscountId) {
      return NextResponse.json(
        { success: false, error: "Fee discount is required" },
        { status: 400 }
      );
    }

    const { data: studentFee, error: feeError } = await admin
      .from("student_fees")
      .select("*")
      .eq("id", id)
      .eq('"tenantId"', appUser.tenantId)
      .maybeSingle();

    if (feeError) {
      return NextResponse.json(
        { success: false, error: feeError.message },
        { status: 500 }
      );
    }

    if (!studentFee) {
      return NextResponse.json(
        { success: false, error: "Student fee not found" },
        { status: 404 }
      );
    }

    if (["PAID", "CANCELLED"].includes(studentFee.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot apply a discount to a ${studentFee.status.toLowerCase()} fee`,
        },
        { status: 409 }
      );
    }

    const { data: discount, error: discountError } = await admin
      .from("fee_discounts")
      .select("*")
      .eq("id", feeDiscountId)
      .eq('"tenantId"', appUser.tenantId)
      .maybeSingle();

    if (discountError) {
      return NextResponse.json(
        { success: false, error: discountError.message },
        { status: 500 }
      );
    }

    if (!discount) {
      return NextResponse.json(
        { success: false, error: "Fee discount not found" },
        { status: 404 }
      );
    }

    if (discount.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Only active discounts can be applied" },
        { status: 409 }
      );
    }

    const { data: existingDiscount, error: existingError } = await admin
      .from("student_fee_discounts")
      .select("id, status")
      .eq('"tenantId"', appUser.tenantId)
      .eq("student_fee_id", id)
      .eq("fee_discount_id", feeDiscountId)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { success: false, error: existingError.message },
        { status: 500 }
      );
    }

    if (existingDiscount?.status === "APPLIED") {
      return NextResponse.json(
        {
          success: false,
          error: "This discount is already applied to the student fee",
        },
        { status: 409 }
      );
    }

    const originalAmount = Number(studentFee.amount);
    const currentDiscountAmount = Number(studentFee.discount_amount || 0);

    let discountAmount =
      discount.discount_type === "PERCENTAGE"
        ? (originalAmount * Number(discount.value)) / 100
        : Number(discount.value);

    discountAmount = Math.round(discountAmount * 100) / 100;

    const maximumAllowed = Math.max(
      0,
      originalAmount - currentDiscountAmount
    );

    if (discountAmount > maximumAllowed) {
      discountAmount = maximumAllowed;
    }

    if (discountAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This discount does not reduce the remaining fee amount",
        },
        { status: 409 }
      );
    }

    const newDiscountAmount =
      Math.round((currentDiscountAmount + discountAmount) * 100) / 100;

    const newNetAmount =
      Math.round((originalAmount - newDiscountAmount) * 100) / 100;

    const discountRecord = {
      id: `student_fee_discount_${crypto.randomUUID()}`,
      tenantId: appUser.tenantId,
      student_fee_id: id,
      fee_discount_id: feeDiscountId,
      discount_amount: discountAmount,
      remarks,
      status: "APPLIED",
    };

    const { data: createdDiscount, error: insertError } = await admin
      .from("student_fee_discounts")
      .insert(discountRecord)
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    const newStatus = newNetAmount === 0 ? "PAID" : "PENDING";

    const { data: updatedFee, error: updateError } = await admin
      .from("student_fees")
      .update({
        discount_amount: newDiscountAmount,
        net_amount: newNetAmount,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq('"tenantId"', appUser.tenantId)
      .select("*")
      .single();

    if (updateError) {
      await admin
        .from("student_fee_discounts")
        .delete()
        .eq("id", createdDiscount.id)
        .eq('"tenantId"', appUser.tenantId);

      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Discount applied successfully",
        discount: createdDiscount,
        studentFee: updatedFee,
        discountAmount,
        previousDiscountAmount: currentDiscountAmount,
        totalDiscountAmount: newDiscountAmount,
        newNetAmount,
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

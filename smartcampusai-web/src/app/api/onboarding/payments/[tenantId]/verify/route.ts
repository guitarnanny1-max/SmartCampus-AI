import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  return cleaned || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  try {
    const { tenantId } = await params;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required." },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const transactionId = cleanString(body.transactionId);
    const paymentMethod =
      cleanString(body.paymentMethod) || "MANUAL";
    const notes = cleanString(body.notes);
    const verifiedBy =
      cleanString(body.verifiedBy) || "ThomasG Technologies";

    const supabase = getSupabaseAdmin();

    /*
     * 1. LOAD TENANT
     */

    const { data: tenant, error: tenantError } = await supabase
      .from("Tenant")
      .select("*")
      .eq("id", tenantId)
      .maybeSingle();

    if (tenantError) {
      console.error("Tenant lookup error:", tenantError);

      return NextResponse.json(
        {
          error: "Unable to load tenant.",
          details:
            process.env.NODE_ENV === "development"
              ? tenantError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found." },
        { status: 404 },
      );
    }

    /*
     * 2. CHECK FOR EXISTING PAYMENT
     */

    const { data: existingPayment, error: existingPaymentError } =
      await supabase
        .from("Payment")
        .select("*")
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (existingPaymentError) {
      console.error(
        "Existing payment lookup error:",
        existingPaymentError,
      );

      return NextResponse.json(
        {
          error: "Unable to check existing payment.",
          details:
            process.env.NODE_ENV === "development"
              ? existingPaymentError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 3. CREATE OR UPDATE PAYMENT
     */

    const paymentId =
      existingPayment?.id || `payment_${crypto.randomUUID()}`;

    const paymentPayload = {
      id: paymentId,
      tenantId,
      amount: existingPayment?.amount ?? 0,
      studentName: existingPayment?.studentName ?? tenant.name,
      status: "VERIFIED",
      transactionId,
      paymentMethod,
      plan: tenant.plan,
      verificationStatus: "VERIFIED",
      verifiedAt: new Date().toISOString(),
      verifiedBy,
      notes,
    };

    let payment;

    if (existingPayment) {
      const { data, error } = await supabase
        .from("Payment")
        .update(paymentPayload)
        .eq("id", existingPayment.id)
        .select()
        .single();

      if (error) {
        console.error("Payment verification update error:", error);

        return NextResponse.json(
          {
            error: "Unable to verify payment.",
            details:
              process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
          },
          { status: 500 },
        );
      }

      payment = data;
    } else {
      const { data, error } = await supabase
        .from("Payment")
        .insert(paymentPayload)
        .select()
        .single();

      if (error) {
        console.error("Payment verification creation error:", error);

        return NextResponse.json(
          {
            error: "Unable to create verified payment.",
            details:
              process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
          },
          { status: 500 },
        );
      }

      payment = data;
    }

    /*
     * 4. ACTIVATE TENANT
     */

    const now = new Date().toISOString();

    const { data: updatedTenant, error: tenantUpdateError } =
      await supabase
        .from("Tenant")
        .update({
          status: "ACTIVE",
          paymentStatus: "VERIFIED",
          onboardingStatus: "ACTIVE",
          activatedAt: now,
          verifiedAt: now,
        })
        .eq("id", tenantId)
        .select()
        .single();

    if (tenantUpdateError) {
      console.error(
        "Tenant activation error:",
        tenantUpdateError,
      );

      return NextResponse.json(
        {
          error:
            "Payment was verified, but the school could not be activated.",
          payment,
          details:
            process.env.NODE_ENV === "development"
              ? tenantUpdateError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 5. RETURN ACTIVATION RESULT
     */

    return NextResponse.json(
      {
        success: true,
        message:
          "Payment verified and school activated successfully.",
        operator: "ThomasG Technologies",
        onboarding: {
          status: "ACTIVE",
          tenantId,
          plan: updatedTenant.plan,
          paymentStatus: "VERIFIED",
        },
        payment: {
          id: payment.id,
          transactionId: payment.transactionId,
          paymentMethod: payment.paymentMethod,
          verificationStatus: payment.verificationStatus,
          verifiedBy: payment.verifiedBy,
          verifiedAt: payment.verifiedAt,
        },
        tenant: updatedTenant,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Payment verification API error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to verify payment.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}

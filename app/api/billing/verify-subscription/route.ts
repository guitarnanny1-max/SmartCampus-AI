import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type VerifyBody = {
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
};

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  return { keyId, keySecret };
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

async function razorpayGet(
  path: string,
  keyId: string,
  keySecret: string
) {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.description || `Razorpay request failed: ${response.status}`
    );
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyBody;

    const paymentId = body.razorpay_payment_id?.trim();
    const subscriptionId = body.razorpay_subscription_id?.trim();
    const signature = body.razorpay_signature?.trim();

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json(
        {
          success: false,
          error:
            "razorpay_payment_id, razorpay_subscription_id and razorpay_signature are required",
        },
        { status: 400 }
      );
    }

    const { keyId, keySecret } = getRazorpayCredentials();

    // Razorpay Checkout subscription signature:
    // HMAC_SHA256(payment_id + "|" + subscription_id, key_secret)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${paymentId}|${subscriptionId}`)
      .digest("hex");

    if (!safeCompare(expectedSignature, signature)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Razorpay signature",
        },
        { status: 400 }
      );
    }

    // Find our local subscription first.
    const localSubscription = await prisma.subscription.findUnique({
      where: {
        razorpaySubscriptionId: subscriptionId,
      },
      include: {
        Tenant: true,
        PlatformPlan: true,
      },
    });

    if (!localSubscription) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription is not registered in SmartCampus AI",
        },
        { status: 404 }
      );
    }

    // Fetch authoritative subscription state from Razorpay.
    const razorpaySubscription = await razorpayGet(
      `subscriptions/${encodeURIComponent(subscriptionId)}`,
      keyId,
      keySecret
    );

    // Fetch authoritative payment state from Razorpay.
    const razorpayPayment = await razorpayGet(
      `payments/${encodeURIComponent(paymentId)}`,
      keyId,
      keySecret
    );

    const subscriptionStatus = String(
      razorpaySubscription?.status || ""
    ).toLowerCase();

    const paymentStatus = String(
      razorpayPayment?.status || ""
    ).toLowerCase();

    const paymentIsCaptured = paymentStatus === "captured";

    const subscriptionIsValid =
      subscriptionStatus === "active" ||
      subscriptionStatus === "authenticated";

    if (!paymentIsCaptured || !subscriptionIsValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment has not been successfully confirmed",
          paymentStatus,
          subscriptionStatus,
        },
        { status: 402 }
      );
    }

    const now = new Date();

    // Activate both records atomically.
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.update({
        where: {
          id: localSubscription.tenantId,
        },
        data: {
          status: "ACTIVE",
          paymentStatus: "VERIFIED",
          onboardingStatus: "PENDING",
          activatedAt: now,
          verifiedAt: now,
        },
      });

      const subscription = await tx.subscription.update({
        where: {
          id: localSubscription.id,
        },
        data: {
          status: "ACTIVE",
          currentPeriodStart:
            razorpaySubscription?.current_start
              ? new Date(razorpaySubscription.current_start * 1000)
              : now,
          currentPeriodEnd:
            razorpaySubscription?.current_end
              ? new Date(razorpaySubscription.current_end * 1000)
              : null,
          razorpayCustomerId:
            razorpaySubscription?.customer_id || null,
        },
      });

      return { tenant, subscription };
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and school workspace activated",
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        subdomain: result.tenant.subdomain,
        status: result.tenant.status,
        paymentStatus: result.tenant.paymentStatus,
        onboardingStatus: result.tenant.onboardingStatus,
      },
      subscription: {
        id: result.subscription.id,
        razorpaySubscriptionId:
          result.subscription.razorpaySubscriptionId,
        status: result.subscription.status,
        billingCycle: result.subscription.billingCycle,
      },
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY SUBSCRIPTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify Razorpay payment",
      },
      { status: 500 }
    );
  }
}

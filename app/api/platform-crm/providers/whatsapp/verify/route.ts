import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requirePlatformAdmin();

    const accessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN?.trim();
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const version =
      process.env.WHATSAPP_GRAPH_API_VERSION?.trim() || "v25.0";

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "WHATSAPP_CLOUD_ACCESS_TOKEN is not configured.",
        },
        { status: 400 }
      );
    }

    if (!phoneNumberId) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "WHATSAPP_PHONE_NUMBER_ID is not configured.",
        },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const url =
        `https://graph.facebook.com/${version}/${encodeURIComponent(phoneNumberId)}` +
        `?fields=id,display_phone_number,verified_name`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            configured: true,
            authenticated: false,
            status: response.status,
            error:
              data?.error?.message ||
              "Meta WhatsApp API rejected the credential request.",
            metaCode: data?.error?.code ?? null,
            metaType: data?.error?.type ?? null,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        configured: true,
        authenticated: true,
        apiVersion: version,
        phoneNumber: {
          id: data?.id ?? null,
          displayPhoneNumber: data?.display_phone_number ?? null,
          verifiedName: data?.verified_name ?? null,
        },
        message: "WhatsApp Cloud API credentials are valid.",
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.name === "AbortError"
              ? "WhatsApp API verification timed out."
              : error.message
            : "WhatsApp API verification failed.",
      },
      { status: 500 }
    );
  }
}

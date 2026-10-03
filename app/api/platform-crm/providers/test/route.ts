import { NextRequest, NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import {
  dispatchCampaignMessage,
  getCampaignProviderMode,
} from "@/lib/campaign-providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHANNELS = [
  "EMAIL",
  "WHATSAPP",
  "VOICE",
] as const;

export async function POST(request: NextRequest) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    const requestedChannel =
      typeof body.channel === "string"
        ? body.channel.toUpperCase()
        : "";

    if (
      requestedChannel &&
      !CHANNELS.includes(
        requestedChannel as (typeof CHANNELS)[number]
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid channel. Use EMAIL, WHATSAPP or VOICE.",
        },
        { status: 400 }
      );
    }

    const channels = requestedChannel
      ? [requestedChannel as (typeof CHANNELS)[number]]
      : [...CHANNELS];

    const results = [];

    for (const channel of channels) {
      const recipient =
        channel === "EMAIL"
          ? "provider-test@example.invalid"
          : channel === "WHATSAPP"
            ? "+919999999999"
            : "+919999999999";

      const result =
        await dispatchCampaignMessage({
          channel,
          recipient,
          message:
            "ThomasG Technologies provider sandbox test.",
          subject:
            channel === "EMAIL"
              ? "Provider Sandbox Test"
              : null,
        });

      results.push({
        channel,
        ...result,
      });
    }

    return NextResponse.json({
      success: true,
      mode: getCampaignProviderMode(),
      results,
    });
  } catch (error) {
    console.error(
      "Provider sandbox test failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Provider sandbox test failed.",
      },
      { status: 500 }
    );
  }
}

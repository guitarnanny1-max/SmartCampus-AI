import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

function getTextMessage(message: any): string | null {
  if (message?.type !== "text") {
    return null;
  }

  const text = message?.text?.body;

  return typeof text === "string" && text.trim()
    ? text.trim()
    : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken =
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN?.trim();

  if (
    mode === "subscribe" &&
    expectedToken &&
    token === expectedToken &&
    challenge
  ) {
    return new NextResponse(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.json(
    { error: "Webhook verification failed" },
    { status: 403 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(
      "[WhatsApp Webhook]",
      JSON.stringify(body)
    );

    if (body?.object !== "whatsapp_business_account") {
      return NextResponse.json({ success: true });
    }

    let processed = 0;
    let unmatched = 0;
    let duplicates = 0;

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change?.field !== "messages") {
          continue;
        }

        const value = change?.value;

        if (!value?.messages) {
          continue;
        }

        for (const message of value.messages) {
          const externalId =
            typeof message?.id === "string"
              ? message.id
              : null;

          const sender =
            typeof message?.from === "string"
              ? message.from
              : null;

          const messageText = getTextMessage(message);

          if (!externalId || !sender) {
            continue;
          }

          // Prevent duplicate processing when Meta retries a webhook.
          const existing = await prisma.communicationLog.findFirst({
            where: {
              externalId,
              provider: "META_CLOUD_API",
            },
            select: {
              id: true,
            },
          });

          if (existing) {
            duplicates++;
            continue;
          }

          const normalizedSender = normalizePhone(sender);

          if (!normalizedSender) {
            continue;
          }

          // Match the sender against WhatsApp number first,
          // then the general mobile field.
          const leads = await prisma.platform_crm_leads.findMany({
            where: {
              OR: [
                {
                  whatsappNumber: {
                    not: null,
                  },
                },
                {
                  mobile: {
                    not: null,
                  },
                },
              ],
            },
            select: {
              id: true,
              whatsappNumber: true,
              mobile: true,
              optedOut: true,
            },
          });

          const lead = leads.find((candidate) => {
            const whatsapp =
              normalizePhone(candidate.whatsappNumber);

            const mobile =
              normalizePhone(candidate.mobile);

            return (
              whatsapp === normalizedSender ||
              mobile === normalizedSender
            );
          });

          if (!lead) {
            unmatched++;
            console.log(
              "[WhatsApp Webhook] No CRM lead matched",
              normalizedSender
            );
            continue;
          }

          if (lead.optedOut) {
            unmatched++;
            console.log(
              "[WhatsApp Webhook] Matched lead is opted out",
              lead.id
            );
            continue;
          }

          const timestamp =
            Number(message?.timestamp);

          const attemptedAt =
            Number.isFinite(timestamp) && timestamp > 0
              ? new Date(timestamp * 1000)
              : new Date();

          await prisma.communicationLog.create({
            data: {
              leadId: lead.id,
              campaignId: null,
              campaignStepId: null,
              campaignLeadId: null,
              channel: "WHATSAPP",
              direction: "INBOUND",
              status: "RECEIVED",
              recipient: normalizedSender,
              message: messageText,
              provider: "META_CLOUD_API",
              externalId,
              attemptedAt,
            },
          });

          processed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      unmatched,
      duplicates,
    });
  } catch (error) {
    console.error(
      "[WhatsApp Webhook] Processing error",
      error
    );

    // Meta expects a successful webhook response when the
    // payload has been received. Errors are logged server-side.
    return NextResponse.json({
      success: true,
      error: "Webhook received but processing failed",
    });
  }
}

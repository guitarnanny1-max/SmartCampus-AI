import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Channel = "EMAIL" | "WHATSAPP" | "VOICE";

type RequestBody = {
  channel?: Channel;
  purpose?: string;
  audience?: string;
  tone?: string;
  language?: string;
  keyPoints?: string;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

export async function POST(request: Request) {
  try {
    await requirePlatformAdmin();

    const body = (await request.json().catch(() => ({}))) as RequestBody;

    const channel = body.channel;

    if (
      channel !== "EMAIL" &&
      channel !== "WHATSAPP" &&
      channel !== "VOICE"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid channel is required.",
        },
        { status: 400 }
      );
    }

    const purpose = clean(body.purpose, 500);
    const audience = clean(body.audience, 300);
    const tone = clean(body.tone, 300);
    const language = clean(body.language, 100) || "English";
    const keyPoints = clean(body.keyPoints, 2000);

    if (!purpose) {
      return NextResponse.json(
        {
          success: false,
          error: "Purpose is required.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const model =
      process.env.GEMINI_MODEL?.trim() ||
      "gemini-3.8-flash";

    const fallbackModel =
      process.env.GEMINI_FALLBACK_MODEL?.trim() ||
      "gemini-3.7-flash";

    const channelInstructions =
      channel === "WHATSAPP"
        ? `
Create a concise WhatsApp message.
Keep it conversational and easy to read on a phone.
Do not use a subject line.
Avoid excessive emojis.
`
        : channel === "EMAIL"
          ? `
Create a professional email.
Return both a short subject and the email body.
Do not include markdown headings.
`
          : `
Create a natural professional voice-call script.
Make it easy for a human salesperson to speak aloud.
Include a concise opening, value proposition, and call to action.
`;

    const prompt = `
You are the CRM communication writer for SmartCampusAI,
a school management SaaS product by ThomasG Technologies.

Write a professional outbound communication draft.

CHANNEL:
${channel}

PURPOSE:
${purpose}

AUDIENCE:
${audience || "School decision maker"}

TONE:
${tone || "Professional, friendly and concise"}

LANGUAGE:
${language}

KEY POINTS:
${keyPoints || "Introduce SmartCampusAI and invite the school to a product demonstration."}

IMPORTANT:
- This is a DRAFT for a human to review.
- Do not claim certifications, compliance, customers, statistics,
  guarantees, or features that were not provided.
- Do not invent names, prices, results, testimonials, or credentials.
- Use these CRM variables where personalization is useful:
  {{contact_name}}
  {{campus_name}}
  {{contact_role}}
  {{city}}
  {{state}}
- Keep the variables exactly as written.
- Do not send the message.
${channelInstructions}

Return ONLY valid JSON in this exact structure:

{
  "subject": "string",
  "message": "string"
}
`;

    async function callGemini(selectedModel: string) {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            model: selectedModel,
            input: prompt,
            generation_config: {
              thinking_level: "low",
            },
          }),
        }
      );

      const data = await response.json();

      return {
        response,
        data,
      };
    }

    let activeModel = model;

    let result = await callGemini(activeModel);

    if (
      !result.response.ok &&
      (result.response.status === 429 ||
        result.response.status === 503)
    ) {
      console.warn(
        `Gemini ${activeModel} unavailable (${result.response.status}); trying fallback ${fallbackModel}.`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      activeModel = fallbackModel;
      result = await callGemini(activeModel);
    }

    const data = result.data;

    if (!result.response.ok) {
      console.error(
        "Gemini message writer error:",
        data
      );

      const providerMessage =
        typeof data?.error?.message === "string"
          ? data.error.message
          : "AI message generation failed.";

      return NextResponse.json(
        {
          success: false,
          error: providerMessage,
        },
        { status: 502 }
      );
    }

    const generatedText =
      typeof data?.output_text === "string"
        ? data.output_text
        : Array.isArray(data?.steps)
          ? data.steps
              .flatMap((step: any) =>
                Array.isArray(step?.content)
                  ? step.content
                  : []
              )
              .map((item: any) => item?.text)
              .filter(
                (value: unknown): value is string =>
                  typeof value === "string"
              )
              .join("\n")
          : "";

    if (
      typeof generatedText !== "string" ||
      !generatedText.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "AI returned an empty message.",
        },
        { status: 502 }
      );
    }

    let generated: {
      subject?: unknown;
      message?: unknown;
    };

    try {
      generated = JSON.parse(generatedText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI returned an invalid message format.",
        },
        { status: 502 }
      );
    }

    const subject =
      typeof generated.subject === "string"
        ? generated.subject.trim()
        : "";

    const message =
      typeof generated.message === "string"
        ? generated.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "AI did not generate a usable message.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      channel,
      subject,
      message,
      model: activeModel,
    });
  } catch (error) {
    console.error(
      "AI message writer failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "AI message writer failed.",
      },
      { status: 500 }
    );
  }
}

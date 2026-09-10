import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/whatsapp/sendLeadNotification";
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

function parseStudentCount(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const digits = String(value).replace(/[^0-9]/g, "");

  if (!digits) return null;

  const parsed = Number(digits);

  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const fullName =
      cleanString(body.fullName) ||
      cleanString(body.name);

    const schoolName =
      cleanString(body.schoolName) ||
      cleanString(body.college) ||
      cleanString(body.institution);

    const email = cleanString(body.email);

    const phone =
      cleanString(body.phone) ||
      cleanString(body.mobile);

    const requirements =
      cleanString(body.requirements) ||
      cleanString(body.message);

    const studentCount =
      cleanString(body.studentCount) ||
      cleanString(body.student_count);

    const source =
      cleanString(body.source) ||
      "website_demo_form";

    if (!fullName || !schoolName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Name, school name, email, and phone are required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const parsedStudentCount =
      parseStudentCount(studentCount);

    const notes = [
      requirements
        ? `Requirements: ${requirements}`
        : null,
      studentCount
        ? `Student range: ${studentCount}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await supabase
      .from("crm_leads")
      .insert({
        school_name: schoolName,
        contact_name: fullName,
        contact_email: email,
        contact_phone: phone,
        source,
        lead_source: source,
        lead_status: "NEW",
        status: "NEW",
        priority: "MEDIUM",
        notes: notes || null,
        student_count: parsedStudentCount,
      })
      .select(
        `
          id,
          school_name,
          contact_name,
          contact_email,
          contact_phone,
          lead_status,
          status,
          priority,
          created_at
        `,
      )
      .single();

    if (error) {
      console.error("========== CRM SUPABASE ERROR ==========");
      console.error("code:", error.code);
      console.error("message:", error.message);
      console.error("details:", error.details);
      console.error("hint:", error.hint);
      console.error("========================================");

      return NextResponse.json(
        {
          error: "Unable to create lead.",
          details: error.message,
          code: error.code,
          hint: error.hint,
          supabaseDetails: error.details,
        },
        { status: 500 },
      );
    }

    const whatsappResult = await sendLeadNotification({
      schoolName: data.school_name,
      contactName: data.contact_name,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      studentCount: parsedStudentCount,
      source,
      message: requirements,
    });

    if (!whatsappResult.success && !whatsappResult.skipped) {
      console.error(
        "[CRM] Lead created, but WhatsApp notification failed:",
        whatsappResult.error,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully.",
        lead: data,
        whatsapp: {
          sent: whatsappResult.success,
          skipped: whatsappResult.skipped ?? false,
          messageId: whatsappResult.messageId ?? null,
          error: whatsappResult.error ?? null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("========== CRM API ERROR ==========");
    console.error(error);
    console.error("===================================");

    return NextResponse.json(
      {
        error: "Unable to create lead.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 },
    );
  }
}

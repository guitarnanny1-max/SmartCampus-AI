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

function cleanDate(value: unknown): string | null {
  const valueString = cleanString(value);

  if (!valueString) return null;

  const date = new Date(valueString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return valueString;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const tenantId = cleanString(searchParams.get("tenantId"));
    const leadId = cleanString(searchParams.get("leadId"));
    const status = cleanString(searchParams.get("status"));

    let query = supabase
      .from("AdmissionEnquiry")
      .select(
        `
          id,
          leadId,
          tenantId,
          studentName,
          parentName,
          parentEmail,
          parentPhone,
          dateOfBirth,
          gender,
          gradeApplyingFor,
          academicYear,
          source,
          status,
          notes,
          createdAt,
          updatedAt
        `,
      )
      .order("createdAt", { ascending: false });

    if (tenantId) {
      query = query.eq("tenantId", tenantId);
    }

    if (leadId) {
      query = query.eq("leadId", leadId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admission enquiry list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load admission enquiries.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      enquiries: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Admission enquiry GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load admission enquiries.",
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!body) {
      return NextResponse.json(
        {
          error: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const leadId = cleanString(body.leadId);
    const tenantId = cleanString(body.tenantId);

    const studentName = cleanString(body.studentName);

    const parentName = cleanString(body.parentName);
    const parentEmail = cleanString(body.parentEmail);
    const parentPhone = cleanString(body.parentPhone);

    const dateOfBirth = cleanDate(body.dateOfBirth);
    const gender = cleanString(body.gender);

    const gradeApplyingFor = cleanString(body.gradeApplyingFor);
    const academicYear = cleanString(body.academicYear);

    const source =
      cleanString(body.source) || (leadId ? "CRM" : "WEBSITE");

    const notes = cleanString(body.notes);

    if (!studentName) {
      return NextResponse.json(
        {
          error: "Student name is required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    /*
     * If this enquiry originated from a CRM lead,
     * verify that the lead exists.
     */
    if (leadId) {
      const { data: lead, error: leadError } = await supabase
        .from("crm_leads")
        .select("id")
        .eq("id", leadId)
        .maybeSingle();

      if (leadError) {
        console.error("CRM lead verification error:", leadError);

        return NextResponse.json(
          {
            error: "Unable to verify CRM lead.",
            details:
              process.env.NODE_ENV === "development"
                ? leadError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      if (!lead) {
        return NextResponse.json(
          {
            error: "CRM lead not found.",
          },
          { status: 404 },
        );
      }
    }

    const { data: enquiry, error } = await supabase
      .from("AdmissionEnquiry")
      .insert({
        leadId,
        tenantId,
        studentName,
        parentName,
        parentEmail,
        parentPhone,
        dateOfBirth,
        gender,
        gradeApplyingFor,
        academicYear,
        source,
        status: "NEW",
        notes,
      })
      .select(
        `
          id,
          leadId,
          tenantId,
          studentName,
          parentName,
          parentEmail,
          parentPhone,
          dateOfBirth,
          gender,
          gradeApplyingFor,
          academicYear,
          source,
          status,
          notes,
          createdAt,
          updatedAt
        `,
      )
      .single();

    if (error) {
      console.error("Admission enquiry creation error:", error);

      return NextResponse.json(
        {
          error: "Unable to create admission enquiry.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admission enquiry created successfully.",
        enquiry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admission enquiry POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create admission enquiry.",
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

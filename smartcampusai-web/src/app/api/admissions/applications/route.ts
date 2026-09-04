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

function createApplicationId() {
  return `application_${crypto.randomUUID()}`;
}

function createApplicationNumber() {
  const year = new Date().getFullYear();
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

  return `APP-${year}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const tenantId = cleanString(searchParams.get("tenantId"));
    const applicantId = cleanString(searchParams.get("applicantId"));
    const status = cleanString(searchParams.get("status"));
    const academicYear = cleanString(searchParams.get("academicYear"));

    let query = supabase
      .from("Application")
      .select(`
        id,
        applicantId,
        tenantId,
        applicationNumber,
        academicYear,
        gradeApplyingFor,
        status,
        submittedAt,
        notes,
        createdAt,
        updatedAt
      `)
      .order("createdAt", { ascending: false });

    if (tenantId) {
      query = query.eq("tenantId", tenantId);
    }

    if (applicantId) {
      query = query.eq("applicantId", applicantId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (academicYear) {
      query = query.eq("academicYear", academicYear);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Application list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load applications.",
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
      applications: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Application GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load applications.",
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

    const applicantId = cleanString(body.applicantId);
    const tenantId = cleanString(body.tenantId);
    const academicYear = cleanString(body.academicYear);
    const gradeApplyingFor = cleanString(body.gradeApplyingFor);
    const notes = cleanString(body.notes);

    if (!applicantId) {
      return NextResponse.json(
        {
          error: "Applicant ID is required.",
        },
        { status: 400 },
      );
    }

    if (!academicYear) {
      return NextResponse.json(
        {
          error: "Academic year is required.",
        },
        { status: 400 },
      );
    }

    if (!gradeApplyingFor) {
      return NextResponse.json(
        {
          error: "Grade applying for is required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    /*
     * 1. Verify applicant exists.
     */
    const { data: applicant, error: applicantError } = await supabase
      .from("Applicant")
      .select(`
        id,
        enquiryId,
        tenantId,
        firstName,
        middleName,
        lastName,
        status
      `)
      .eq("id", applicantId)
      .maybeSingle();

    if (applicantError) {
      console.error("Applicant verification error:", applicantError);

      return NextResponse.json(
        {
          error: "Unable to verify applicant.",
          details:
            process.env.NODE_ENV === "development"
              ? applicantError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!applicant) {
      return NextResponse.json(
        {
          error: "Applicant not found.",
        },
        { status: 404 },
      );
    }

    /*
     * 2. Use applicant tenant when tenantId was not supplied.
     */
    const resolvedTenantId = tenantId || applicant.tenantId || null;

    /*
     * 3. Prevent duplicate applications for the
     *    same applicant and academic year.
     */
    let duplicateQuery = supabase
      .from("Application")
      .select(`
        id,
        applicantId,
        applicationNumber,
        academicYear,
        gradeApplyingFor,
        status
      `)
      .eq("applicantId", applicantId)
      .eq("academicYear", academicYear);

    const { data: existingApplication, error: duplicateError } =
      await duplicateQuery.maybeSingle();

    if (duplicateError) {
      console.error(
        "Application duplicate check error:",
        duplicateError,
      );

      return NextResponse.json(
        {
          error: "Unable to check existing application.",
          details:
            process.env.NODE_ENV === "development"
              ? duplicateError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (existingApplication) {
      return NextResponse.json(
        {
          error: "An application already exists for this applicant and academic year.",
          application: existingApplication,
        },
        { status: 409 },
      );
    }

    /*
     * 4. Create application.
     */
    const applicationId = createApplicationId();
    const applicationNumber = createApplicationNumber();

    const { data: application, error: applicationError } = await supabase
      .from("Application")
      .insert({
        id: applicationId,
        applicantId,
        tenantId: resolvedTenantId,
        applicationNumber,
        academicYear,
        gradeApplyingFor,
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
        notes,
      })
      .select(`
        id,
        applicantId,
        tenantId,
        applicationNumber,
        academicYear,
        gradeApplyingFor,
        status,
        submittedAt,
        notes,
        createdAt,
        updatedAt
      `)
      .single();

    if (applicationError) {
      console.error(
        "Application creation error:",
        applicationError,
      );

      return NextResponse.json(
        {
          error: "Unable to create application.",
          details:
            process.env.NODE_ENV === "development"
              ? applicationError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 5. Move applicant into application stage.
     */
    const { error: applicantUpdateError } = await supabase
      .from("Applicant")
      .update({
        status: "APPLICATION_SUBMITTED",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", applicantId);

    if (applicantUpdateError) {
      console.error(
        "Applicant status update error:",
        applicantUpdateError,
      );
    }

    /*
     * 6. Update originating enquiry when available.
     */
    if (applicant.enquiryId) {
      const { error: enquiryUpdateError } = await supabase
        .from("AdmissionEnquiry")
        .update({
          status: "APPLICATION_SUBMITTED",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", applicant.enquiryId);

      if (enquiryUpdateError) {
        console.error(
          "Admission enquiry status update error:",
          enquiryUpdateError,
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application created successfully.",
        application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Application POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create application.",
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

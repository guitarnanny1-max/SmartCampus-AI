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

function createApplicantId() {
  return `applicant_${crypto.randomUUID()}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);

    const tenantId = cleanString(searchParams.get("tenantId"));
    const enquiryId = cleanString(searchParams.get("enquiryId"));
    const status = cleanString(searchParams.get("status"));

    let query = supabase
      .from("Applicant")
      .select(`
        id,
        enquiryId,
        tenantId,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        parentName,
        parentEmail,
        parentPhone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        status,
        createdAt,
        updatedAt
      `)
      .order("createdAt", { ascending: false });

    if (tenantId) {
      query = query.eq("tenantId", tenantId);
    }

    if (enquiryId) {
      query = query.eq("enquiryId", enquiryId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Applicant list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load applicants.",
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
      applicants: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Applicant GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load applicants.",
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

    const enquiryId = cleanString(body.enquiryId);
    const requestedTenantId = cleanString(body.tenantId);

    const firstName = cleanString(body.firstName);
    const middleName = cleanString(body.middleName);
    const lastName = cleanString(body.lastName);

    const dateOfBirth = cleanString(body.dateOfBirth);
    const gender = cleanString(body.gender);

    const parentName = cleanString(body.parentName);
    const parentEmail = cleanString(body.parentEmail);
    const parentPhone = cleanString(body.parentPhone);

    const addressLine1 = cleanString(body.addressLine1);
    const addressLine2 = cleanString(body.addressLine2);

    const city = cleanString(body.city);
    const state = cleanString(body.state);
    const country = cleanString(body.country) || "India";
    const postalCode = cleanString(body.postalCode);

    if (!firstName) {
      return NextResponse.json(
        {
          error: "Applicant first name is required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    /*
     * ---------------------------------------------------------
     * 1. VERIFY ORIGINATING ENQUIRY
     * ---------------------------------------------------------
     *
     * If this applicant came from an admission enquiry,
     * use the enquiry as the authoritative tenant source.
     */
    let enquiryTenantId: string | null = null;

    if (enquiryId) {
      const { data: enquiry, error: enquiryError } = await supabase
        .from("AdmissionEnquiry")
        .select(`
          id,
          tenantId,
          studentName,
          parentName,
          parentEmail,
          parentPhone,
          dateOfBirth,
          gender
        `)
        .eq("id", enquiryId)
        .maybeSingle();

      if (enquiryError) {
        console.error(
          "Admission enquiry verification error:",
          enquiryError,
        );

        return NextResponse.json(
          {
            error: "Unable to verify admission enquiry.",
            details:
              process.env.NODE_ENV === "development"
                ? enquiryError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      if (!enquiry) {
        return NextResponse.json(
          {
            error: "Admission enquiry not found.",
          },
          { status: 404 },
        );
      }

      enquiryTenantId = cleanString(enquiry.tenantId);
    }

    /*
     * ---------------------------------------------------------
     * 2. RESOLVE TENANT
     * ---------------------------------------------------------
     *
     * Priority:
     *
     * Explicit tenantId
     *        ↓
     * AdmissionEnquiry.tenantId
     *        ↓
     * null
     *
     * This prevents the tenant identity from being lost
     * during the admissions pipeline.
     */
    const resolvedTenantId =
      requestedTenantId || enquiryTenantId || null;

    /*
     * ---------------------------------------------------------
     * 3. PREVENT DUPLICATE APPLICANTS
     * ---------------------------------------------------------
     */
    if (enquiryId) {
      const { data: existingApplicant, error: duplicateError } =
        await supabase
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
          .eq("enquiryId", enquiryId)
          .maybeSingle();

      if (duplicateError) {
        console.error(
          "Applicant duplicate check error:",
          duplicateError,
        );

        return NextResponse.json(
          {
            error: "Unable to check existing applicant.",
            details:
              process.env.NODE_ENV === "development"
                ? duplicateError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      if (existingApplicant) {
        return NextResponse.json(
          {
            error: "An applicant already exists for this enquiry.",
            applicant: existingApplicant,
          },
          { status: 409 },
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * 4. CREATE APPLICANT
     * ---------------------------------------------------------
     */
    const applicantId = createApplicantId();

    const { data: applicant, error } = await supabase
      .from("Applicant")
      .insert({
        id: applicantId,
        enquiryId,

        /*
         * IMPORTANT:
         * Store the resolved tenant instead of only the
         * tenant supplied by the frontend.
         */
        tenantId: resolvedTenantId,

        firstName,
        middleName,
        lastName,

        dateOfBirth,
        gender,

        parentName,
        parentEmail,
        parentPhone,

        addressLine1,
        addressLine2,

        city,
        state,
        country,
        postalCode,

        status: "ACTIVE",
      })
      .select(`
        id,
        enquiryId,
        tenantId,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        parentName,
        parentEmail,
        parentPhone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        status,
        createdAt,
        updatedAt
      `)
      .single();

    if (error) {
      console.error("Applicant creation error:", error);

      return NextResponse.json(
        {
          error: "Unable to create applicant.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ---------------------------------------------------------
     * 5. UPDATE ENQUIRY STATUS
     * ---------------------------------------------------------
     */
    if (enquiryId) {
      const { error: enquiryUpdateError } = await supabase
        .from("AdmissionEnquiry")
        .update({
          status: "APPLICANT_CREATED",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", enquiryId);

      if (enquiryUpdateError) {
        console.error(
          "Admission enquiry status update error:",
          enquiryUpdateError,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * 6. RETURN CREATED APPLICANT
     * ---------------------------------------------------------
     */
    return NextResponse.json(
      {
        success: true,
        message: "Applicant created successfully.",
        applicant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Applicant POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create applicant.",
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

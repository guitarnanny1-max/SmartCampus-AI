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

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

const VALID_DECISIONS = [
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
] as const;

type AdmissionDecisionType = (typeof VALID_DECISIONS)[number];

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);

    const applicationId = cleanString(
      searchParams.get("applicationId"),
    );

    const decision = cleanString(searchParams.get("decision"));

    let query = supabase
      .from("AdmissionDecision")
      .select(
        `
          id,
          applicationId,
          decision,
          decidedAt,
          decidedBy,
          reason,
          createdAt
        `,
      )
      .order("createdAt", { ascending: false });

    if (applicationId) {
      query = query.eq("applicationId", applicationId);
    }

    if (decision) {
      query = query.eq("decision", decision);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admission decision list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load admission decisions.",
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
      decisions: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Admission decision GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load admission decisions.",
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

    const applicationId = cleanString(body.applicationId);
    const decisionValue = cleanString(body.decision)?.toUpperCase();
    const decidedBy = cleanString(body.decidedBy);
    const reason = cleanString(body.reason);

    if (!applicationId) {
      return NextResponse.json(
        {
          error: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      !decisionValue ||
      !VALID_DECISIONS.includes(
        decisionValue as AdmissionDecisionType,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid admission decision. Use ACCEPTED, REJECTED, or WAITLISTED.",
        },
        { status: 400 },
      );
    }

    const decision =
      decisionValue as AdmissionDecisionType;

    const supabase = getSupabaseAdmin();

    /*
     * 1. LOAD APPLICATION
     */
    const { data: application, error: applicationError } =
      await supabase
        .from("Application")
        .select(
          `
            id,
            applicantId,
            tenantId,
            applicationNumber,
            academicYear,
            gradeApplyingFor,
            status,
            notes
          `,
        )
        .eq("id", applicationId)
        .maybeSingle();

    if (applicationError) {
      console.error(
        "Application lookup error:",
        applicationError,
      );

      return NextResponse.json(
        {
          error: "Unable to load application.",
          details:
            process.env.NODE_ENV === "development"
              ? applicationError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!application) {
      return NextResponse.json(
        {
          error: "Application not found.",
        },
        { status: 404 },
      );
    }

    /*
     * 2. LOAD APPLICANT
     */
    const { data: applicant, error: applicantError } =
      await supabase
        .from("Applicant")
        .select(
          `
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
            status
          `,
        )
        .eq("id", application.applicantId)
        .maybeSingle();

    if (applicantError) {
      console.error(
        "Applicant lookup error:",
        applicantError,
      );

      return NextResponse.json(
        {
          error: "Unable to load applicant.",
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
     * 3. PREVENT DUPLICATE DECISIONS
     */
    const { data: existingDecision } = await supabase
      .from("AdmissionDecision")
      .select(
        `
          id,
          applicationId,
          decision,
          decidedAt,
          decidedBy,
          reason,
          createdAt
        `,
      )
      .eq("applicationId", applicationId)
      .maybeSingle();

    if (existingDecision) {
      return NextResponse.json(
        {
          error: "A decision already exists for this application.",
          decision: existingDecision,
        },
        { status: 409 },
      );
    }

    /*
     * 4. CREATE ADMISSION DECISION
     */
    const decisionId = createId("decision");

    const { data: admissionDecision, error: decisionError } =
      await supabase
        .from("AdmissionDecision")
        .insert({
          id: decisionId,
          applicationId,
          decision,
          decidedAt: new Date().toISOString(),
          decidedBy,
          reason,
        })
        .select(
          `
            id,
            applicationId,
            decision,
            decidedAt,
            decidedBy,
            reason,
            createdAt
          `,
        )
        .single();

    if (decisionError) {
      console.error(
        "Admission decision creation error:",
        decisionError,
      );

      return NextResponse.json(
        {
          error: "Unable to create admission decision.",
          details:
            process.env.NODE_ENV === "development"
              ? decisionError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 5. UPDATE APPLICATION STATUS
     */
    let applicationStatus = "UNDER_REVIEW";

    if (decision === "ACCEPTED") {
      applicationStatus = "ACCEPTED";
    } else if (decision === "REJECTED") {
      applicationStatus = "REJECTED";
    } else if (decision === "WAITLISTED") {
      applicationStatus = "WAITLISTED";
    }

    const { data: updatedApplication, error: updateError } =
      await supabase
        .from("Application")
        .update({
          status: applicationStatus,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .select(
          `
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
          `,
        )
        .single();

    if (updateError) {
      console.error(
        "Application status update error:",
        updateError,
      );

      return NextResponse.json(
        {
          error:
            "Decision was created, but application status could not be updated.",
          decision: admissionDecision,
          details:
            process.env.NODE_ENV === "development"
              ? updateError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 6. ACCEPTED APPLICATION → CREATE STUDENT
     *
     * This completes:
     *
     * Decision → Enrolled Student
     */
    let student = null;

    if (decision === "ACCEPTED") {
      const studentName = [
        applicant.firstName,
        applicant.middleName,
        applicant.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      if (!studentName) {
        return NextResponse.json(
          {
            error:
              "Application accepted, but applicant does not have a valid name.",
            decision: admissionDecision,
            application: updatedApplication,
          },
          { status: 500 },
        );
      }

      const tenantId =
        application.tenantId || applicant.tenantId;

      if (!tenantId) {
        return NextResponse.json(
          {
            error:
              "Application accepted, but no tenant ID is available for student enrollment.",
            decision: admissionDecision,
            application: updatedApplication,
          },
          { status: 500 },
        );
      }

      /*
       * Check for an existing student with the same
       * name and parent email inside this tenant.
       */
      const { data: existingStudent } = await supabase
        .from("Student")
        .select(
          `
            id,
            tenantId,
            name,
            rollNumber,
            grade,
            parentEmail,
            status,
            createdAt
          `,
        )
        .eq("tenantId", tenantId)
        .eq("name", studentName)
        .eq(
          "parentEmail",
          applicant.parentEmail || "",
        )
        .maybeSingle();

      if (existingStudent) {
        student = existingStudent;
      } else {
        const studentId = createId("student");

        const { data: createdStudent, error: studentError } =
          await supabase
            .from("Student")
            .insert({
              id: studentId,
              tenantId,
              name: studentName,
              rollNumber: "",
              grade: application.gradeApplyingFor || "",
              parentEmail: applicant.parentEmail || "",
              status: "ACTIVE",
            })
            .select(
              `
                id,
                tenantId,
                name,
                rollNumber,
                grade,
                parentEmail,
                status,
                createdAt
              `,
            )
            .single();

        if (studentError) {
          console.error(
            "Student enrollment error:",
            studentError,
          );

          return NextResponse.json(
            {
              error:
                "Admission accepted, but enrolled student could not be created.",
              decision: admissionDecision,
              application: updatedApplication,
              details:
                process.env.NODE_ENV === "development"
                  ? studentError.message
                  : undefined,
            },
            { status: 500 },
          );
        }

        student = createdStudent;
      }

      /*
       * 6B. ADMISSIONS → STUDENT 360 FOUNDATION
       *
       * Populate the new Student 360 profile and primary guardian
       * from the accepted Applicant without overwriting existing
       * Student 360 data that may have been entered manually.
       */

      const profileId = createId("profile");

      const { data: existingProfile, error: profileLookupError } =
        await supabase
          .from("student_profiles")
          .select("id")
          .eq("tenantId", tenantId)
          .eq("student_id", student.id)
          .maybeSingle();

      if (profileLookupError) {
        console.error(
          "Student 360 profile lookup error:",
          profileLookupError,
        );
      }

      if (!existingProfile) {
        const profileNameParts = {
          first_name: applicant.firstName || student.name || null,
          middle_name: applicant.middleName || null,
          last_name: applicant.lastName || null,
        };

        const { error: profileInsertError } = await supabase
          .from("student_profiles")
          .insert({
            id: profileId,
            tenantId,
            student_id: student.id,
            ...profileNameParts,
            date_of_birth: applicant.dateOfBirth || null,
            gender: applicant.gender || null,
            address_line1: applicant.addressLine1 || null,
            address_line2: applicant.addressLine2 || null,
            city: applicant.city || null,
            state: applicant.state || null,
            country: applicant.country || "India",
            postal_code: applicant.postalCode || null,
          });

        if (profileInsertError) {
          console.error(
            "Student 360 profile creation error:",
            profileInsertError,
          );

          return NextResponse.json(
            {
              error:
                "Student was created, but Student 360 profile could not be created.",
              decision: admissionDecision,
              application: updatedApplication,
              details:
                process.env.NODE_ENV === "development"
                  ? profileInsertError.message
                  : undefined,
            },
            { status: 500 },
          );
        }
      }

      /*
       * Create the primary guardian only when the accepted Applicant
       * has guardian/parent information and no primary guardian exists.
       */
      const { data: existingPrimaryGuardian, error: guardianLookupError } =
        await supabase
          .from("student_guardians")
          .select("id")
          .eq("tenantId", tenantId)
          .eq("student_id", student.id)
          .eq("is_primary", true)
          .maybeSingle();

      if (guardianLookupError) {
        console.error(
          "Student 360 guardian lookup error:",
          guardianLookupError,
        );
      }

      const guardianName = applicant.parentName?.trim() || null;
      const guardianEmail = applicant.parentEmail?.trim() || null;
      const guardianPhone = applicant.parentPhone?.trim() || null;

      if (
        !existingPrimaryGuardian &&
        (guardianName || guardianEmail || guardianPhone)
      ) {
        const { error: guardianInsertError } = await supabase
          .from("student_guardians")
          .insert({
            id: createId("guardian"),
            tenantId,
            student_id: student.id,
            name: guardianName || "Parent / Guardian",
            relationship: "Parent",
            email: guardianEmail,
            phone: guardianPhone,
            is_primary: true,
            is_emergency_contact: false,
          });

        if (guardianInsertError) {
          console.error(
            "Student 360 guardian creation error:",
            guardianInsertError,
          );

          return NextResponse.json(
            {
              error:
                "Student was created, but primary guardian could not be created.",
              decision: admissionDecision,
              application: updatedApplication,
              details:
                process.env.NODE_ENV === "development"
                  ? guardianInsertError.message
                  : undefined,
            },
            { status: 500 },
          );
        }
      }

      /*
       * Mark application as ENROLLED after student creation.
       */
      const { data: enrolledApplication, error: enrolledError } =
        await supabase
          .from("Application")
          .update({
            status: "ENROLLED",
            updatedAt: new Date().toISOString(),
          })
          .eq("id", applicationId)
          .select(
            `
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
            `,
          )
          .single();

      if (enrolledError) {
        console.error(
          "Application enrollment status update error:",
          enrolledError,
        );

        return NextResponse.json(
          {
            error:
              "Student was created, but application could not be marked enrolled.",
            decision: admissionDecision,
            application: updatedApplication,
            student,
            details:
              process.env.NODE_ENV === "development"
                ? enrolledError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Admission accepted and applicant enrolled successfully.",
          decision: admissionDecision,
          application: enrolledApplication,
          student,
        },
        { status: 201 },
      );
    }

    /*
     * 7. REJECTED / WAITLISTED
     */
    return NextResponse.json(
      {
        success: true,
        message:
          decision === "REJECTED"
            ? "Admission application rejected successfully."
            : "Applicant added to the admission waitlist successfully.",
        decision: admissionDecision,
        application: updatedApplication,
        student: null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admission decision POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to process admission decision.",
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

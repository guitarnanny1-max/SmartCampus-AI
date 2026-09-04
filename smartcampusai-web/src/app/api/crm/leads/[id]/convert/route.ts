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

  const valueCleaned = value.trim();

  return valueCleaned || null;
}

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: leadId } = await params;

    if (!leadId) {
      return NextResponse.json(
        {
          error: "Lead ID is required.",
        },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const requestedPlan =
      cleanString(body.plan)?.toUpperCase() || "STARTER";

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    /*
     * ============================================================
     * 1. LOAD CRM LEAD
     * ============================================================
     */

    const { data: lead, error: leadError } = await supabase
      .from("crm_leads")
      .select(`
        id,
        school_name,
        contact_name,
        contact_email,
        contact_phone,
        lead_status,
        status,
        priority,
        student_count,
        source,
        lead_source,
        city,
        state,
        country,
        school_type,
        website,
        notes
      `)
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        {
          error: "CRM lead not found.",
        },
        { status: 404 },
      );
    }

    /*
     * ============================================================
     * 2. PREVENT DUPLICATE CONVERSION
     * ============================================================
     */

    const { data: existingSchool } = await supabase
      .from("School")
      .select("id, name, subdomain, plan")
      .eq("name", lead.school_name)
      .maybeSingle();

    if (existingSchool) {
      return NextResponse.json(
        {
          error: "This school already appears to be onboarded.",
          school: existingSchool,
        },
        { status: 409 },
      );
    }

    /*
     * ============================================================
     * 3. CREATE TENANT
     * ============================================================
     */

    const tenantId = createId("tenant");

    const subdomainBase = lead.school_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

    const subdomain = `${subdomainBase || "school"}-${tenantId
      .slice(-6)
      .toLowerCase()}`;

    const { data: tenant, error: tenantError } = await supabase
      .from("Tenant")
      .insert({
        id: tenantId,
        subdomain,
        name: lead.school_name,
        plan: requestedPlan,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (tenantError) {
      console.error("Tenant creation error:", tenantError);

      return NextResponse.json(
        {
          error: "Unable to create school tenant.",
          details:
            process.env.NODE_ENV === "development"
              ? tenantError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 4. CREATE SCHOOL
     * ============================================================
     */

    const schoolId = createId("school");

    const { data: school, error: schoolError } = await supabase
      .from("School")
      .insert({
        id: schoolId,
        name: lead.school_name,
        subdomain,
        plan: requestedPlan,
      })
      .select()
      .single();

    if (schoolError) {
      console.error("School creation error:", schoolError);

      await supabase.from("Tenant").delete().eq("id", tenantId);

      return NextResponse.json(
        {
          error: "Unable to create school.",
          details:
            process.env.NODE_ENV === "development"
              ? schoolError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 5. CREATE INITIAL ADMIN USER
     * ============================================================
     *
     * This creates the application-level User record.
     *
     * Authentication should later be connected to Supabase Auth.
     * Do not use this field as a real password.
     */

    const userId = createId("user");

    const { data: user, error: userError } = await supabase
      .from("User")
      .insert({
        id: userId,
        tenantId,
        email: lead.contact_email,
        name: lead.contact_name || "School Administrator",
        role: "SCHOOL_ADMIN",
        password: "PENDING_AUTH_SETUP",
      })
      .select(
        `
          id,
          tenantId,
          email,
          name,
          role,
          createdAt
        `,
      )
      .single();

    if (userError) {
      console.error("Admin user creation error:", userError);

      await supabase.from("School").delete().eq("id", schoolId);
      await supabase.from("Tenant").delete().eq("id", tenantId);

      return NextResponse.json(
        {
          error: "Unable to create school administrator.",
          details:
            process.env.NODE_ENV === "development"
              ? userError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 6. CONNECT ADMISSION ENQUIRIES TO THE NEW TENANT
     * ============================================================
     *
     * This is the critical tenant-chain fix.
     *
     * A CRM lead can already have an AdmissionEnquiry before
     * the school is converted/onboarded.
     *
     * Previously:
     *
     *   crm_leads
     *        ↓
     *   AdmissionEnquiry.tenantId = NULL
     *
     * Now:
     *
     *   crm_leads
     *        ↓
     *   tenantId
     *        ↓
     *   AdmissionEnquiry.tenantId
     */

    const { data: linkedEnquiries, error: enquiryLinkError } =
      await supabase
        .from("AdmissionEnquiry")
        .update({
          tenantId,
          updatedAt: new Date().toISOString(),
        })
        .eq("leadId", leadId)
        .is("tenantId", null)
        .select(`
          id,
          leadId,
          tenantId,
          studentName,
          status
        `);

    if (enquiryLinkError) {
      console.error(
        "Admission enquiry tenant linking error:",
        enquiryLinkError,
      );

      /*
       * Do not destroy the newly created school because the
       * tenant-linking operation failed. Return the onboarding
       * identifiers so the failure is visible to the caller.
       */

      return NextResponse.json(
        {
          error:
            "School was created, but admission enquiries could not be linked to the new tenant.",
          tenantId,
          schoolId,
          subdomain,
          adminUserId: user.id,
          details:
            process.env.NODE_ENV === "development"
              ? enquiryLinkError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 7. PROPAGATE TENANT TO APPLICANTS
     * ============================================================
     *
     * Existing applicants may have been created from those
     * enquiries before tenant onboarding.
     *
     * Link them to the same tenant.
     */

    let linkedApplicants: unknown[] = [];

    if (linkedEnquiries && linkedEnquiries.length > 0) {
      const enquiryIds = linkedEnquiries.map(
        (enquiry) => enquiry.id,
      );

      const { data: applicants, error: applicantLinkError } =
        await supabase
          .from("Applicant")
          .update({
            tenantId,
            updatedAt: new Date().toISOString(),
          })
          .in("enquiryId", enquiryIds)
          .is("tenantId", null)
          .select(`
            id,
            enquiryId,
            tenantId,
            firstName,
            lastName,
            status
          `);

      if (applicantLinkError) {
        console.error(
          "Applicant tenant linking error:",
          applicantLinkError,
        );

        return NextResponse.json(
          {
            error:
              "School and enquiry were created, but applicants could not be linked to the new tenant.",
            tenantId,
            schoolId,
            subdomain,
            details:
              process.env.NODE_ENV === "development"
                ? applicantLinkError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      linkedApplicants = applicants ?? [];
    }

    /*
     * ============================================================
     * 8. PROPAGATE TENANT TO APPLICATIONS
     * ============================================================
     *
     * Existing applications may have been created before the
     * tenant was established.
     *
     * Application → Applicant → Enquiry → Tenant
     *
     * We resolve applications through their applicant records.
     */

    let linkedApplications: unknown[] = [];

    if (linkedApplicants.length > 0) {
      const applicantIds = linkedApplicants
        .map((applicant) => {
          if (
            applicant &&
            typeof applicant === "object" &&
            "id" in applicant &&
            typeof applicant.id === "string"
          ) {
            return applicant.id;
          }

          return null;
        })
        .filter((id): id is string => Boolean(id));

      if (applicantIds.length > 0) {
        const { data: applications, error: applicationLinkError } =
          await supabase
            .from("Application")
            .update({
              tenantId,
              updatedAt: new Date().toISOString(),
            })
            .in("applicantId", applicantIds)
            .is("tenantId", null)
            .select(`
              id,
              applicantId,
              tenantId,
              applicationNumber,
              academicYear,
              gradeApplyingFor,
              status
            `);

        if (applicationLinkError) {
          console.error(
            "Application tenant linking error:",
            applicationLinkError,
          );

          return NextResponse.json(
            {
              error:
                "School, enquiries and applicants were linked, but applications could not be linked to the new tenant.",
              tenantId,
              schoolId,
              subdomain,
              details:
                process.env.NODE_ENV === "development"
                  ? applicationLinkError.message
                  : undefined,
            },
            { status: 500 },
          );
        }

        linkedApplications = applications ?? [];
      }
    }

    /*
     * ============================================================
     * 9. MARK CRM LEAD AS CONVERTED
     * ============================================================
     */

    const { data: updatedLead, error: updateLeadError } =
      await supabase
        .from("crm_leads")
        .update({
          status: "CONVERTED",
          lead_status: "CONVERTED",
          last_activity_at: new Date().toISOString(),
          notes: [
            lead.notes || "",
            `Converted to SmartCampusAI school tenant: ${tenantId}`,
            `School ID: ${schoolId}`,
          ]
            .filter(Boolean)
            .join("\n"),
        })
        .eq("id", leadId)
        .select()
        .single();

    if (updateLeadError) {
      console.error(
        "CRM lead conversion update error:",
        updateLeadError,
      );

      return NextResponse.json(
        {
          error:
            "School was created, but CRM lead could not be marked converted.",
          tenant,
          school,
          user,
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 10. RECORD CRM ACTIVITY
     * ============================================================
     */

    const { error: activityError } = await supabase
      .from("crm_lead_activities")
      .insert({
        lead_id: leadId,
        activity_type: "CONVERSION",
        title: "Lead converted to school",
        description: `Created tenant ${tenantId}, school ${schoolId}, initial administrator account, and linked ${linkedEnquiries?.length ?? 0} admission enquiry record(s).`,
      });

    if (activityError) {
      console.error(
        "CRM conversion activity error:",
        activityError,
      );
    }

    /*
     * ============================================================
     * 11. RETURN ONBOARDING INFORMATION
     * ============================================================
     */

    return NextResponse.json(
      {
        success: true,
        message: "CRM lead converted successfully.",

        onboarding: {
          status: "PENDING_PAYMENT_VERIFICATION",
          tenantId,
          schoolId,
          subdomain,
          plan: requestedPlan,
        },

        admin: {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },

        tenantChain: {
          crmLeadId: leadId,
          tenantId,
          schoolId,
          admissionEnquiriesLinked:
            linkedEnquiries?.length ?? 0,
          applicantsLinked: linkedApplicants.length,
          applicationsLinked: linkedApplications.length,
        },

        lead: updatedLead,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CRM conversion API error:", error);

    return NextResponse.json(
      {
        error: "Unable to convert CRM lead.",
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

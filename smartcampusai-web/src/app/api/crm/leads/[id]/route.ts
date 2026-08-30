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

const ALLOWED_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DEMO_SCHEDULED",
  "CONVERTED",
  "LOST",
] as const;

const ALLOWED_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

function isValidDateValue(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

function normalizeDateValue(value: unknown): string | null {
  if (value === null || value === "") {
    return null;
  }

  if (!isValidDateValue(value)) {
    throw new Error("Invalid date or time.");
  }

  return new Date(value).toISOString();
}


export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
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
        next_follow_up_at,
        demo_date,
        notes,
        created_at
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("CRM lead GET error:", error);

      if (error.code == "PGRST116") {
        return NextResponse.json(
          { error: "Lead not found." },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: "Unable to load lead.",
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
      lead: data,
    });
  } catch (error) {
    console.error("CRM lead GET exception:", error);

    return NextResponse.json(
      {
        error: "Unable to load lead.",
        details:
          process.env.NODE_ENV === "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 },
      );
    }

    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const updates: Record<string, string | null> = {};

    /*
     * STATUS
     */
    if (typeof body.status === "string") {
      const status = body.status.toUpperCase();

      if (
        !ALLOWED_STATUSES.includes(
          status as (typeof ALLOWED_STATUSES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error: "Invalid lead status.",
            allowed: ALLOWED_STATUSES,
          },
          { status: 400 },
        );
      }

      updates.status = status;
      updates.lead_status = status;
    }

    /*
     * PRIORITY
     */
    if (typeof body.priority === "string") {
      const priority = body.priority.toUpperCase();

      if (
        !ALLOWED_PRIORITIES.includes(
          priority as (typeof ALLOWED_PRIORITIES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error: "Invalid lead priority.",
            allowed: ALLOWED_PRIORITIES,
          },
          { status: 400 },
        );
      }

      updates.priority = priority;
    }

    /*
     * NEXT FOLLOW-UP
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "next_follow_up_at",
      )
    ) {
      try {
        updates.next_follow_up_at = normalizeDateValue(
          body.next_follow_up_at,
        );
      } catch {
        return NextResponse.json(
          {
            error: "Invalid next follow-up date/time.",
          },
          { status: 400 },
        );
      }
    }

    /*
     * DEMO DATE
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "demo_date",
      )
    ) {
      try {
        updates.demo_date = normalizeDateValue(
          body.demo_date,
        );
      } catch {
        return NextResponse.json(
          {
            error: "Invalid demo date/time.",
          },
          { status: 400 },
        );
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid fields supplied. Supported fields: status, priority, next_follow_up_at, demo_date.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    /*
     * FETCH EXISTING DATES
     *
     * Required so that changing only one date still respects
     * the relationship between follow-up and demo.
     */
    let existingNextFollowUp: string | null = null;
    let existingDemoDate: string | null = null;

    if (
      Object.prototype.hasOwnProperty.call(
        updates,
        "next_follow_up_at",
      ) ||
      Object.prototype.hasOwnProperty.call(
        updates,
        "demo_date",
      )
    ) {
      const { data: existingLead, error: existingLeadError } =
        await supabase
          .from("crm_leads")
          .select("next_follow_up_at, demo_date")
          .eq("id", id)
          .single();

      if (existingLeadError) {
        console.error(
          "CRM existing lead lookup error:",
          existingLeadError,
        );

        return NextResponse.json(
          {
            error: "Unable to load existing lead dates.",
            details:
              process.env.NODE_ENV === "development"
                ? existingLeadError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      existingNextFollowUp =
        existingLead?.next_follow_up_at ?? null;

      existingDemoDate =
        existingLead?.demo_date ?? null;
    }

    /*
     * CALCULATE FINAL DATES
     *
     * Use the incoming value when supplied.
     * Otherwise use the existing database value.
     */
    const finalNextFollowUp =
      Object.prototype.hasOwnProperty.call(
        updates,
        "next_follow_up_at",
      )
        ? updates.next_follow_up_at
        : existingNextFollowUp;

    const finalDemoDate =
      Object.prototype.hasOwnProperty.call(
        updates,
        "demo_date",
      )
        ? updates.demo_date
        : existingDemoDate;

    /*
     * DATE RELATIONSHIP VALIDATION
     *
     * Demo cannot occur before the next follow-up.
     */
    if (
      finalNextFollowUp &&
      finalDemoDate &&
      new Date(finalDemoDate).getTime() <
        new Date(finalNextFollowUp).getTime()
    ) {
      return NextResponse.json(
        {
          error:
            "Demo date/time must be on or after the next follow-up date/time.",
        },
        { status: 400 },
      );
    }

    /*
     * UPDATE LEAD
     */
    const { data, error } = await supabase
      .from("crm_leads")
      .update(updates)
      .eq("id", id)
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
          student_count,
          source,
          lead_source,
          city,
          state,
          next_follow_up_at,
          demo_date,
          notes,
          created_at
        `,
      )
      .single();

    if (error) {
      console.error("CRM lead update error:", error);

      return NextResponse.json(
        {
          error: "Unable to update lead.",
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
      message: "Lead updated successfully.",
      lead: data,
    });
  } catch (error) {
    console.error("CRM lead PATCH error:", error);

    return NextResponse.json(
      {
        error: "Unable to update lead.",
        details:
          process.env.NODE_ENV === "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

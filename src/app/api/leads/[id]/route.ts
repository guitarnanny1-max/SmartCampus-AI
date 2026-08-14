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

type LeadUpdatePayload = {
  status?: unknown;
  lead_status?: unknown;
  priority?: unknown;
  notes?: unknown;
  demo_date?: unknown;
  next_follow_up_at?: unknown;
  last_contacted_at?: unknown;
};

const VALID_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DEMO_SCHEDULED",
  "CONVERTED",
  "LOST",
] as const;

const VALID_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const;

function isValidStatus(value: string): boolean {
  return (VALID_STATUSES as readonly string[]).includes(value);
}

function isValidPriority(value: string): boolean {
  return (VALID_PRIORITIES as readonly string[]).includes(value);
}

function nullableString(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim();
}

function nullableDate(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("crm_leads")
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
          source,
          lead_source,
          notes,
          city,
          state,
          country,
          school_type,
          student_count,
          website,
          demo_date,
          last_contacted_at,
          last_activity_at,
          next_follow_up_at,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("CRM lead fetch error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Lead not found." },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { error: "Unable to load lead." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      lead: data,
    });
  } catch (error) {
    console.error("CRM lead details error:", error);

    return NextResponse.json(
      { error: "Unable to load lead." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 },
      );
    }

    let body: LeadUpdatePayload;

    try {
      body = (await request.json()) as LeadUpdatePayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json(
          { error: "Status must be a string." },
          { status: 400 },
        );
      }

      const status = body.status.trim().toUpperCase();

      if (!isValidStatus(status)) {
        return NextResponse.json(
          {
            error: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}.`,
          },
          { status: 400 },
        );
      }

      updates.status = status;
      updates.lead_status = status;
    }

    if (body.lead_status !== undefined && body.status === undefined) {
      if (typeof body.lead_status !== "string") {
        return NextResponse.json(
          { error: "Lead status must be a string." },
          { status: 400 },
        );
      }

      const leadStatus = body.lead_status.trim().toUpperCase();

      if (!isValidStatus(leadStatus)) {
        return NextResponse.json(
          {
            error: `Invalid lead status. Allowed values: ${VALID_STATUSES.join(", ")}.`,
          },
          { status: 400 },
        );
      }

      updates.lead_status = leadStatus;
    }

    if (body.priority !== undefined) {
      if (typeof body.priority !== "string") {
        return NextResponse.json(
          { error: "Priority must be a string." },
          { status: 400 },
        );
      }

      const priority = body.priority.trim().toUpperCase();

      if (!isValidPriority(priority)) {
        return NextResponse.json(
          {
            error: `Invalid priority. Allowed values: ${VALID_PRIORITIES.join(", ")}.`,
          },
          { status: 400 },
        );
      }

      updates.priority = priority;
    }

    if (body.notes !== undefined) {
      const notes = nullableString(body.notes);

      if (
        body.notes !== null &&
        body.notes !== "" &&
        notes === undefined
      ) {
        return NextResponse.json(
          { error: "Notes must be text." },
          { status: 400 },
        );
      }

      updates.notes = notes;
    }

    if (body.demo_date !== undefined) {
      const demoDate = nullableDate(body.demo_date);

      if (
        body.demo_date !== null &&
        body.demo_date !== "" &&
        demoDate === undefined
      ) {
        return NextResponse.json(
          { error: "Invalid demo date." },
          { status: 400 },
        );
      }

      updates.demo_date = demoDate;
    }

    if (body.next_follow_up_at !== undefined) {
      const nextFollowUp = nullableDate(body.next_follow_up_at);

      if (
        body.next_follow_up_at !== null &&
        body.next_follow_up_at !== "" &&
        nextFollowUp === undefined
      ) {
        return NextResponse.json(
          { error: "Invalid next follow-up date." },
          { status: 400 },
        );
      }

      updates.next_follow_up_at = nextFollowUp;
    }

    if (body.last_contacted_at !== undefined) {
      const lastContacted = nullableDate(body.last_contacted_at);

      if (
        body.last_contacted_at !== null &&
        body.last_contacted_at !== "" &&
        lastContacted === undefined
      ) {
        return NextResponse.json(
          { error: "Invalid last contacted date." },
          { status: 400 },
        );
      }

      updates.last_contacted_at = lastContacted;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields were provided for update." },
        { status: 400 },
      );
    }

    updates.last_activity_at = new Date().toISOString();
    updates.updated_at = new Date().toISOString();

    const supabase = getSupabaseAdmin();

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
          source,
          lead_source,
          notes,
          city,
          state,
          country,
          school_type,
          student_count,
          website,
          demo_date,
          last_contacted_at,
          last_activity_at,
          next_follow_up_at,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      console.error("CRM lead update error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Lead not found." },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { error: "Unable to update lead." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Lead updated successfully.",
      lead: data,
    });
  } catch (error) {
    console.error("CRM lead PATCH error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Missing NEXT_PUBLIC_SUPABASE_URL")
    ) {
      return NextResponse.json(
        { error: "Lead service is not configured." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unable to update lead." },
      { status: 500 },
    );
  }
}

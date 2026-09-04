import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendLeadFollowUpNotification } from "@/lib/whatsapp/sendLeadFollowUpNotification";

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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  return cleaned || null;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Lead ID is required.",
        },
        { status: 400 },
      );
    }

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

    const followUpAt = cleanString(body.followUpAt);
    const notes = cleanString(body.notes);

    if (!followUpAt) {
      return NextResponse.json(
        {
          error: "followUpAt is required.",
        },
        { status: 400 },
      );
    }

    const parsedFollowUpAt = new Date(followUpAt);

    if (Number.isNaN(parsedFollowUpAt.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid followUpAt date.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: lead, error: leadError } = await supabase
      .from("crm_leads")
      .select(
        `
          id,
          school_name,
          contact_name,
          contact_email,
          contact_phone,
          student_count,
          source,
          lead_source,
          city,
          state,
          next_follow_up_at,
          notes
        `,
      )
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      console.error(
        "CRM follow-up lead fetch error:",
        leadError,
      );

      return NextResponse.json(
        {
          error: "Lead not found.",
          details:
            process.env.NODE_ENV === "development"
              ? leadError?.message
              : undefined,
        },
        { status: 404 },
      );
    }

    const updatedNotes = notes
      ? [
          lead.notes || null,
          `Follow-up: ${notes}`,
        ]
          .filter(Boolean)
          .join("\n")
      : lead.notes || null;

    const { data: updatedLead, error: updateError } =
      await supabase
        .from("crm_leads")
        .update({
          next_follow_up_at: parsedFollowUpAt.toISOString(),
          notes: updatedNotes,
        })
        .eq("id", id)
        .select(
          `
            id,
            school_name,
            contact_name,
            contact_email,
            contact_phone,
            student_count,
            source,
            lead_source,
            city,
            state,
            next_follow_up_at,
            notes,
            created_at,
            updated_at
          `,
        )
        .single();

    if (updateError || !updatedLead) {
      console.error(
        "CRM follow-up scheduling error:",
        updateError,
      );

      return NextResponse.json(
        {
          error: "Unable to schedule follow-up.",
          details:
            process.env.NODE_ENV === "development"
              ? updateError?.message
              : undefined,
          code: updateError?.code ?? null,
        },
        { status: 500 },
      );
    }

    const { data: scheduledActivity, error: scheduledActivityError } =
      await supabase
        .from("crm_lead_activities")
        .insert({
          lead_id: id,
          activity_type: "FOLLOW_UP",
          title: "Follow-up scheduled",
          description: [
            `Follow-up scheduled for ${new Date(
              parsedFollowUpAt.toISOString(),
            ).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })}.`,
            notes ? `Notes: ${notes}` : null,
          ]
            .filter(Boolean)
            .join(" "),
        })
        .select(
          `
            id,
            lead_id,
            activity_type,
            title,
            description,
            created_at,
            created_by
          `,
        )
        .single();

    if (scheduledActivityError) {
      console.warn(
        "Follow-up scheduled, but activity creation failed:",
        scheduledActivityError,
      );
    }

    const whatsappResult =
      await sendLeadFollowUpNotification({
        schoolName: updatedLead.school_name,
        contactName: updatedLead.contact_name,
        contactPhone: updatedLead.contact_phone,
        contactEmail: updatedLead.contact_email,
        studentCount: updatedLead.student_count,
        source:
          updatedLead.source ||
          updatedLead.lead_source,
        city: updatedLead.city,
        state: updatedLead.state,
        followUpAt: updatedLead.next_follow_up_at,
      });

    if (!whatsappResult.success) {
      if (whatsappResult.skipped) {
        return NextResponse.json({
          success: true,
          scheduled: true,
          notificationSent: false,
          skipped: true,
          message:
            "Follow-up scheduled successfully, but the WhatsApp notification was skipped.",
          lead: updatedLead,
          activity: scheduledActivity ?? null,
          whatsapp: {
            sent: false,
            skipped: true,
            messageId:
              whatsappResult.messageId ?? null,
            error:
              whatsappResult.error ?? null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        scheduled: true,
        notificationSent: false,
        message:
          "Follow-up scheduled successfully, but the WhatsApp notification could not be sent.",
        lead: updatedLead,
        activity: scheduledActivity ?? null,
        whatsapp: {
          sent: false,
          skipped: false,
          messageId:
            whatsappResult.messageId ?? null,
          error:
            whatsappResult.error ||
            "Unable to send follow-up notification.",
        },
      });
    }

    const { data: notificationActivity, error: notificationActivityError } =
      await supabase
        .from("crm_lead_activities")
        .insert({
          lead_id: id,
          activity_type: "WHATSAPP",
          title: "Follow-up notification sent via WhatsApp",
          description: `WhatsApp follow-up notification sent successfully for ${new Date(
            parsedFollowUpAt.toISOString(),
          ).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
          })}. Message ID: ${
            whatsappResult.messageId || "accepted"
          }`,
        })
        .select(
          `
            id,
            lead_id,
            activity_type,
            title,
            description,
            created_at,
            created_by
          `,
        )
        .single();

    if (notificationActivityError) {
      console.warn(
        "WhatsApp sent, but notification activity creation failed:",
        notificationActivityError,
      );
    }

    return NextResponse.json({
      success: true,
      scheduled: true,
      notificationSent: true,
      message:
        "Follow-up scheduled and notification sent successfully.",
      lead: updatedLead,
      activity: scheduledActivity ?? null,
      notificationActivity:
        notificationActivity ?? null,
      whatsapp: {
        sent: true,
        skipped: false,
        messageId:
          whatsappResult.messageId ?? null,
        error: null,
      },
    });
  } catch (error) {
    console.error(
      "CRM follow-up API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to process CRM follow-up.",
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

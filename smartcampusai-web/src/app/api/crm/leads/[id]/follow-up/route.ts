import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendLeadFollowUpNotification } from 
"@/lib/whatsapp/sendLeadFollowUpNotification";

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

export async function POST(
  _request: NextRequest,
  context: RouteContext,
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
          next_follow_up_at
        `,
      )
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      console.error("CRM follow-up lead fetch error:", leadError);

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

    if (!lead.next_follow_up_at) {
      return NextResponse.json(
        {
          error: "No follow-up is scheduled for this lead.",
        },
        { status: 400 },
      );
    }

    const whatsappResult =
      await sendLeadFollowUpNotification({
        schoolName: lead.school_name,
        contactName: lead.contact_name,
        contactPhone: lead.contact_phone,
        contactEmail: lead.contact_email,
        studentCount: lead.student_count,
        source: lead.source || lead.lead_source,
        city: lead.city,
        state: lead.state,
        followUpAt: lead.next_follow_up_at,
      });

    if (!whatsappResult.success) {
      if (whatsappResult.skipped) {
        return NextResponse.json({
          success: false,
          skipped: true,
          message:
            "Follow-up notification was skipped.",
          error: whatsappResult.error ?? null,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error:
            whatsappResult.error ||
            "Unable to send follow-up notification.",
        },
        { status: 502 },
      );
    }

    const { data: activity, error: activityError } =
      await supabase
        .from("crm_lead_activities")
        .insert({
          lead_id: id,
          activity_type: "WHATSAPP",
          title: "Follow-up reminder sent via WhatsApp",
          description: `WhatsApp follow-up reminder sent successfully for 
${new Date(
            lead.next_follow_up_at,
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

    if (activityError) {
      console.warn(
        "WhatsApp sent, but activity creation failed:",
        activityError,
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Follow-up notification sent successfully.",
      messageId: whatsappResult.messageId ?? null,
      activity: activity ?? null,
    });
  } catch (error) {
    console.error(
      "CRM follow-up notification API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to process follow-up notification.",
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

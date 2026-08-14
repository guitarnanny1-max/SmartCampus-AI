import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: "Lead service is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      schoolName,
      email,
      phone,
      studentCount,
      requirements,
      source,
    } = body;

    if (!fullName || !schoolName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Name, school name, email, and phone are required.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const parsedStudentCount = studentCount
      ? Number(String(studentCount).replace(/[^0-9]/g, ""))
      : null;

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
        source: source || "website_demo_form",
        lead_source: source || "website_demo_form",
        lead_status: "NEW",
        status: "NEW",
        priority: "MEDIUM",
        notes: notes || null,
        student_count: Number.isFinite(parsedStudentCount)
          ? parsedStudentCount
          : null,
      })
      .select(
        "id, school_name, contact_name, contact_email, contact_phone, lead_status, status, created_at"
      )
      .single();

    if (error) {
      console.error("CRM lead creation error:", error);

      return NextResponse.json(
        {
          error: "Unable to create lead.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully.",
        lead: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead API error:", error);

    return NextResponse.json(
      {
        error: "Unable to create lead.",
      },
      { status: 500 }
    );
  }
}

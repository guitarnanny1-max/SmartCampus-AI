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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);

    const applicationId = cleanString(
      searchParams.get("applicationId"),
    );

    const status = cleanString(searchParams.get("status"));

    let query = supabase
      .from("ApplicationDocument")
      .select(`
        id,
        applicationId,
        documentType,
        fileName,
        fileUrl,
        status,
        verifiedAt,
        verifiedBy,
        notes,
        createdAt,
        updatedAt
      `)
      .order("createdAt", { ascending: false });

    if (applicationId) {
      query = query.eq("applicationId", applicationId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Application document list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load application documents.",
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
      documents: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Application document GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load application documents.",
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
    const documentType = cleanString(body.documentType);
    const fileName = cleanString(body.fileName);
    const fileUrl = cleanString(body.fileUrl);
    const notes = cleanString(body.notes);

    if (!applicationId) {
      return NextResponse.json(
        {
          error: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    if (!documentType) {
      return NextResponse.json(
        {
          error: "Document type is required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: application, error: applicationError } =
      await supabase
        .from("Application")
        .select("id")
        .eq("id", applicationId)
        .maybeSingle();

    if (applicationError) {
      console.error(
        "Application verification error:",
        applicationError,
      );

      return NextResponse.json(
        {
          error: "Unable to verify application.",
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

    const { data: document, error } = await supabase
      .from("ApplicationDocument")
      .insert({
        applicationId,
        documentType,
        fileName,
        fileUrl,
        status: "PENDING",
        notes,
      })
      .select(`
        id,
        applicationId,
        documentType,
        fileName,
        fileUrl,
        status,
        verifiedAt,
        verifiedBy,
        notes,
        createdAt,
        updatedAt
      `)
      .single();

    if (error) {
      console.error(
        "Application document creation error:",
        error,
      );

      return NextResponse.json(
        {
          error: "Unable to create application document.",
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
        message: "Application document created successfully.",
        document,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Application document POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create application document.",
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

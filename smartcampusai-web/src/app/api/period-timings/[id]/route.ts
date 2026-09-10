import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return null;
  }

  const supabaseAuth = createServerClient(
    supabaseUrl,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignore cookie mutation errors in read-only contexts.
          }
        },
      },
    },
  );

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !authUser?.email) {
    return null;
  }

  const service = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data: profile, error: profileError } = await service
    .from("User")
    .select("id, tenantId, email")
    .eq("email", authUser.email)
    .maybeSingle();

  if (profileError || !profile?.tenantId) {
    return null;
  }

  return {
    userId: profile.id,
    tenantId: profile.tenantId,
  };
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Period timing id is required." },
      { status: 400 },
    );
  }

  let body: {
    period_number?: number;
    name?: string;
    start_time?: string;
    end_time?: string;
    is_break?: boolean;
    status?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const updates: Record<string, unknown> = {};

  if (body.period_number !== undefined) {
    updates.period_number = body.period_number;
  }

  if (body.name !== undefined) {
    updates.name = body.name;
  }

  if (body.start_time !== undefined) {
    updates.start_time = body.start_time;
  }

  if (body.end_time !== undefined) {
    updates.end_time = body.end_time;
  }

  if (body.is_break !== undefined) {
    updates.is_break = body.is_break;
  }

  if (body.status !== undefined) {
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update." },
      { status: 400 },
    );
  }

  const service = getServiceClient();

  const { data: existing, error: existingError } = await service
    .from("period_timings")
    .select("id, tenantId, academic_year_id")
    .eq("id", id)
    .eq("tenantId", auth.tenantId)
    .maybeSingle();

  if (existingError) {
    console.error("Period timings PATCH lookup error:", existingError);
    return NextResponse.json(
      { error: "Failed to find period timing." },
      { status: 500 },
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "Period timing not found." },
      { status: 404 },
    );
  }

  const { data, error } = await service
    .from("period_timings")
    .update(updates)
    .eq("id", id)
    .eq("tenantId", auth.tenantId)
    .select("*")
    .single();

  if (error) {
    console.error("Period timings PATCH error:", error);

    if (error.code === "23505") {
      return NextResponse.json(
        {
          error:
            "This period number already exists for this academic year.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update period timing." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    period_timing: data,
  });
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Period timing id is required." },
      { status: 400 },
    );
  }

  const service = getServiceClient();

  const { data: existing, error: existingError } = await service
    .from("period_timings")
    .select("id")
    .eq("id", id)
    .eq("tenantId", auth.tenantId)
    .maybeSingle();

  if (existingError) {
    console.error("Period timings DELETE lookup error:", existingError);
    return NextResponse.json(
      { error: "Failed to find period timing." },
      { status: 500 },
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "Period timing not found." },
      { status: 404 },
    );
  }

  const { error } = await service
    .from("period_timings")
    .delete()
    .eq("id", id)
    .eq("tenantId", auth.tenantId);

  if (error) {
    console.error("Period timings DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete period timing." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}

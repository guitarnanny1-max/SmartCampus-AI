import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

type AuthContext = {
  userId: string;
  tenantId: string;
};

async function getAuthContext(): Promise<AuthContext | null> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data: profile } = await service
    .from("User")
    .select("id, tenantId")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.tenantId) return null;

  return {
    userId: user.id,
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

function makeId() {
  return `period_timing_${crypto.randomUUID()}`;
}

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const academicYearId =
    request.nextUrl.searchParams.get("academic_year_id");

  if (!academicYearId) {
    return NextResponse.json(
      { error: "academic_year_id is required." },
      { status: 400 },
    );
  }

  const service = getServiceClient();

  const { data, error } = await service
    .from("period_timings")
    .select("*")
    .eq("tenantId", auth.tenantId)
    .eq("academic_year_id", academicYearId)
    .order("period_number", { ascending: true });

  if (error) {
    console.error("Period timings GET error:", error);
    return NextResponse.json(
      { error: "Failed to load period timings." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    period_timings: data ?? [],
    total: data?.length ?? 0,
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    academic_year_id?: string;
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

  if (
    !body.academic_year_id ||
    !body.period_number ||
    !body.name ||
    !body.start_time ||
    !body.end_time
  ) {
    return NextResponse.json(
      {
        error:
          "academic_year_id, period_number, name, start_time and end_time are required.",
      },
      { status: 400 },
    );
  }

  const service = getServiceClient();

  const { data: academicYear } = await service
    .from("academic_years")
    .select("id")
    .eq("id", body.academic_year_id)
    .eq("tenantId", auth.tenantId)
    .maybeSingle();

  if (!academicYear) {
    return NextResponse.json(
      { error: "Academic year not found." },
      { status: 404 },
    );
  }

  const { data, error } = await service
    .from("period_timings")
    .insert({
      id: makeId(),
      tenantId: auth.tenantId,
      academic_year_id: body.academic_year_id,
      period_number: body.period_number,
      name: body.name,
      start_time: body.start_time,
      end_time: body.end_time,
      is_break: body.is_break ?? false,
      status: body.status ?? "ACTIVE",
    })
    .select("*")
    .single();

  if (error) {
    console.error("Period timings POST error:", error);

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This period number already exists for this academic year." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create period timing." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      period_timing: data,
    },
    { status: 201 },
  );
}

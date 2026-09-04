import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    throw new Error(
      "Supabase environment is not fully configured.",
    );
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
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              },
            );
          } catch {
            // Cookies may be read-only.
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
    return {
      error: NextResponse.json(
        {
          authenticated: false,
          error: "Authentication required.",
        },
        { status: 401 },
      ),
    };
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data: appUser, error: userError } =
    await supabaseAdmin
      .from("User")
      .select(
        `
          id,
          "tenantId",
          email,
          name,
          role
        `,
      )
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    console.error(
      "Student detail User lookup error:",
      userError,
    );

    return {
      error: NextResponse.json(
        {
          error: "Unable to load application user.",
        },
        { status: 500 },
      ),
    };
  }

  if (!appUser) {
    return {
      error: NextResponse.json(
        {
          error:
            "Authenticated user has no application User record.",
        },
        { status: 403 },
      ),
    };
  }

  if (!appUser.tenantId) {
    return {
      error: NextResponse.json(
        {
          error: "Application user has no tenant.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
  };
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Student ID is required.",
        },
        { status: 400 },
      );
    }

    const {
      data: student,
      error: studentError,
    } = await supabaseAdmin
      .from("Student")
      .select(
        `
          id,
          "tenantId",
          name,
          "rollNumber",
          grade,
          "parentEmail",
          status,
          "createdAt"
        `,
      )
      .eq("id", id)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (studentError) {
      console.error(
        "Student detail database error:",
        studentError,
      );

      return NextResponse.json(
        {
          error: "Unable to load student.",
          details:
            process.env.NODE_ENV === "development"
              ? studentError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!student) {
      return NextResponse.json(
        {
          error: "Student not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error(
      "GET /api/students/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load student.",
      },
      { status: 500 },
    );
  }
}

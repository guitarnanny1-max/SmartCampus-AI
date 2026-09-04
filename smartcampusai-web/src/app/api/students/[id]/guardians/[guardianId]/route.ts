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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    throw new Error("Supabase environment is not fully configured.");
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
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
        { error: "Authentication required." },
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

  const { data: appUser, error } = await supabaseAdmin
    .from("User")
    .select('id, "tenantId", email, name, role')
    .eq("email", authUser.email)
    .maybeSingle();

  if (error) {
    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 },
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        { error: "Application user has no tenant." },
        { status: 403 },
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
  };
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string; guardianId: string }>;
  },
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const { supabaseAdmin, tenantId } = authContext;
    const { id, guardianId } = await context.params;
    const body = await request.json();

    const { data: student } = await supabaseAdmin
      .from("Student")
      .select("id")
      .eq("id", id)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const updates: Record<string, unknown> = {};

    for (const field of [
      "name",
      "relationship",
      "email",
      "phone",
      "is_primary",
      "is_emergency_contact",
    ]) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] =
          typeof body[field] === "string" && body[field] === ""
            ? null
            : body[field];
      }
    }

    if (body.is_primary === true) {
      await supabaseAdmin
        .from("student_guardians")
        .update({
          is_primary: false,
          updated_at: new Date().toISOString(),
        })
        .eq("tenantId", tenantId)
        .eq("student_id", id)
        .neq("id", guardianId);
    }

    updates.updated_at = new Date().toISOString();

    const { data: guardian, error } = await supabaseAdmin
      .from("student_guardians")
      .update(updates)
      .eq("id", guardianId)
      .eq("tenantId", tenantId)
      .eq("student_id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Student 360 guardian update error:", error);
      return NextResponse.json(
        { error: "Unable to update guardian." },
        { status: 500 },
      );
    }

    if (!guardian) {
      return NextResponse.json(
        { error: "Guardian not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      guardian,
    });
  } catch (error) {
    console.error("PATCH guardian error:", error);

    return NextResponse.json(
      { error: "Unable to update guardian." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string; guardianId: string }>;
  },
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const { supabaseAdmin, tenantId } = authContext;
    const { id, guardianId } = await context.params;

    const { data: guardian } = await supabaseAdmin
      .from("student_guardians")
      .select("id, is_primary")
      .eq("id", guardianId)
      .eq("tenantId", tenantId)
      .eq("student_id", id)
      .maybeSingle();

    if (!guardian) {
      return NextResponse.json(
        { error: "Guardian not found." },
        { status: 404 },
      );
    }

    if (guardian.is_primary) {
      return NextResponse.json(
        {
          error:
            "Primary guardian cannot be deleted. Assign another primary guardian first.",
        },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("student_guardians")
      .delete()
      .eq("id", guardianId)
      .eq("tenantId", tenantId)
      .eq("student_id", id);

    if (error) {
      console.error("Student 360 guardian delete error:", error);
      return NextResponse.json(
        { error: "Unable to delete guardian." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE guardian error:", error);

    return NextResponse.json(
      { error: "Unable to delete guardian." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
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
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Supabase configuration is incomplete.",
        },
        { status: 500 }
      ),
    };
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
              }
            );
          } catch {
            // Cookies may be read-only in this request context.
          }
        },
      },
    }
  );

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !authUser?.email) {
    return {
      error: NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Authentication required.",
        },
        { status: 401 }
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
    }
  );

  const { data: appUser, error: userError } =
    await supabaseAdmin
      .from("User")
      .select("id, tenantId, email, name, role")
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Unable to load application user.",
          details: userError.message,
        },
        { status: 500 }
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Tenant not found for current user.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
  };
}

export async function GET() {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const { data, error } = await supabaseAdmin
      .from("grading_scales")
      .select(
        "id, tenantId, name, min_percentage, max_percentage, grade, grade_point, description, created_at, updated_at"
      )
      .eq("tenantId", tenantId)
      .order("min_percentage", {
        ascending: false,
      });

    if (error) {
      console.error("Grading scales GET error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load grading scales.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scales: data ?? [],
    });
  } catch (error) {
    console.error("Grading scales GET exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load grading scales.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const grade =
      typeof body.grade === "string"
        ? body.grade.trim()
        : "";

    const minPercentage = Number(
      body.min_percentage
    );

    const maxPercentage = Number(
      body.max_percentage
    );

    const gradePoint =
      body.grade_point === null ||
      body.grade_point === undefined ||
      body.grade_point === ""
        ? null
        : Number(body.grade_point);

    const description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Scale name is required.",
        },
        { status: 400 }
      );
    }

    if (!grade) {
      return NextResponse.json(
        {
          success: false,
          error: "Grade is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(minPercentage) ||
      minPercentage < 0 ||
      minPercentage > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Minimum percentage must be between 0 and 100.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(maxPercentage) ||
      maxPercentage < 0 ||
      maxPercentage > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Maximum percentage must be between 0 and 100.",
        },
        { status: 400 }
      );
    }

    if (minPercentage > maxPercentage) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Minimum percentage cannot exceed maximum percentage.",
        },
        { status: 400 }
      );
    }

    if (
      gradePoint !== null &&
      (!Number.isFinite(gradePoint) ||
        gradePoint < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Grade point must be a non-negative number.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("grading_scales")
      .insert({
        id: `grading_scale_${crypto.randomUUID()}`,
        tenantId,
        name,
        min_percentage: minPercentage,
        max_percentage: maxPercentage,
        grade,
        grade_point: gradePoint,
        description,
      })
      .select(
        "id, tenantId, name, min_percentage, max_percentage, grade, grade_point, description, created_at, updated_at"
      )
      .single();

    if (error) {
      console.error("Grading scales POST error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create grading scale.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        scale: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Grading scales POST exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create grading scale.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const url = new URL(request.url);
    const id = (url.searchParams.get("id") || "").trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Grading scale ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updates: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            error: "Scale name is required.",
          },
          { status: 400 }
        );
      }

      updates.name = name;
    }

    if (typeof body.grade === "string") {
      const grade = body.grade.trim();

      if (!grade) {
        return NextResponse.json(
          {
            success: false,
            error: "Grade is required.",
          },
          { status: 400 }
        );
      }

      updates.grade = grade;
    }

    if (
      body.min_percentage !== undefined
    ) {
      const value = Number(body.min_percentage);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Minimum percentage must be between 0 and 100.",
          },
          { status: 400 }
        );
      }

      updates.min_percentage = value;
    }

    if (
      body.max_percentage !== undefined
    ) {
      const value = Number(body.max_percentage);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Maximum percentage must be between 0 and 100.",
          },
          { status: 400 }
        );
      }

      updates.max_percentage = value;
    }

    if (
      updates.min_percentage !== undefined ||
      updates.max_percentage !== undefined
    ) {
      const { data: current, error: currentError } =
        await supabaseAdmin
          .from("grading_scales")
          .select(
            "min_percentage, max_percentage"
          )
          .eq("id", id)
          .eq("tenantId", tenantId)
          .maybeSingle();

      if (currentError) {
        throw currentError;
      }

      if (!current) {
        return NextResponse.json(
          {
            success: false,
            error: "Grading scale not found.",
          },
          { status: 404 }
        );
      }

      const min =
        updates.min_percentage ??
        current.min_percentage;

      const max =
        updates.max_percentage ??
        current.max_percentage;

      if (min > max) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Minimum percentage cannot exceed maximum percentage.",
          },
          { status: 400 }
        );
      }
    }

    if (body.grade_point !== undefined) {
      if (
        body.grade_point === null ||
        body.grade_point === ""
      ) {
        updates.grade_point = null;
      } else {
        const value = Number(body.grade_point);

        if (
          !Number.isFinite(value) ||
          value < 0
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Grade point must be a non-negative number.",
            },
            { status: 400 }
          );
        }

        updates.grade_point = value;
      }
    }

    if (body.description !== undefined) {
      updates.description =
        typeof body.description === "string"
          ? body.description.trim() || null
          : null;
    }

    if (
      Object.keys(updates).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No changes supplied.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("grading_scales")
      .update(updates)
      .eq("id", id)
      .eq("tenantId", tenantId)
      .select(
        "id, tenantId, name, min_percentage, max_percentage, grade, grade_point, description, created_at, updated_at"
      )
      .single();

    if (error) {
      console.error("Grading scales PATCH error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to update grading scale.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scale: data,
    });
  } catch (error) {
    console.error("Grading scales PATCH exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update grading scale.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const url = new URL(request.url);
    const id = (url.searchParams.get("id") || "").trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Grading scale ID is required.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("grading_scales")
      .delete()
      .eq("id", id)
      .eq("tenantId", tenantId);

    if (error) {
      console.error("Grading scales DELETE error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to remove grading scale.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Grading scales DELETE exception:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to remove grading scale.",
      },
      { status: 500 }
    );
  }
}

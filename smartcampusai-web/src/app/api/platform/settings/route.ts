import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function requireSuperAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) return null;

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: appUser } = await adminClient
    .from("User")
    .select("id, email, isPlatformUser, platformRole")
    .eq("email", authUser.email)
    .maybeSingle();

  if (
    !appUser?.isPlatformUser ||
    appUser.platformRole !== "SUPER_ADMIN"
  ) {
    return null;
  }

  return { adminClient, appUser, authUser };
}

export async function GET() {
  const context = await requireSuperAdmin();

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await context.adminClient
    .from("PlatformSettings")
    .select("*")
    .eq("id", "platform_settings")
    .maybeSingle();

  if (error) {
    console.error("Platform settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load platform settings" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Platform settings not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ settings: data });
}

export async function PATCH(request: Request) {
  const context = await requireSuperAdmin();

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const allowedFields = [
    "platformName",
    "supportEmail",
    "supportPhone",
    "currency",
    "timezone",
    "maintenanceMode",
    "schoolCreationEnabled",
  ] as const;

  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (updates.platformName !== undefined) {
    if (
      typeof updates.platformName !== "string" ||
      !updates.platformName.trim()
    ) {
      return NextResponse.json(
        { error: "Platform name is required" },
        { status: 400 },
      );
    }

    updates.platformName = updates.platformName.trim();
  }

  if (
    updates.maintenanceMode !== undefined &&
    typeof updates.maintenanceMode !== "boolean"
  ) {
    return NextResponse.json(
      { error: "maintenanceMode must be boolean" },
      { status: 400 },
    );
  }

  if (
    updates.schoolCreationEnabled !== undefined &&
    typeof updates.schoolCreationEnabled !== "boolean"
  ) {
    return NextResponse.json(
      { error: "schoolCreationEnabled must be boolean" },
      { status: 400 },
    );
  }

  if (updates.currency !== undefined) {
    if (
      typeof updates.currency !== "string" ||
      !/^[A-Z]{3}$/.test(updates.currency)
    ) {
      return NextResponse.json(
        { error: "Currency must be a 3-letter ISO code" },
        { status: 400 },
      );
    }
  }

  updates.updatedAt = new Date().toISOString();

  const { data, error } = await context.adminClient
    .from("PlatformSettings")
    .update(updates)
    .eq("id", "platform_settings")
    .select("*")
    .single();

  if (error) {
    console.error("Platform settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update platform settings" },
      { status: 500 },
    );
  }

  const { error: auditError } = await context.adminClient
    .from("PlatformAuditLog")
    .insert({
      id: `audit_${crypto.randomUUID()}`,
      actorUserId: context.appUser.id,
      actorEmail: context.authUser.email,
      action: "UPDATE_PLATFORM_SETTINGS",
      resourceType: "PlatformSettings",
      resourceId: "platform_settings",
      description: "Updated platform settings.",
      metadata: {
        changes: updates,
      },
    });

  if (auditError) {
    console.error("Platform settings audit error:", auditError);
  }

  return NextResponse.json({ settings: data });
}

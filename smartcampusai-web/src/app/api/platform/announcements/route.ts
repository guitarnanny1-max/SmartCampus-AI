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

const VALID_TYPES = ["INFO", "SUCCESS", "WARNING", "CRITICAL"] as const;
const VALID_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

function isValidType(value: unknown): value is (typeof VALID_TYPES)[number] {
  return typeof value === "string" && VALID_TYPES.includes(value as never);
}

function isValidStatus(
  value: unknown,
): value is (typeof VALID_STATUSES)[number] {
  return typeof value === "string" && VALID_STATUSES.includes(value as never);
}

export async function GET() {
  const context = await requireSuperAdmin();

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await context.adminClient
    .from("PlatformAnnouncement")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Platform announcements fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load announcements" },
      { status: 500 },
    );
  }

  return NextResponse.json({ announcements: data ?? [] });
}

export async function POST(request: Request) {
  const context = await requireSuperAdmin();

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  const type = body.type ?? "INFO";
  const status = body.status ?? "DRAFT";

  if (!title || !message) {
    return NextResponse.json(
      { error: "Title and message are required" },
      { status: 400 },
    );
  }

  if (!isValidType(type)) {
    return NextResponse.json(
      { error: "Invalid announcement type" },
      { status: 400 },
    );
  }

  if (!isValidStatus(status)) {
    return NextResponse.json(
      { error: "Invalid announcement status" },
      { status: 400 },
    );
  }

  const announcement = {
    id: `announcement_${crypto.randomUUID()}`,
    title,
    message,
    type,
    status,
    startsAt: body.startsAt || null,
    endsAt: body.endsAt || null,
    createdByUserId: context.appUser.id,
  };

  const { data, error } = await context.adminClient
    .from("PlatformAnnouncement")
    .insert(announcement)
    .select("*")
    .single();

  if (error) {
    console.error("Platform announcement creation error:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 },
    );
  }

  const { error: auditError } = await context.adminClient
    .from("PlatformAuditLog")
    .insert({
      id: `audit_${crypto.randomUUID()}`,
      actorUserId: context.appUser.id,
      actorEmail: context.authUser.email,
      action: "CREATE_ANNOUNCEMENT",
      resourceType: "PlatformAnnouncement",
      resourceId: data.id,
      description: `Created platform announcement ${data.title}.`,
      metadata: {
        announcementId: data.id,
        title: data.title,
        type: data.type,
        status: data.status,
      },
    });

  if (auditError) {
    console.error("Announcement audit error:", auditError);
  }

  return NextResponse.json({ announcement: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const context = await requireSuperAdmin();

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (typeof body.id !== "string" || !body.id.trim()) {
    return NextResponse.json(
      { error: "Announcement id is required" },
      { status: 400 },
    );
  }

  const { data: existing, error: existingError } = await context.adminClient
    .from("PlatformAnnouncement")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  if (existingError) {
    console.error("Platform announcement lookup error:", existingError);
    return NextResponse.json(
      { error: "Failed to load announcement" },
      { status: 500 },
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "Announcement not found" },
      { status: 404 },
    );
  }

  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }
    updates.title = body.title.trim();
  }

  if (body.message !== undefined) {
    if (typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }
    updates.message = body.message.trim();
  }

  if (body.type !== undefined) {
    if (!isValidType(body.type)) {
      return NextResponse.json(
        { error: "Invalid announcement type" },
        { status: 400 },
      );
    }
    updates.type = body.type;
  }

  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid announcement status" },
        { status: 400 },
      );
    }
    updates.status = body.status;
  }

  if (body.startsAt !== undefined) {
    updates.startsAt = body.startsAt || null;
  }

  if (body.endsAt !== undefined) {
    updates.endsAt = body.endsAt || null;
  }

  updates.updatedAt = new Date().toISOString();

  const { data, error } = await context.adminClient
    .from("PlatformAnnouncement")
    .update(updates)
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) {
    console.error("Platform announcement update error:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 },
    );
  }

  const { error: auditError } = await context.adminClient
    .from("PlatformAuditLog")
    .insert({
      id: `audit_${crypto.randomUUID()}`,
      actorUserId: context.appUser.id,
      actorEmail: context.authUser.email,
      action: "UPDATE_ANNOUNCEMENT",
      resourceType: "PlatformAnnouncement",
      resourceId: data.id,
      description: `Updated platform announcement ${data.title}.`,
      metadata: {
        announcementId: data.id,
        changes: updates,
      },
    });

  if (auditError) {
    console.error("Announcement audit error:", auditError);
  }

  return NextResponse.json({ announcement: data });
}

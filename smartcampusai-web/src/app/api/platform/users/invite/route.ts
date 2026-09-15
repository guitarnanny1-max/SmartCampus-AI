import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase environment is not fully configured." },
        { status: 500 },
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
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Safe to ignore when cookies are read-only.
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
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
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

    const { data: appUser, error: appUserError } = await supabaseAdmin
      .from("User")
      .select('id,tenantId,email,"platformRole","isPlatformUser"')
      .eq("email", authUser.email)
      .maybeSingle();

    if (appUserError) {
      return NextResponse.json(
        { error: "Unable to verify platform access." },
        { status: 500 },
      );
    }

    if (
      appUser?.isPlatformUser !== true ||
      appUser?.platformRole !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Platform Super Admin access required." },
        { status: 403 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 },
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const { data: existingAppUser } = await supabaseAdmin
      .from("User")
      .select("id,email,isPlatformUser")
      .eq("email", email)
      .maybeSingle();

    if (existingAppUser) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 },
      );
    }

    const {
      data: authInvite,
      error: inviteError,
    } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name,
        platformRole: "SUPER_ADMIN",
      },
    });

    if (inviteError || !authInvite.user) {
      return NextResponse.json(
        {
          error: inviteError?.message || "Unable to send invitation.",
        },
        { status: 500 },
      );
    }

    const userId = `user_${crypto.randomUUID()}`;

    const { data: createdUser, error: createError } = await supabaseAdmin
      .from("User")
      .insert({
        id: userId,
        tenantId: appUser.tenantId,
        email,
        name,
        role: "PLATFORM_ADMIN",
        password: "AUTH_MANAGED",
        platformRole: "SUPER_ADMIN",
        isPlatformUser: true,
      })
      .select(
        'id,email,name,role,"platformRole","isPlatformUser","createdAt"',
      )
      .single();

    if (createError) {
      await supabaseAdmin.auth.admin.deleteUser(authInvite.user.id);

      return NextResponse.json(
        { error: "Unable to create platform user." },
        { status: 500 },
      );
    }

    const { error: auditError } = await supabaseAdmin
      .from("PlatformAuditLog")
      .insert({
        id: `audit_${crypto.randomUUID()}`,
        actorUserId: appUser.id,
        actorEmail: authUser.email,
        action: "INVITE_PLATFORM_USER",
        resourceType: "User",
        resourceId: createdUser.id,
        description: `Invited platform user ${createdUser.email}.`,
        metadata: {
          invitedEmail: createdUser.email,
          invitedName: createdUser.name,
          platformRole: createdUser.platformRole,
        },
      });

    if (auditError) {
      console.error("Platform user audit log error:", auditError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Platform user invitation sent successfully.",
        user: createdUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Platform user invitation API error:", error);

    return NextResponse.json(
      { error: "Unable to invite platform user." },
      { status: 500 },
    );
  }
}

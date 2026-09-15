import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

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
    }
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) return null;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: appUser } = await admin
    .from("User")
    .select("id,email,isPlatformUser,platformRole")
    .eq("email", authUser.email)
    .maybeSingle();

  if (
    !appUser ||
    appUser.isPlatformUser !== true ||
    appUser.platformRole !== "SUPER_ADMIN"
  ) {
    return null;
  }

  return admin;
}

export async function GET() {
  const admin = await requireSuperAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await admin
    .from("PlatformCustomBill")
    .select(
      `
        id,
        tenantId,
        description,
        amount,
        dueDate,
        status,
        notes,
        createdAt,
        updatedAt,
        Tenant (
          id,
          name,
          subdomain
        )
      `
    )
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Custom bills query failed:", error);
    return NextResponse.json(
      { error: "Failed to load custom bills" },
      { status: 500 }
    );
  }

  return NextResponse.json({ bills: data ?? [] });
}

export async function POST(request: Request) {
  const admin = await requireSuperAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const tenantId = String(body.tenantId ?? "").trim();
    const description = String(body.description ?? "").trim();
    const amount = Number(body.amount);
    const dueDate = body.dueDate
      ? String(body.dueDate).trim()
      : null;
    const notes = body.notes
      ? String(body.notes).trim()
      : null;

    if (!tenantId || !description) {
      return NextResponse.json(
        { error: "Tenant and description are required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: "Amount must be a valid non-negative number" },
        { status: 400 }
      );
    }

    const { data: tenant } = await admin
      .from("Tenant")
      .select("id")
      .eq("id", tenantId)
      .maybeSingle();

    if (!tenant) {
      return NextResponse.json(
        { error: "School tenant not found" },
        { status: 404 }
      );
    }

    const id = `bill_${crypto.randomUUID()}`;

    const { data, error } = await admin
      .from("PlatformCustomBill")
      .insert({
        id,
        tenantId,
        description,
        amount,
        dueDate,
        status: "PENDING",
        notes,
      })
      .select(
        `
          id,
          tenantId,
          description,
          amount,
          dueDate,
          status,
          notes,
          createdAt,
          updatedAt,
          Tenant (
            id,
            name,
            subdomain
          )
        `
      )
      .single();

    if (error) {
      console.error("Custom bill creation failed:", error);
      return NextResponse.json(
        { error: "Failed to create custom bill" },
        { status: 500 }
      );
    }

    return NextResponse.json({ bill: data }, { status: 201 });
  } catch (error) {
    console.error("Custom bill request failed:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

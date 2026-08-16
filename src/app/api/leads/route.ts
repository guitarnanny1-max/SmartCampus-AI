import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, schoolName, email, phone, studentCount, requirements } = body;

    if (!fullName || !schoolName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();
    const { error } = await supabase.from("leads").insert([
      {
        full_name: fullName,
        school_name: schoolName,
        email,
        phone,
        student_count: studentCount,
        requirements,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

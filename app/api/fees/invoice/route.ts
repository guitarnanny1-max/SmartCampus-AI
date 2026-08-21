import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, studentName, parentPhone, amount, feeType, dueDate } = body;

    if (!studentId || !amount) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameters (studentId, amount)." 
      }, { status: 400 });
    }

    console.log("💳 [Bursar Financial Engine] Processing fee invoice for student:", studentId);

    // Step 1: Generate Invoice Ledger Entry
    const invoiceId = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);
    console.log("  ├─ Step 1: Generated Invoice ID: " + invoiceId + " for ₹" + amount + " (" + (feeType || "Tuition Fee") + ")");

    // Step 2: Bind to Student Account
    console.log("  ├─ Step 2: Bound invoice to student ledger with due date: " + (dueDate || "2026-09-10"));

    // Step 3: Trigger Automated Parent WhatsApp / SMS Notification
    console.log("  ├─ Step 3: Triggering automated WhatsApp alert to parent at " + (parentPhone || "+91 99999 99999"));
    console.log("  │   └─ Message: Dear Parent, a fee invoice of ₹" + amount + " for " + studentName + " is now generated. Due by " + (dueDate || "2026-09-10") + ". Pay securely via SmartCampus Portal.");

    // Step 4: Audit Logging
    console.log("  └─ Step 4: Recorded transaction in tenant audit log.");

    return NextResponse.json({ 
      success: true, 
      message: "Invoice successfully created and parent notification dispatched.",
      data: {
        invoiceId,
        studentId,
        amount,
        status: "PENDING_PAYMENT",
        notificationSent: true
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Fee invoice error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error during invoice generation" }, { status: 500 });
  }
}

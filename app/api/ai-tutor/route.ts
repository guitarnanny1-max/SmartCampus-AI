import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ success: false, error: "Missing message" }, { status: 400 });
    }

    let reply = "That is a great academic question! Let us break it down step-by-step together.";
    const lower = message.toLowerCase();

    if (lower.includes("math") || lower.includes("algebra") || lower.includes("calculus") || lower.includes("equation")) {
      reply = "To solve this mathematical problem, remember to isolate your variables and check your signs. Would you like to plug in a specific equation?";
    } else if (lower.includes("science") || lower.includes("physics") || lower.includes("chemistry") || lower.includes("biology")) {
      reply = "In science, core principles like conservation of energy or cellular structures are key. What specific concept are you reviewing?";
    } else if (lower.includes("exam") || lower.includes("test") || lower.includes("homework")) {
      reply = "Make sure to prioritize your pending assignments by deadline. Review your lecture notes or flashcards for quick revision!";
    }

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

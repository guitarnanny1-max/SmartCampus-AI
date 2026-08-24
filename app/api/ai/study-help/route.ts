import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question) return NextResponse.json({ success: false, error: "Missing question" }, { status: 400 });

    const qLower = question.toLowerCase();
    let answer = "";

    if (qLower.includes("quadratic") || qLower.includes("equation")) {
      answer = "For quadratic equations $ax^2 + bx + c = 0$, you can solve for $x$ using the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. Make sure to check the discriminant ($b^2 - 4ac$) first!";
    } else if (qLower.includes("newton") || qLower.includes("physics") || qLower.includes("motion")) {
      answer = "Newton's Second Law of Motion states that force equals mass times acceleration ($F = ma$). This means acceleration is directly proportional to net force and inversely proportional to mass.";
    } else if (qLower.includes("money") || qLower.includes("cash") || qLower.includes("fee")) {
      answer = "Haha, I'm your AI Study Assistant, not the school accounts department! For fee payments and financial ledgers, check out the Parent Portal. Let's stick to homework, science, and math!";
    } else if (qLower.includes("hi") || qLower.includes("hello") || qLower.includes("hey")) {
      answer = "Hello Rahul! Ready to tackle some math, science, or computer science homework today? What are we working on?";
    } else if (qLower.includes("ok") || qLower.includes("thanks") || qLower.includes("thank you")) {
      answer = "You're welcome, Rahul! Let me know if you have any other questions for your classes.";
    } else {
      answer = `That's an interesting question about "${question}". To help you with your coursework, let's look at the core principles involved or try breaking it down into smaller steps. What specific subject or textbook chapter is this related to?`;
    }

    return NextResponse.json({ success: true, answer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

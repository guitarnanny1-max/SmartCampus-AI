export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: any): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { question, schoolId, userId } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const lowerQ = question.toLowerCase();
    let aiResponse = "I'm your Smart Campus AI assistant. How can I help you today?";

    if (lowerQ.includes('fee') || lowerQ.includes('payment') || lowerQ.includes('tuition')) {
      aiResponse = "Fee payments and installment extensions can be managed directly through the Finance Portal or verified via our automated Stripe/Razorpay webhook extension logs.";
    } else if (lowerQ.includes('admission') || lowerQ.includes('enroll')) {
      aiResponse = "Admissions inquiries are handled by our AI-powered intake engine. You can submit documents and check status via the Admissions module.";
    } else if (lowerQ.includes('health') || lowerQ.includes('walk') || lowerQ.includes('steps')) {
      aiResponse = "Campus health metrics and smart-walk tracking can be viewed on your wellness dashboard.";
    }

    let ticket = null;
    try {
      ticket = await (prisma as any).smartHelpdeskTicket.create({
        data: {
          question,
          aiResponse,
          schoolId: schoolId || 'default-school',
          userId: userId || 'anonymous',
          status: 'RESOLVED'
        }
      });
    } catch (dbErr) {
      console.warn('Database log skipped:', dbErr);
    }

    return NextResponse.json(ticket || { question, aiResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process AI query' }, { status: 500 });
  }
}

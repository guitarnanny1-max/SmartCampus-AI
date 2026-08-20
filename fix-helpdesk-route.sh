#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Rewriting Valid src/app/api/smart-helpdesk/route.ts"
echo "=================================================="

mkdir -p src/app/api/smart-helpdesk

cat << 'ROUTEEOF' > src/app/api/smart-helpdesk/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
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
      ticket = await prisma.smartHelpdeskTicket.create({
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
ROUTEEOF

echo "✨ Clean helpdesk route written successfully!"
echo "Starting Next.js development server..."
npm run dev

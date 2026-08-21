#!/bin/bash
set -e

echo "🚀 Upgrading Sales CRM Pipeline API..."

# Update API route to handle status updates and notifications
cat << 'EOL' > src/app/api/chat/lead/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { evaluateLead } from '@/lib/leadScoring';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

// POST: Create new lead from AI Chat
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, school, phone, email, studentStrength, location, interest } = body;

    if (!name || !school || !phone || !email) {
      return NextResponse.json({ error: 'Missing required contact details' }, { status: 400 });
    }

    const { score, temperature } = evaluateLead({
      studentStrength: studentStrength ? parseInt(studentStrength) : undefined,
      location,
      interest
    });

    const newLead = await prisma.lead.create({
      data: {
        name,
        school,
        phone,
        email,
        studentStrength: studentStrength ? parseInt(studentStrength) : null,
        location,
        interest,
        score,
        temperature,
        status: 'NEW'
      }
    });

    // If lead is 🔥 Hot, trigger immediate alert simulation
    if (temperature.includes("Hot")) {
      console.log(`🔥 [HIGH PRIORITY ALERT] Hot Lead Captured: ${school} (${name}) - Score: ${score}/100`);
      // Here you can integrate Resend, SendGrid, or Slack Webhooks easily
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('CRM Capture Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update lead status (e.g., Contacted, Demo Booked, Won)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing lead ID or status' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('CRM Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
EOL

echo "✨ Updated API route with status management and hot lead alerting!"
npx prisma generate

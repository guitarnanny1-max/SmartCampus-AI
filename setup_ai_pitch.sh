#!/bin/bash
set -e

echo "🚀 Creating AI Sales Pitch & Email Generator..."

# 1. Create API endpoint for generating AI outreach emails
mkdir -p src/app/api/chat/lead/pitch

cat << 'EOL' > src/app/api/chat/lead/pitch/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Generate context-aware sales pitch based on temperature and student strength
    let tone = "professional and consultative";
    if (lead.temperature.includes("Hot")) {
      tone = "urgent, high-priority, and executive-level";
    }

    const subject = `Transforming campus operations at ${lead.school}`;
    const emailBody = `Hi ${lead.name},\n\nI noticed your inquiry regarding ${lead.interest || 'SmartCampus ERP'} for ${lead.school}. With an estimated student body of ${lead.studentStrength || 'growing numbers'}, scaling administrative efficiency, fee collection, and admissions can become quite complex.\n\nSmartCampus AI helps institutions like ${lead.school} automate up to 70% of routine workflows while boosting parent engagement.\n\nWould you be open to a quick 10-minute workflow walkthrough this week?\n\nBest regards,\nSmartCampus Admissions Team`;

    return NextResponse.json({
      success: true,
      pitch: {
        subject,
        body: emailBody,
        recommendedAction: lead.temperature.includes("Hot") ? "Call immediately or schedule priority VIP demo." : "Send personalized follow-up sequence."
      }
    });
  } catch (error) {
    console.error('AI Pitch Generator Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
EOL

echo "✨ Created AI Pitch generation API endpoint!"
echo "🎉 AI Pitch feature successfully set up!"

import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';


export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 });
    }

    const lead: any = await (prisma as any).lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const temperature = lead.temperature || "🔵 Cold";
    const schoolName = lead.schoolName || lead.school || "the institution";
    const contactName = lead.contactName || lead.name || "Director";
    const interest = lead.interest || 'SmartCampus ERP';
    const studentStrength = lead.studentStrength || 'growing numbers';

    let tone = "professional and consultative";
    if (typeof temperature === 'string' && temperature.includes("Hot")) {
      tone = "urgent, high-priority, and executive-level";
    }

    const subject = `Transforming campus operations at ${schoolName}`;
    const emailBody = `Hi ${contactName},\n\nI noticed your inquiry regarding ${interest} for ${schoolName}. With an estimated student body of ${studentStrength}, scaling administrative efficiency, fee collection, and admissions can become quite complex.\n\nSmartCampus AI helps institutions like ${schoolName} automate up to 70% of routine workflows while boosting parent engagement.\n\nWould you be open to a quick 10-minute workflow walkthrough this week?\n\nBest regards,\nSmartCampus Admissions Team`;

    return NextResponse.json({
      success: true,
      pitch: {
        subject,
        body: emailBody,
        recommendedAction: typeof temperature === 'string' && temperature.includes("Hot") ? "Call immediately or schedule priority VIP demo." : "Send personalized follow-up sequence."
      }
    });
  } catch (error) {
    console.error('AI Pitch Generator Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

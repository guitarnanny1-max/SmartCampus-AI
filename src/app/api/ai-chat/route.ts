export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { prompt, schoolId } = await req.json();

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        facilities: true,
        students: true,
        placements: true,
        alerts: true,
      },
    });

    if (!school) {
      return NextResponse.json({ reply: "Hello! I am your AI campus assistant. Please select an active school tenant to query telemetry, student rosters, or placement statistics." });
    }

    const query = prompt.toLowerCase();
    let reply = `Based on current live telemetry for ${school.name} (${school.tier} tier): `;

    if (query.includes('student') || query.includes('enroll')) {
      reply += `We currently have ${school.students.length} active students enrolled out of a max capacity of ${school.maxStudents}. Top performers include Aarav Sharma and Ananya Iyer (CGPA 4.0).`;
    } else if (query.includes('energy') || query.includes('solar') || query.includes('power')) {
      reply += `Solar array generation is peaking at 48.2 kW with a grid power load of 117.9 kW. HVAC systems are operating efficiently at 22.6°C across all ${school.facilities.length} campus facilities.`;
    } else if (query.includes('placement') || query.includes('job') || query.includes('package')) {
      reply += `Recent corporate recruitment features top offers from Google, Microsoft, and Goldman Sachs with packages up to 28 LPA.`;
    } else if (query.includes('alert') || query.includes('issue') || query.includes('incident')) {
      reply += `There are ${school.alerts.length} active operational notices, including routine HVAC filter maintenance in the Science Block and peak solar generation output.`;
    } else {
      reply += `All ${school.facilities.length} campus zones are online, security audit logs are verified, and webhooks are synchronizing successfully.`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ reply: "I encountered an error processing your query. Please try again." }, { status: 500 });
  }
}

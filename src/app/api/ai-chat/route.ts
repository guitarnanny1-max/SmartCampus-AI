import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const school = await getCurrentSchool();

    const [facilities, students, placements] = await Promise.all([
      prisma.facility.findMany({ where: { schoolId: school.id } }),
      prisma.student.findMany({ where: { schoolId: school.id } }),
      prisma.placement.findMany({ where: { schoolId: school.id } }),
    ]);

    const lowerPrompt = prompt.toLowerCase();
    let reply = '';

    if (lowerPrompt.includes('solar') || lowerPrompt.includes('energy') || lowerPrompt.includes('power')) {
      const summary = facilities.map(f => `${f.zoneName} generates ${f.solar} with HVAC in ${f.hvac} mode`).join('. ');
      reply = `For ${school.name}, energy telemetry shows: ${summary}. All systems are operating efficiently.`;
    } else if (lowerPrompt.includes('student') || lowerPrompt.includes('roster') || lowerPrompt.includes('cgpa')) {
      const summary = students.map(s => `${s.name} (Roll: ${s.rollNo}) has a CGPA of ${s.cgpa}`).join(', ');
      reply = `Active student records for ${school.name}: ${summary}.`;
    } else if (lowerPrompt.includes('placement') || lowerPrompt.includes('job') || lowerPrompt.includes('salary') || lowerPrompt.includes('ctc')) {
      const summary = placements.map(p => `${p.company} offering ${p.role} at ${p.ctc}`).join('; ');
      reply = `Top career recruiters for ${school.name}: ${summary}.`;
    } else {
      reply = `Hello! I am your AI Operations Assistant for ${school.name} (${school.subdomain}). I manage ${facilities.length} facility zones, ${students.length} students, and ${placements.length} recruitment partners. How can I assist you with campus metrics today?`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process AI query' }, { status: 500 });
  }
}

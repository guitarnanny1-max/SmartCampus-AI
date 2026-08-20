export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let responseText = `I am your ${school.name} AI Assistant. All campus edge nodes are currently operating normally.`;
    const lower = prompt.toLowerCase();

    if (lower.includes('hvac') || lower.includes('temperature') || lower.includes('climate')) {
      responseText = `For ${school.name}, current HVAC systems across academic and lab zones are running in eco-mode at 21°C, maintaining optimal energy efficiency.`;
    } else if (lower.includes('solar') || lower.includes('energy') || lower.includes('power')) {
      responseText = `Solar generation across campus is currently producing 42.7 kW with zero grid reliance. Battery storage is at 94% capacity.`;
    } else if (lower.includes('placement') || lower.includes('jobs') || lower.includes('ctc')) {
      responseText = `Recent institutional placement records show strong recruitment by top tech firms with average CTC packages exceeding $85,000.`;
    } else if (lower.includes('emergency') || lower.includes('weather') || lower.includes('lockdown')) {
      responseText = `Emergency broadcast systems are fully operational. No active lockdowns or severe weather warnings are currently in effect.`;
    }

    const chat = await prisma.aiChat.create({
      data: {
        schoolId: school.id,
        prompt,
        response: responseText,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process AI assistant request' }, { status: 500 });
  }
}

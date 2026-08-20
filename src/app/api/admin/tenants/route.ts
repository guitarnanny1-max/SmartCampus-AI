export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, subdomain, tier, maxStudents } = await req.json();

    if (!name || !subdomain) {
      return NextResponse.json({ error: 'Name and subdomain are required' }, { status: 400 });
    }

    const school = await prisma.school.create({
      data: {
        name,
        subdomain,
        tier: tier || 'PROFESSIONAL',
        maxStudents: maxStudents ? parseInt(maxStudents) : 500,
        facilities: {
          create: [
            { zoneName: 'Main Academic Block', solar: '24.5 kW', hvac: 'Auto (22°C)', status: 'OPTIMAL' },
            { zoneName: 'Science & Research Lab', solar: '18.2 kW', hvac: 'Eco Mode (20°C)', status: 'OPTIMAL' }
          ]
        },
        students: {
          create: [
            { name: 'Alex Johnson', rollNo: 'CS-2026-001', cgpa: 3.92 },
            { name: 'Maria Garcia', rollNo: 'EE-2026-002', cgpa: 3.85 }
          ]
        }
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to provision tenant school (subdomain may already exist)' }, { status: 500 });
  }
}

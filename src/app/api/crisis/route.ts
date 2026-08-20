export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let incidents = await prisma.crisisIncident.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (incidents.length === 0) {
      const defaultIncidents = [
        { title: 'Chemical Fume Leak in Chemistry Lab 4B', incidentType: 'HAZMAT', location: 'Science Wing Level 2', severity: 'CRITICAL', status: 'ACTIVE', assignedTeam: 'Hazmat Response Unit 1' },
        { title: 'Medical Emergency: Severe Allergic Reaction', incidentType: 'MEDICAL', location: 'University Student Union Cafeteria', severity: 'HIGH', status: 'RESPONDING', assignedTeam: 'Campus EMT Team Alpha' },
        { title: 'Unauthorized Perimeter Access Attempt', incidentType: 'SECURITY', location: 'North Gate Perimeter Fence', severity: 'MEDIUM', status: 'RESOLVED', assignedTeam: 'Security Patrol Bravo' },
      ];

      for (const inc of defaultIncidents) {
        await prisma.crisisIncident.create({
          data: { schoolId: school.id, ...inc },
        });
      }

      incidents = await prisma.crisisIncident.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(incidents);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch crisis incidents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { title, incidentType, location, severity, assignedTeam } = await req.json();

    if (!title || !location) {
      return NextResponse.json({ error: 'Incident title and location are required' }, { status: 400 });
    }

    const incident = await prisma.crisisIncident.create({
      data: {
        schoolId: school.id,
        title,
        incidentType: incidentType || 'SECURITY',
        location,
        severity: severity || 'HIGH',
        status: 'ACTIVE',
        assignedTeam: assignedTeam || 'Campus Security Alpha',
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to dispatch crisis incident' }, { status: 500 });
  }
}

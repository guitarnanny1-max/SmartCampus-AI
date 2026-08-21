export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartVisitingFacultyHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { facultyName: 'Dr. Andrew Ng', expertise: 'Deep Learning & Neural Architectures', homeInstitution: 'Stanford University', schedulePeriod: 'Fall Semester 2026', status: 'ACTIVE' },
        { facultyName: 'Dr. Yann LeCun', expertise: 'Autonomous Machine Perception', homeInstitution: 'New York University / Meta AI', schedulePeriod: 'Winter Term 2026', status: 'SCHEDULED' },
        { facultyName: 'Prof. Fei-Fei Li', expertise: 'Computer Vision & AI Ethics', homeInstitution: 'Stanford Human-Centered AI', schedulePeriod: 'Spring Term 2026', status: 'COMPLETED' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartVisitingFacultyHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartVisitingFacultyHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch visiting faculty records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { facultyName, expertise, homeInstitution, schedulePeriod, status } = await req.json();

    if (!facultyName) {
      return NextResponse.json({ error: 'Faculty name is required' }, { status: 400 });
    }

    const record = await (prisma as any).smartVisitingFacultyHub.create({
      data: {
        schoolId: school.id,
        facultyName,
        expertise: expertise || 'Advanced Computing',
        homeInstitution: homeInstitution || 'Global Research University',
        schedulePeriod: schedulePeriod || 'Fall Semester 2026',
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create visiting faculty record' }, { status: 500 });
  }
}

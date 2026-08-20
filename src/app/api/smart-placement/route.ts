export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartPlacementHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { studentName: 'Rohan Sharma', companyName: 'Google India', packageCpaInLakhs: 45.0, jobRole: 'Software Engineer (L3)', offerStatus: 'ACCEPTED' },
        { studentName: 'Ananya Deshmukh', companyName: 'Microsoft R&D', packageCpaInLakhs: 38.5, jobRole: 'Cloud Solutions Architect', offerStatus: 'ACCEPTED' },
        { studentName: 'Karan Malhotra', companyName: 'Goldman Sachs', packageCpaInLakhs: 28.0, jobRole: 'Quantitative Analyst', offerStatus: 'OFFERED' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartPlacementHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartPlacementHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch placement records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, companyName, packageCpaInLakhs, jobRole, offerStatus } = await req.json();

    if (!studentName || !companyName) {
      return NextResponse.json({ error: 'Student name and company name are required' }, { status: 400 });
    }

    const record = await prisma.smartPlacementHub.create({
      data: {
        schoolId: school.id,
        studentName,
        companyName,
        packageCpaInLakhs: parseFloat(packageCpaInLakhs) || 10.0,
        jobRole: jobRole || 'Software Developer',
        offerStatus: offerStatus || 'ACCEPTED',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create placement record' }, { status: 500 });
  }
}

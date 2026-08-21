export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartAlumniHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { alumniName: 'Vikram Malhotra', graduationYear: 2020, currentDesignation: 'Principal Architect at Google', endowmentInr: 500000.0, networkingStatus: 'BENEFACTOR' },
        { alumniName: 'Sneha Kulkarni', graduationYear: 2021, currentDesignation: 'Senior AI Scientist at Microsoft', endowmentInr: 250000.0, networkingStatus: 'MENTOR' },
        { alumniName: 'Rahul Verma', graduationYear: 2022, currentDesignation: 'Product Manager at Razorpay', endowmentInr: 100000.0, networkingStatus: 'ACTIVE' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartAlumniHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartAlumniHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch alumni records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { alumniName, graduationYear, currentDesignation, endowmentInr, networkingStatus } = await req.json();

    if (!alumniName || !currentDesignation) {
      return NextResponse.json({ error: 'Alumni name and designation are required' }, { status: 400 });
    }

    const record = await (prisma as any).smartAlumniHub.create({
      data: {
        schoolId: school.id,
        alumniName,
        graduationYear: parseInt(graduationYear) || 2023,
        currentDesignation,
        endowmentInr: parseFloat(endowmentInr) || 25000.0,
        networkingStatus: networkingStatus || 'ACTIVE',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create alumni record' }, { status: 500 });
  }
}

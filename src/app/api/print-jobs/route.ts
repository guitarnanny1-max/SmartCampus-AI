export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let jobs = await (prisma as any).printJob.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (jobs.length === 0) {
      const defaultJobs = [
        { studentName: 'Alex Mercer', documentTitle: 'Machine Learning Research Thesis.pdf', pagesCount: 45, colorMode: 'COLOR', cost: 4.50, status: 'COMPLETED' },
        { studentName: 'Elena Rostova', documentTitle: 'Organic Chemistry Lab Manual.pdf', pagesCount: 120, colorMode: 'MONOCHROME', cost: 6.00, status: 'COMPLETED' },
        { studentName: 'Jordan Lee', documentTitle: 'Computer Networks Assignment 2.docx', pagesCount: 12, colorMode: 'MONOCHROME', cost: 0.60, status: 'QUEUED' },
      ];

      for (const j of defaultJobs) {
        await (prisma as any).printJob.create({
          data: { schoolId: school.id, ...j },
        });
      }

      jobs = await (prisma as any).printJob.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch print jobs' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { studentName, documentTitle, pagesCount, colorMode } = await req.json();

    if (!studentName || !documentTitle || !pagesCount) {
      return NextResponse.json({ error: 'Student name, document title, and page count are required' }, { status: 400 });
    }

    const pages = parseInt(pagesCount);
    const isColor = colorMode === 'COLOR';
    const costPerPg = isColor ? 0.10 : 0.05;
    const cost = parseFloat((pages * costPerPg).toFixed(2));

    const job = await (prisma as any).printJob.create({
      data: {
        schoolId: school.id,
        studentName,
        documentTitle,
        pagesCount: pages,
        colorMode: colorMode || 'MONOCHROME',
        cost,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create print job' }, { status: 500 });
  }
}

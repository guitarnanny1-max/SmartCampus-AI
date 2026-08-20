export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartWebpageCreatorHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { pageTitle: 'Aarav Sharma - AI Engineer Portfolio', authorName: 'Aarav Sharma', templateStyle: 'Modern Portfolio', slug: 'aarav-sharma-ai', deployStatus: 'LIVE' },
        { pageTitle: 'Quantum Robotics Lab & Research Hub', authorName: 'Dr. Rameshwar Nathan', templateStyle: 'Research Lab', slug: 'quantum-robotics-lab', deployStatus: 'LIVE' },
        { pageTitle: 'Google Developer Student Club (GDSC)', authorName: 'Diya Patel', templateStyle: 'Club Landing', slug: 'gdsc-campus', deployStatus: 'LIVE' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartWebpageCreatorHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartWebpageCreatorHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch webpage records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { pageTitle, authorName, templateStyle, slug } = await req.json();

    if (!pageTitle || !authorName || !slug) {
      return NextResponse.json({ error: 'Page title, author name, and URL slug are required' }, { status: 400 });
    }

    const record = await prisma.smartWebpageCreatorHub.create({
      data: {
        schoolId: school.id,
        pageTitle,
        authorName,
        templateStyle: templateStyle || 'Modern Portfolio',
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        deployStatus: 'LIVE',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create webpage record' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartThemeHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { themeName: 'Cyber Cyan Academy', primaryColor: '#06b6d4', accentColor: '#3b82f6', fontFamily: 'Inter', layoutStyle: 'Modern Minimalist', status: 'ACTIVE' },
        { themeName: 'Royal Emerald University', primaryColor: '#10b981', accentColor: '#059669', fontFamily: 'Poppins', layoutStyle: 'Classic Academic', status: 'DRAFT' },
        { themeName: 'Neon Sunset Tech', primaryColor: '#f97316', accentColor: '#ec4899', fontFamily: 'Outfit', layoutStyle: 'Bold Vibrant', status: 'DRAFT' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartThemeHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartThemeHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch theme records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { themeName, primaryColor, accentColor, fontFamily, layoutStyle, status } = await req.json();

    if (!themeName) {
      return NextResponse.json({ error: 'Theme name is required' }, { status: 400 });
    }

    // If setting ACTIVE, deactivate other themes
    if (status === 'ACTIVE') {
      await prisma.smartThemeHub.updateMany({
        where: { schoolId: school.id },
        data: { status: 'DRAFT' },
      });
    }

    const record = await prisma.smartThemeHub.create({
      data: {
        schoolId: school.id,
        themeName,
        primaryColor: primaryColor || '#06b6d4',
        accentColor: accentColor || '#8b5cf6',
        fontFamily: fontFamily || 'Inter',
        layoutStyle: layoutStyle || 'Modern Minimalist',
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create theme record' }, { status: 500 });
  }
}

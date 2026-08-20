export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const school = await db.school.findFirst();
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, tagline, logoUrl, primaryColor, accentColor, whiteLabelBrandName, whiteLabelLogoUrl, customDomain } = body;

    const school = await db.school.findFirst();
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const s = school as any;

    const updated = await db.school.update({
      where: { id: school.id },
      data: {
        name: name !== undefined ? name : s.name,
        tagline: tagline !== undefined ? tagline : s.tagline,
        logoUrl: logoUrl !== undefined ? logoUrl : s.logoUrl,
        primaryColor: primaryColor !== undefined ? primaryColor : s.primaryColor,
        accentColor: accentColor !== undefined ? accentColor : s.accentColor,
        whiteLabelBrandName: whiteLabelBrandName !== undefined ? whiteLabelBrandName : s.whiteLabelBrandName,
        whiteLabelLogoUrl: whiteLabelLogoUrl !== undefined ? whiteLabelLogoUrl : s.whiteLabelLogoUrl,
        customDomain: customDomain !== undefined ? customDomain : s.customDomain,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

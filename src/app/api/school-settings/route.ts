export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    const fullSchool = await prisma.school.findUnique({
      where: { id: school.id },
      select: {
        id: true,
        name: true,
        code: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        whiteLabelBrandName: true,
        whiteLabelLogoUrl: true,
        customDomain: true,
        primaryColor: true,
      },
    });

    return NextResponse.json(fullSchool);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch school settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { subscriptionTier, whiteLabelBrandName, whiteLabelLogoUrl, customDomain, primaryColor } = await req.json();

    const updated = await prisma.school.update({
      where: { id: school.id },
      data: {
        subscriptionTier: subscriptionTier || 'APEX_AUTONOMOUS',
        whiteLabelBrandName: whiteLabelBrandName || 'Apex Campus AI Enterprise',
        whiteLabelLogoUrl: whiteLabelLogoUrl || '',
        customDomain: customDomain || '',
        primaryColor: primaryColor || '#6366f1',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update school settings' }, { status: 500 });
  }
}

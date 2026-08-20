export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartFeatureToggleHub.findMany({
      where: { schoolId: school.id },
      orderBy: { featureName: 'asc' },
    });

    if (records.length === 0) {
      const defaultFeatures = [
        { featureKey: 'smart-subscription', featureName: 'Subscription Management & Renewals', isEnabled: true },
        { featureKey: 'smart-payment-extension', featureName: 'Automated Payment Extension Webhooks', isEnabled: true },
        { featureKey: 'smart-visiting-faculty', featureName: 'Visiting Faculty & Guest Lecturers', isEnabled: true },
        { featureKey: 'smart-india-celebrations', featureName: 'India Day-Wise Celebrations & Reminders', isEnabled: true },
        { featureKey: 'smart-staff-health', featureName: 'Staff Health & Mobile Walking Challenge', isEnabled: true },
        { featureKey: 'smart-lms-opensource', featureName: 'Open-Source LMS Utilization & SCORM', isEnabled: true },
        { featureKey: 'platform-utilization', featureName: 'Platform Utilization Analytics Dashboard', isEnabled: true },
      ];

      for (const f of defaultFeatures) {
        await prisma.smartFeatureToggleHub.create({
          data: { schoolId: school.id, ...f },
        });
      }

      records = await prisma.smartFeatureToggleHub.findMany({
        where: { schoolId: school.id },
        orderBy: { featureName: 'asc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch feature toggles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { id, isEnabled } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }

    const updated = await prisma.smartFeatureToggleHub.update({
      where: { id },
      data: { isEnabled },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update feature toggle status' }, { status: 500 });
  }
}

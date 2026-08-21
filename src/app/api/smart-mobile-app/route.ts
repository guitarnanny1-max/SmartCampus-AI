export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartMobileAppHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { appName: 'SmartCampus Android App (Google Play)', platform: 'ANDROID', version: 'v1.2.0', buildStatus: 'READY', storeStatus: 'LIVE IN STORES', syncedWebpage: 'Unique Portfolios & Hubs' },
        { appName: 'SmartCampus iOS App (Apple App Store)', platform: 'IOS', version: 'v1.2.0', buildStatus: 'READY', storeStatus: 'LIVE IN STORES', syncedWebpage: 'Unique Portfolios & Hubs' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartMobileAppHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartMobileAppHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch mobile app records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { appName, platform, version, syncedWebpage } = await req.json();

    if (!appName) {
      return NextResponse.json({ error: 'App name is required' }, { status: 400 });
    }

    const record = await (prisma as any).smartMobileAppHub.create({
      data: {
        schoolId: school.id,
        appName,
        platform: platform || 'BOTH',
        version: version || 'v1.3.0',
        buildStatus: 'READY',
        storeStatus: 'IN REVIEW',
        syncedWebpage: syncedWebpage || 'All Unique Webpages',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create mobile app release' }, { status: 500 });
  }
}

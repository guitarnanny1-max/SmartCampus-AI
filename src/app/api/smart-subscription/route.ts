export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartSubscriptionHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { planName: 'SmartCampus Enterprise AI Tier', billingCycle: 'Annual', price: '$4,999/yr', status: 'ACTIVE', renewalDate: 'August 16, 2027' },
        { planName: 'Mobile App Store Publisher Add-on', billingCycle: 'Annual', price: '$999/yr', status: 'ACTIVE', renewalDate: 'August 16, 2027' },
        { planName: 'Unlimited Webpage & Theme Studio', billingCycle: 'Monthly', price: '$299/mo', status: 'ACTIVE', renewalDate: 'September 16, 2026' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartSubscriptionHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartSubscriptionHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch subscription records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { planName, billingCycle, price, renewalDate } = await req.json();

    if (!planName) {
      return NextResponse.json({ error: 'Plan name is required' }, { status: 400 });
    }

    const record = await prisma.smartSubscriptionHub.create({
      data: {
        schoolId: school.id,
        planName,
        billingCycle: billingCycle || 'Annual',
        price: price || '$1,499/yr',
        status: 'ACTIVE',
        renewalDate: renewalDate || 'August 16, 2027',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create subscription record' }, { status: 500 });
  }
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartPaymentExtensionHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { invoiceId: 'INV-2026-8821', amountPaid: '$4,999.00', extensionPeriod: '+1 Year', previousRenewal: 'August 16, 2025', newRenewalDate: 'August 16, 2026', paymentGateway: 'Stripe Webhook API', status: 'SUCCESS' },
        { invoiceId: 'INV-2025-4412', amountPaid: '$4,999.00', extensionPeriod: '+1 Year', previousRenewal: 'August 16, 2024', newRenewalDate: 'August 16, 2025', paymentGateway: 'Stripe Webhook API', status: 'SUCCESS' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartPaymentExtensionHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartPaymentExtensionHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch payment extension records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { amountPaid, extensionPeriod, paymentGateway } = await req.json();

    const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const previousRenewal = 'August 16, 2026';
    const newRenewalDate = extensionPeriod === '+1 Month' ? 'September 16, 2026' : 'August 16, 2027';

    const record = await (prisma as any).smartPaymentExtensionHub.create({
      data: {
        schoolId: school.id,
        invoiceId,
        amountPaid: amountPaid || '$4,999.00',
        extensionPeriod: extensionPeriod || '+1 Year',
        previousRenewal,
        newRenewalDate,
        paymentGateway: paymentGateway || 'Stripe Webhook API',
        status: 'SUCCESS',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process payment extension webhook' }, { status: 500 });
  }
}

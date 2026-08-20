export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartPaymentBillingHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { invoiceNumber: 'INV-2026-001', payerName: 'Aarav Sharma', amountInr: 125000.0, paymentGateway: 'Razorpay UPI', billingStatus: 'SUCCESSFUL' },
        { invoiceNumber: 'INV-2026-002', payerName: 'Diya Patel', amountInr: 150000.0, paymentGateway: 'NetBanking (HDFC)', billingStatus: 'SUCCESSFUL' },
        { invoiceNumber: 'INV-2026-003', payerName: 'Kabir Verma', amountInr: 95000.0, paymentGateway: 'Credit Card (Visa)', billingStatus: 'PENDING' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartPaymentBillingHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartPaymentBillingHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch billing records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { invoiceNumber, payerName, amountInr, paymentGateway, billingStatus } = await req.json();

    if (!invoiceNumber || !payerName) {
      return NextResponse.json({ error: 'Invoice number and payer name are required' }, { status: 400 });
    }

    const record = await prisma.smartPaymentBillingHub.create({
      data: {
        schoolId: school.id,
        invoiceNumber,
        payerName,
        amountInr: parseFloat(amountInr) || 50000.0,
        paymentGateway: paymentGateway || 'Razorpay UPI',
        billingStatus: billingStatus || 'SUCCESSFUL',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create billing record' }, { status: 500 });
  }
}

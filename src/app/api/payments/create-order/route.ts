export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { amountInr, description, paymentMethod } = await req.json();

    if (!amountInr || amountInr <= 0) {
      return NextResponse.json({ error: 'Valid INR amount is required' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid123';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret123';

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(parseFloat(amountInr) * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    let orderId = `order_${Date.now()}`;
    try {
      const order = await razorpay.orders.create(options);
      orderId = order.id;
    } catch (err) {
      console.warn('Razorpay test mode fallback triggered:', err);
    }

    const paymentRecord = await prisma.campusPaymentRecord.create({
      data: {
        schoolId: school.id,
        orderId,
        amountInr: parseFloat(amountInr),
        currency: 'INR',
        status: 'PENDING',
        paymentMethod: paymentMethod || 'UPI',
        description: description || 'Campus Fee / Service Payment',
      },
    });

    return NextResponse.json({
      orderId,
      amount: paymentRecord.amountInr,
      currency: paymentRecord.currency,
      keyId: key_id,
      recordId: paymentRecord.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}

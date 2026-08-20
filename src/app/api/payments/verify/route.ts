export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret123';

    // Verify signature if real payment callback
    let isValid = true;
    if (signature && paymentId && !signature.startsWith('mock_sig')) {
      const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');
      isValid = generated_signature === signature;
    }

    if (!isValid) {
      await prisma.campusPaymentRecord.update({
        where: { orderId },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    const updated = await prisma.campusPaymentRecord.update({
      where: { orderId },
      data: {
        paymentId: paymentId || `pay_${Date.now()}`,
        status: 'SUCCESS',
      },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}

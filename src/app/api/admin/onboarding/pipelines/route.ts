import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  try {
    const pipelines = await (prisma as any).schoolOnboardingPipeline.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, pipelines });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

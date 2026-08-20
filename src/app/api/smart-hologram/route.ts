export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let pods = await prisma.smartHologramHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (pods.length === 0) {
      const defaultPods = [
        { podCode: 'HOLO-POD-01', podName: 'Immersive XR Lecture Theater Alpha', holographicFps: 144.0, spatialLatencyMs: 1.8, bandwidthGbps: 35.0, aiImmersiveMode: 'REAL_TIME_VOLUMETRIC_GAUSSIAN_SPLATTING' },
        { podCode: 'HOLO-POD-02', podName: 'Global Remote Collaboration Studio', holographicFps: 120.0, spatialLatencyMs: 2.2, bandwidthGbps: 28.5, aiImmersiveMode: 'NEURAL_RADIANCE_FIELD_RENDERING' },
        { podCode: 'HOLO-POD-03', podName: 'Medical Anatomy Holographic Suite', holographicFps: 90.0, spatialLatencyMs: 3.5, bandwidthGbps: 45.0, aiImmersiveMode: 'SUBLIMINAL_EYE_TRACKING_FOVEATED_RENDER' },
      ];

      for (const p of defaultPods) {
        await prisma.smartHologramHub.create({
          data: { schoolId: school.id, ...p },
        });
      }

      pods = await prisma.smartHologramHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(pods);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch holographic records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { podCode, podName, holographicFps, spatialLatencyMs, bandwidthGbps, aiImmersiveMode } = await req.json();

    if (!podCode || !podName) {
      return NextResponse.json({ error: 'Pod code and name are required' }, { status: 400 });
    }

    const pod = await prisma.smartHologramHub.create({
      data: {
        schoolId: school.id,
        podCode,
        podName,
        holographicFps: parseFloat(holographicFps) || 120.0,
        spatialLatencyMs: parseFloat(spatialLatencyMs) || 2.5,
        bandwidthGbps: parseFloat(bandwidthGbps) || 25.0,
        aiImmersiveMode: aiImmersiveMode || 'REAL_TIME_VOLUMETRIC_GAUSSIAN_SPLATTING',
      },
    });

    return NextResponse.json(pod);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register holographic pod' }, { status: 500 });
  }
}

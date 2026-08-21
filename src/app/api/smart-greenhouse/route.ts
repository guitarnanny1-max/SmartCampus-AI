export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let greenhouses = await (prisma as any).smartGreenhouseBotany.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (greenhouses.length === 0) {
      const defaultGreenhouses = [
        { greenhouseCode: 'GH-BIO-01', greenhouseName: 'Advanced Biotechnology Research Greenhouse', soilNutrientPpm: 680.0, temperatureC: 24.2, humidityPct: 78.0, ledSpectrumMode: 'FULL_SPECTRUM_GROW', aiHealthStatus: 'OPTIMIZED' },
        { greenhouseCode: 'GH-BOT-02', greenhouseName: 'Tropical Flora Conservatory', soilNutrientPpm: 610.5, temperatureC: 28.0, humidityPct: 88.5, ledSpectrumMode: 'VEGETATIVE_BLUE', aiHealthStatus: 'OPTIMIZED' },
        { greenhouseCode: 'GH-AGR-03', greenhouseName: 'Hydroponic Agronomy Lab', soilNutrientPpm: 720.0, temperatureC: 22.5, humidityPct: 65.0, ledSpectrumMode: 'FLOWERING_RED', aiHealthStatus: 'NUTRIENT_BOOST_NEEDED' },
      ];

      for (const g of defaultGreenhouses) {
        await (prisma as any).smartGreenhouseBotany.create({
          data: { schoolId: school.id, ...g },
        });
      }

      greenhouses = await (prisma as any).smartGreenhouseBotany.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(greenhouses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch greenhouse records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { greenhouseCode, greenhouseName, soilNutrientPpm, temperatureC, humidityPct, ledSpectrumMode, aiHealthStatus } = await req.json();

    if (!greenhouseCode || !greenhouseName) {
      return NextResponse.json({ error: 'Greenhouse code and name are required' }, { status: 400 });
    }

    const greenhouse = await (prisma as any).smartGreenhouseBotany.create({
      data: {
        schoolId: school.id,
        greenhouseCode,
        greenhouseName,
        soilNutrientPpm: parseFloat(soilNutrientPpm) || 650.0,
        temperatureC: parseFloat(temperatureC) || 24.5,
        humidityPct: parseFloat(humidityPct) || 75.0,
        ledSpectrumMode: ledSpectrumMode || 'FULL_SPECTRUM_GROW',
        aiHealthStatus: aiHealthStatus || 'OPTIMIZED',
      },
    });

    return NextResponse.json(greenhouse);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register greenhouse' }, { status: 500 });
  }
}

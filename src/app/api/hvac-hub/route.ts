export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let units = await prisma.smartHvacUnit.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (units.length === 0) {
      const defaultUnits = [
        { unitCode: 'HVAC-AUDITORIUM-01', buildingName: 'Main Convocation Hall', targetTempC: 22.0, currentTempC: 22.4, co2Ppm: 450, airQualityIndex: 'EXCELLENT', status: 'OPTIMIZED' },
        { unitCode: 'HVAC-LAB-BIO-03', buildingName: 'Life Sciences Block', targetTempC: 20.5, currentTempC: 21.0, co2Ppm: 580, airQualityIndex: 'GOOD', status: 'OPTIMIZED' },
        { unitCode: 'HVAC-LIBRARY-02', buildingName: 'Central Learning Hub', targetTempC: 23.0, currentTempC: 24.2, co2Ppm: 720, airQualityIndex: 'MODERATE', status: 'ADJUSTING' },
      ];

      for (const u of defaultUnits) {
        await prisma.smartHvacUnit.create({
          data: { schoolId: school.id, ...u },
        });
      }

      units = await prisma.smartHvacUnit.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(units);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch HVAC units' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { unitCode, buildingName, targetTempC, currentTempC, co2Ppm, airQualityIndex, status } = await req.json();

    if (!unitCode || !buildingName) {
      return NextResponse.json({ error: 'Unit code and building name are required' }, { status: 400 });
    }

    const unit = await prisma.smartHvacUnit.create({
      data: {
        schoolId: school.id,
        unitCode,
        buildingName,
        targetTempC: parseFloat(targetTempC) || 22.5,
        currentTempC: parseFloat(currentTempC) || 23.0,
        co2Ppm: parseInt(co2Ppm) || 450,
        airQualityIndex: airQualityIndex || 'EXCELLENT',
        status: status || 'OPTIMIZED',
      },
    });

    return NextResponse.json(unit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create HVAC unit' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let facilities = await prisma.smartWasteManagementHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (facilities.length === 0) {
      const defaultFacilities = [
        { facilityCode: 'WASTE-FAC-01', facilityName: 'Central Autonomous Recycling Nexus', compactionEfficiencyPct: 92.5, energyRecoveryKwh: 450.0, aiSortingOptimizationMode: 'NEURAL_VISION_MATERIAL_CLASSIFICATION' },
        { facilityCode: 'WASTE-FAC-02', facilityName: 'Campus Organic Composting Unit', compactionEfficiencyPct: 78.0, energyRecoveryKwh: 120.0, aiSortingOptimizationMode: 'BIODIGESTION_THERMAL_PREDICTION' },
        { facilityCode: 'WASTE-FAC-03', facilityName: 'Hazardous Materials Containment Bay', compactionEfficiencyPct: 99.9, energyRecoveryKwh: 0.0, aiSortingOptimizationMode: 'ROBOTIC_ISOLATION_PROTOCOL' },
      ];

      for (const f of defaultFacilities) {
        await prisma.smartWasteManagementHub.create({
          data: { schoolId: school.id, ...f },
        });
      }

      facilities = await prisma.smartWasteManagementHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(facilities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch waste management records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { facilityCode, facilityName, compactionEfficiencyPct, energyRecoveryKwh, aiSortingOptimizationMode } = await req.json();

    if (!facilityCode || !facilityName) {
      return NextResponse.json({ error: 'Facility code and name are required' }, { status: 400 });
    }

    const facility = await prisma.smartWasteManagementHub.create({
      data: {
        schoolId: school.id,
        facilityCode,
        facilityName,
        compactionEfficiencyPct: parseFloat(compactionEfficiencyPct) || 80.0,
        energyRecoveryKwh: parseFloat(energyRecoveryKwh) || 100.0,
        aiSortingOptimizationMode: aiSortingOptimizationMode || 'NEURAL_VISION_MATERIAL_CLASSIFICATION',
      },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register facility' }, { status: 500 });
  }
}

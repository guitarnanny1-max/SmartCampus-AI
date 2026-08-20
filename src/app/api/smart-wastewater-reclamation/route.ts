export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let plants = await prisma.smartWastewaterReclamationHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (plants.length === 0) {
      const defaultPlants = [
        { plantCode: 'WW-RECLAIM-01', facilityName: 'Student Residence Greywater Recovery Plant', recycledVolumeLtrs: 18500.0, filtrationEfficiencyPct: 98.5, bodCodStatus: 'LOW_BOD_EXCELLENT', aiReclamationOptimization: 'AUTO_MEMBRANE_FLUSHING' },
        { plantCode: 'WW-RECLAIM-02', facilityName: 'Science Laboratories ZLD Facility', recycledVolumeLtrs: 9400.0, filtrationEfficiencyPct: 99.1, bodCodStatus: 'CHEMICAL_NEUTRALIZED', aiReclamationOptimization: 'UV_STERILIZATION_BOOST' },
        { plantCode: 'WW-RECLAIM-03', facilityName: 'Athletic Stadium Stormwater Drainage Hub', recycledVolumeLtrs: 24000.0, filtrationEfficiencyPct: 97.4, bodCodStatus: 'NORMAL_PURIFICATION', aiReclamationOptimization: 'SEDIMENTATION_BALANCING' },
      ];

      for (const p of defaultPlants) {
        await prisma.smartWastewaterReclamationHub.create({
          data: { schoolId: school.id, ...p },
        });
      }

      plants = await prisma.smartWastewaterReclamationHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(plants);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch wastewater reclamation records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { plantCode, facilityName, recycledVolumeLtrs, filtrationEfficiencyPct, bodCodStatus, aiReclamationOptimization } = await req.json();

    if (!plantCode || !facilityName) {
      return NextResponse.json({ error: 'Plant code and facility name are required' }, { status: 400 });
    }

    const plant = await prisma.smartWastewaterReclamationHub.create({
      data: {
        schoolId: school.id,
        plantCode,
        facilityName,
        recycledVolumeLtrs: parseFloat(recycledVolumeLtrs) || 12500.0,
        filtrationEfficiencyPct: parseFloat(filtrationEfficiencyPct) || 98.2,
        bodCodStatus: bodCodStatus || 'NORMAL_PURIFICATION',
        aiReclamationOptimization: aiReclamationOptimization || 'AUTO_MEMBRANE_FLUSHING',
      },
    });

    return NextResponse.json(plant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register wastewater reclamation plant' }, { status: 500 });
  }
}

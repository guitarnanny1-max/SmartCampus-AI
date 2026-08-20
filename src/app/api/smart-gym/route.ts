export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let equipment = await prisma.smartGymEquipment.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (equipment.length === 0) {
      const defaultEquipment = [
        { equipmentCode: 'GYM-CRD-01', equipmentName: 'AI Peloton Smart Treadmill V4', category: 'CARDIO', zoneName: 'Cardio Mezzanine', occupancyStatus: 'IN_USE', sensorBattery: 88 },
        { equipmentCode: 'GYM-STR-102', equipmentName: 'Biometric Smart Multi-Press Station', category: 'STRENGTH', zoneName: 'Weight Training Arena', occupancyStatus: 'AVAILABLE', sensorBattery: 95 },
        { equipmentCode: 'GYM-ROW-205', category: 'ROWING', equipmentName: 'Hydrow Smart Ergometer Pro', zoneName: 'Aquatic & Cardio Wing', occupancyStatus: 'AVAILABLE', sensorBattery: 92 },
      ];

      for (const e of defaultEquipment) {
        await prisma.smartGymEquipment.create({
          data: { schoolId: school.id, ...e },
        });
      }

      equipment = await prisma.smartGymEquipment.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch smart gym equipment' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { equipmentCode, equipmentName, category, zoneName, occupancyStatus, sensorBattery } = await req.json();

    if (!equipmentCode || !equipmentName) {
      return NextResponse.json({ error: 'Equipment code and name are required' }, { status: 400 });
    }

    const item = await prisma.smartGymEquipment.create({
      data: {
        schoolId: school.id,
        equipmentCode,
        equipmentName,
        category: category || 'CARDIO',
        zoneName: zoneName || 'Main Recreation Hall',
        occupancyStatus: occupancyStatus || 'AVAILABLE',
        sensorBattery: parseInt(sensorBattery) || 90,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register gym equipment' }, { status: 500 });
  }
}

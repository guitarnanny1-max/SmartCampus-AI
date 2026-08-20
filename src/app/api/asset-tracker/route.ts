export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let assets = await prisma.smartAssetTracker.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (assets.length === 0) {
      const defaultAssets = [
        { assetCode: 'AST-SCI-101', assetName: 'Electron Scanning Microscope Unit X', category: 'SCIENTIFIC_EQUIPMENT', buildingName: 'Science & Chemistry Labs Wing', currentRoom: 'Lab 402', batteryPct: 92, status: 'SECURE_IN_ZONE' },
        { assetCode: 'AST-AV-204', assetName: '4K Cinema Production Broadcast Rig', category: 'MULTIMEDIA_GEAR', buildingName: 'Main Auditorium & Stage Wing', currentRoom: 'Media Control Room B', batteryPct: 88, status: 'SECURE_IN_ZONE' },
        { assetCode: 'AST-MED-305', assetName: 'Advanced Portable Ultrasound Scanner', category: 'MEDICAL_HARDWARE', buildingName: 'Campus Medical & Wellness Center', currentRoom: 'Exam Room 3', batteryPct: 64, status: 'GEOFENCE_WARNING' },
      ];

      for (const a of defaultAssets) {
        await prisma.smartAssetTracker.create({
          data: { schoolId: school.id, ...a },
        });
      }

      assets = await prisma.smartAssetTracker.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(assets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch asset tracking records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { assetCode, assetName, category, buildingName, currentRoom, batteryPct, status } = await req.json();

    if (!assetCode || !assetName) {
      return NextResponse.json({ error: 'Asset code and name are required' }, { status: 400 });
    }

    const asset = await prisma.smartAssetTracker.create({
      data: {
        schoolId: school.id,
        assetCode,
        assetName,
        category: category || 'SCIENTIFIC_EQUIPMENT',
        buildingName: buildingName || 'Main Campus Building',
        currentRoom: currentRoom || 'Storage Room 101',
        batteryPct: parseInt(batteryPct) || 90,
        status: status || 'SECURE_IN_ZONE',
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register asset tracker' }, { status: 500 });
  }
}

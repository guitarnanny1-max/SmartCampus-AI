export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let zones = await prisma.smartBiodiversityHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (zones.length === 0) {
      const defaultZones = [
        { zoneCode: 'BIO-ZONE-01', zoneName: 'Botanical Garden & Wetland Sanctuary', wildlifeSpeciesCount: 68, acousticClarityPct: 98.1, habitatRestorationIdx: 94.5, aiAcousticClassification: 'REAL_TIME_SPECIES_AUDIO_EMBEDDING' },
        { zoneCode: 'BIO-ZONE-02', zoneName: 'Central Campus Arboretum Corridor', wildlifeSpeciesCount: 45, acousticClarityPct: 95.8, habitatRestorationIdx: 88.0, aiAcousticClassification: 'AVIAN_SONG_MIGRATION_TRACKING' },
        { zoneCode: 'BIO-ZONE-03', zoneName: 'Riparian Stream & Pollinator Meadow', wildlifeSpeciesCount: 82, acousticClarityPct: 97.4, habitatRestorationIdx: 96.2, aiAcousticClassification: 'INSECT_BIO_ACOUSTIC_INDEXING' },
      ];

      for (const z of defaultZones) {
        await prisma.smartBiodiversityHub.create({
          data: { schoolId: school.id, ...z },
        });
      }

      zones = await prisma.smartBiodiversityHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(zones);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch biodiversity records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { zoneCode, zoneName, wildlifeSpeciesCount, acousticClarityPct, habitatRestorationIdx, aiAcousticClassification } = await req.json();

    if (!zoneCode || !zoneName) {
      return NextResponse.json({ error: 'Zone code and zone name are required' }, { status: 400 });
    }

    const zone = await prisma.smartBiodiversityHub.create({
      data: {
        schoolId: school.id,
        zoneCode,
        zoneName,
        wildlifeSpeciesCount: parseInt(wildlifeSpeciesCount) || 40,
        acousticClarityPct: parseFloat(acousticClarityPct) || 95.0,
        habitatRestorationIdx: parseFloat(habitatRestorationIdx) || 85.0,
        aiAcousticClassification: aiAcousticClassification || 'REAL_TIME_SPECIES_AUDIO_EMBEDDING',
      },
    });

    return NextResponse.json(zone);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register biodiversity zone' }, { status: 500 });
  }
}

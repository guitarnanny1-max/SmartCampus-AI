export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let labs = await prisma.smartSyntheticBiologyHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (labs.length === 0) {
      const defaultLabs = [
        { labCode: 'SYNBIO-LAB-01', labName: 'CRISPR Gene Editing & Synthesis Core', geneSynthesisRateBpPerHour: 25000.0, biosafetyLevel: 3, genomeEditingPrecisionPct: 99.99, aiBiosafetyContainmentMode: 'AUTOMATED_GENOMIC_OFF_TARGET_PREDICTION' },
        { labCode: 'SYNBIO-LAB-02', labName: 'Synthetic Organelle & Protein Foundry', geneSynthesisRateBpPerHour: 18500.5, biosafetyLevel: 2, genomeEditingPrecisionPct: 99.95, aiBiosafetyContainmentMode: 'PROTEIN_FOLDING_STABILITY_MONITOR' },
        { labCode: 'SYNBIO-LAB-03', labName: 'Biosafety Level 4 Containment Unit', geneSynthesisRateBpPerHour: 10000.0, biosafetyLevel: 4, genomeEditingPrecisionPct: 100.0, aiBiosafetyContainmentMode: 'AUTONOMOUS_PATHOGEN_CONTAINMENT_LOCKDOWN' },
      ];

      for (const l of defaultLabs) {
        await prisma.smartSyntheticBiologyHub.create({
          data: { schoolId: school.id, ...l },
        });
      }

      labs = await prisma.smartSyntheticBiologyHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(labs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch synthetic biology records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { labCode, labName, geneSynthesisRateBpPerHour, biosafetyLevel, genomeEditingPrecisionPct, aiBiosafetyContainmentMode } = await req.json();

    if (!labCode || !labName) {
      return NextResponse.json({ error: 'Lab code and name are required' }, { status: 400 });
    }

    const lab = await prisma.smartSyntheticBiologyHub.create({
      data: {
        schoolId: school.id,
        labCode,
        labName,
        geneSynthesisRateBpPerHour: parseFloat(geneSynthesisRateBpPerHour) || 15000.0,
        biosafetyLevel: parseInt(biosafetyLevel) || 3,
        genomeEditingPrecisionPct: parseFloat(genomeEditingPrecisionPct) || 99.9,
        aiBiosafetyContainmentMode: aiBiosafetyContainmentMode || 'AUTOMATED_GENOMIC_OFF_TARGET_PREDICTION',
      },
    });

    return NextResponse.json(lab);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register synthetic biology lab' }, { status: 500 });
  }
}

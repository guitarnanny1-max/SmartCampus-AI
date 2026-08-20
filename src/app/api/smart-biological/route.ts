export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let labs = await prisma.smartBiologicalHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (labs.length === 0) {
      const defaultLabs = [
        { facilityCode: 'BIO-LAB-01', facilityName: 'High-Throughput Genomic Sequencing Core', genomicSequencingSpeedGbps: 120.5, bioSampleCount: 5000, aiResearchOptimizationMode: 'CRISPR_PREDICTIVE_MODELING' },
        { facilityCode: 'BIO-LAB-02', facilityName: 'Synthetic Biology & Protein Folding Suite', genomicSequencingSpeedGbps: 85.2, bioSampleCount: 2400, aiResearchOptimizationMode: 'DEEP_LEARNING_PROTEIN_DYNAMICS' },
        { facilityCode: 'BIO-LAB-03', facilityName: 'Pathogen Surveillance & Analysis Bay', genomicSequencingSpeedGbps: 45.0, bioSampleCount: 1500, aiResearchOptimizationMode: 'AUTOMATED_EPIDEMIOLOGICAL_MODELING' },
      ];

      for (const l of defaultLabs) {
        await prisma.smartBiologicalHub.create({
          data: { schoolId: school.id, ...l },
        });
      }

      labs = await prisma.smartBiologicalHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(labs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch biological research records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { facilityCode, facilityName, genomicSequencingSpeedGbps, bioSampleCount, aiResearchOptimizationMode } = await req.json();

    if (!facilityCode || !facilityName) {
      return NextResponse.json({ error: 'Facility code and name are required' }, { status: 400 });
    }

    const lab = await prisma.smartBiologicalHub.create({
      data: {
        schoolId: school.id,
        facilityCode,
        facilityName,
        genomicSequencingSpeedGbps: parseFloat(genomicSequencingSpeedGbps) || 50.0,
        bioSampleCount: parseInt(bioSampleCount) || 1000,
        aiResearchOptimizationMode: aiResearchOptimizationMode || 'CRISPR_PREDICTIVE_MODELING',
      },
    });

    return NextResponse.json(lab);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register research lab' }, { status: 500 });
  }
}

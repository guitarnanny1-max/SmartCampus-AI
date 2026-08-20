export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let grants = await prisma.researchGrant.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (grants.length === 0) {
      const defaultGrants = [
        { title: 'Quantum Error Correction in Superconducting Qubits', principalInvestigator: 'Dr. Robert Oppenheimer', fundingAgency: 'National Science Foundation (NSF)', budgetAmount: 450000.0, status: 'ACTIVE' },
        { title: 'AI-Driven Carbon Sequestration Modeling in Urban Ecosystems', principalInvestigator: 'Dr. Sarah Thorne', fundingAgency: 'Department of Energy (DOE)', budgetAmount: 320000.0, status: 'ACTIVE' },
        { title: 'Next-Gen Solid-State Lithium Battery Electrolytes', principalInvestigator: 'Dr. Michael Faraday', fundingAgency: 'Advanced Research Projects Agency (ARPA-E)', budgetAmount: 580000.0, status: 'PENDING_REVIEW' },
      ];

      for (const g of defaultGrants) {
        await prisma.researchGrant.create({
          data: { schoolId: school.id, ...g },
        });
      }

      grants = await prisma.researchGrant.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(grants);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch research grants' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { title, principalInvestigator, fundingAgency, budgetAmount, status } = await req.json();

    if (!title || !principalInvestigator || !fundingAgency || !budgetAmount) {
      return NextResponse.json({ error: 'Title, principal investigator, funding agency, and budget amount are required' }, { status: 400 });
    }

    const grant = await prisma.researchGrant.create({
      data: {
        schoolId: school.id,
        title,
        principalInvestigator,
        fundingAgency,
        budgetAmount: parseFloat(budgetAmount),
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json(grant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create research grant' }, { status: 500 });
  }
}

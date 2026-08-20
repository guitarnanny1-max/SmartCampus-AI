export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let leads = await prisma.smartAdmissionCrmHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (leads.length === 0) {
      const defaultLeads = [
        { applicantName: 'Aditya Deshmukh', entranceExamScore: 98.5, targetProgram: 'B.Tech Artificial Intelligence & Data Science', counselorName: 'Rajesh Sharma', leadStatus: 'ENROLLED', contactEmail: 'aditya.d@example.com' },
        { applicantName: 'Ananya Iyer', entranceExamScore: 96.2, targetProgram: 'B.Sc Quantum Physics & Computing', counselorName: 'Sunita Rao', leadStatus: 'COUNSELING', contactEmail: 'ananya.i@example.com' },
        { applicantName: 'Rohan Kulkarni', entranceExamScore: 91.0, targetProgram: 'Bachelor of Business Administration (BBA)', counselorName: 'Vikram Mehta', leadStatus: 'CONTACTED', contactEmail: 'rohan.k@example.com' },
      ];

      for (const l of defaultLeads) {
        await prisma.smartAdmissionCrmHub.create({
          data: { schoolId: school.id, ...l },
        });
      }

      leads = await prisma.smartAdmissionCrmHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(leads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch admission CRM leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { applicantName, entranceExamScore, targetProgram, counselorName, leadStatus, contactEmail } = await req.json();

    if (!applicantName || !contactEmail) {
      return NextResponse.json({ error: 'Applicant name and contact email are required' }, { status: 400 });
    }

    const lead = await prisma.smartAdmissionCrmHub.create({
      data: {
        schoolId: school.id,
        applicantName,
        entranceExamScore: parseFloat(entranceExamScore) || 90.0,
        targetProgram: targetProgram || 'B.Tech Computer Science',
        counselorName: counselorName || 'Default Admission Counselor',
        leadStatus: leadStatus || 'NEW_LEAD',
        contactEmail,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create admission lead' }, { status: 500 });
  }
}

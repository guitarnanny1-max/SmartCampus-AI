export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let departments = await (prisma as any).smartMedicalHospitalHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (departments.length === 0) {
      const defaultDepartments = [
        { departmentCode: 'CARDIO-01', departmentName: 'Cardiology & Cardiothoracic Surgery Ward', hospitalBedsCount: 120, dailyOpdFootfall: 380, residentDoctorsCount: 35, aiDiagnosticMode: 'AI_RADIOLOGY_DIAGNOSTIC_ASSISTANT' },
        { departmentCode: 'ER-02', departmentName: 'Emergency & Trauma Care Center', hospitalBedsCount: 80, dailyOpdFootfall: 620, residentDoctorsCount: 50, aiDiagnosticMode: 'AUTOMATED_TRIAGE_OPTIMIZER' },
        { departmentCode: 'PEDS-03', departmentName: 'Pediatrics & Neonatal Intensive Care', hospitalBedsCount: 100, dailyOpdFootfall: 410, residentDoctorsCount: 30, aiDiagnosticMode: 'PREDICTIVE_BED_OCCUPANCY_FORECASTER' },
      ];

      for (const d of defaultDepartments) {
        await (prisma as any).smartMedicalHospitalHub.create({
          data: { schoolId: school.id, ...d },
        });
      }

      departments = await (prisma as any).smartMedicalHospitalHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch medical department records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { departmentCode, departmentName, hospitalBedsCount, dailyOpdFootfall, residentDoctorsCount, aiDiagnosticMode } = await req.json();

    if (!departmentCode || !departmentName) {
      return NextResponse.json({ error: 'Department code and name are required' }, { status: 400 });
    }

    const department = await (prisma as any).smartMedicalHospitalHub.create({
      data: {
        schoolId: school.id,
        departmentCode,
        departmentName,
        hospitalBedsCount: parseInt(hospitalBedsCount) || 150,
        dailyOpdFootfall: parseInt(dailyOpdFootfall) || 450,
        residentDoctorsCount: parseInt(residentDoctorsCount) || 45,
        aiDiagnosticMode: aiDiagnosticMode || 'AI_RADIOLOGY_DIAGNOSTIC_ASSISTANT',
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register medical department' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'students';
    const school = await getCurrentSchool();

    let csvContent = '';
    let filename = '';

    if (type === 'students') {
      const students = await prisma.student.findMany({ where: { schoolId: school.id } });
      filename = `${school.subdomain}-students-export.csv`;
      csvContent = 'Name,RollNo,CGPA\n' + students.map(s => `"${s.name}","${s.rollNo}",${s.cgpa}`).join('\n');
    } else if (type === 'facilities') {
      const facilities = await prisma.facility.findMany({ where: { schoolId: school.id } });
      filename = `${school.subdomain}-facilities-export.csv`;
      csvContent = 'ZoneName,Solar,HVAC,Status\n' + facilities.map(f => `"${f.zoneName}","${f.solar}","${f.hvac}","${f.status}"`).join('\n');
    } else if (type === 'placements') {
      const placements = await prisma.placement.findMany({ where: { schoolId: school.id } });
      filename = `${school.subdomain}-placements-export.csv`;
      csvContent = 'Company,Role,CTC,Offers\n' + placements.map(p => `"${p.company}","${p.role}","${p.ctc}","${p.offers || ''}"`).join('\n');
    } else {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let logs = await prisma.campusWhatsappLog.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (logs.length === 0) {
      const defaultLogs = [
        { recipientPhone: '+919876543210', recipientName: 'Aarav Sharma (Parent)', templateName: 'FEE_DUE_REMINDER', messageBody: 'Dear Parent, Semester 2 tuition fee of ₹45,000 is due by Friday. Pay securely via UPI/Cards in your portal.', status: 'SENT' },
        { recipientPhone: '+919123456789', recipientName: 'Dr. Priya Nair (Faculty)', templateName: 'EXAM_SCHEDULE_ALERT', messageBody: 'Notice: Mid-term AI & Quantum Computing examination rosters have been published to the faculty dashboard.', status: 'SENT' },
        { recipientPhone: '+919988776655', recipientName: 'Rohan Verma (Student)', templateName: 'CAMPUS_SECURITY_NOTICE', messageBody: 'Alert: Solar Canopy EV Charging Hub maintenance is scheduled for tonight between 12 AM - 4 AM.', status: 'SENT' },
      ];

      for (const l of defaultLogs) {
        await prisma.campusWhatsappLog.create({
          data: { schoolId: school.id, ...l },
        });
      }

      logs = await prisma.campusWhatsappLog.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch WhatsApp history' }, { status: 500 });
  }
}

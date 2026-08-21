export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { name, code, subdomain, email, tier } = body;

    const school = await db.school.create({
      data: {
        name: name || 'Default Campus',
        code: code || 'CAMPUS-' + Math.floor(Math.random() * 1000),
        subdomain: subdomain || 'campus-' + Math.floor(Math.random() * 1000),
        email: email || 'admin@campus.edu',
        tier: tier || 'ENTERPRISE',
        subscriptionTier: 'ENTERPRISE',
        subscriptionStatus: 'ACTIVE',
        maxStudents: 1000,
        placements: {
          create: [
            { company: 'Microsoft', role: 'Cloud Intern', ctc: 95000, package: 95000, offers: 1 },
            { company: 'Google', role: 'AI Engineer', ctc: 145000, package: 145000, offers: 2 },
          ],
        },
        alerts: {
          create: [
            { title: 'Welcome to SmartCampus AI', message: 'System initialized successfully.', severity: 'INFO' }
          ],
        },
      },
    });

    return NextResponse.json({ success: true, school }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

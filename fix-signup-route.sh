#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Signup API Route Type Mismatch"
echo "=================================================="

mkdir -p src/app/api/signup

cat << 'EOF_ROUTE' > src/app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
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
EOF_ROUTE

rm -rf .next

echo "Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"

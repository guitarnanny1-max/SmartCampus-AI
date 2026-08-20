#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Branding API Route Type Error"
echo "=================================================="

mkdir -p src/app/api/settings/branding

cat << 'EOF_ROUTE' > src/app/api/settings/branding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const school = await db.school.findFirst();
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, tagline, logoUrl, primaryColor, accentColor, whiteLabelBrandName, whiteLabelLogoUrl, customDomain } = body;

    const school = await db.school.findFirst();
    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const updated = await db.school.update({
      where: { id: school.id },
      data: {
        name: name !== undefined ? name : school.name,
        tagline: tagline !== undefined ? tagline : (school as any).tagline,
        logoUrl: logoUrl !== undefined ? logoUrl : school.logoUrl,
        primaryColor: primaryColor !== undefined ? primaryColor : (school as any).primaryColor,
        accentColor: accentColor !== undefined ? accentColor : (school as any).accentColor,
        whiteLabelBrandName: whiteLabelBrandName !== undefined ? whiteLabelBrandName : (school as any).whiteLabelBrandName,
        whiteLabelLogoUrl: whiteLabelLogoUrl !== undefined ? whiteLabelLogoUrl : (school as any).whiteLabelLogoUrl,
        customDomain: customDomain !== undefined ? customDomain : (school as any).customDomain,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
EOF_ROUTE

rm -rf .next

echo "Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"

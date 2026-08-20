export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let credentials = await prisma.digitalCredential.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (credentials.length === 0) {
      const defaultCreds = [
        { studentName: 'Alan Turing', rollNo: 'CS-2024-001', credentialTitle: 'Bachelor of Science in Computer Science', credentialType: 'DEGREE', issueHash: '0x8f3c9a1e7b4d2f6...a91c', status: 'VERIFIED' },
        { studentName: 'Ada Lovelace', rollNo: 'MA-2024-088', credentialTitle: 'Master of Science in Artificial Intelligence', credentialType: 'TRANSCRIPT', issueHash: '0x4d2b1e7c9f8a3e6...b42f', status: 'VERIFIED' },
        { studentName: 'Grace Hopper', rollNo: 'SE-2025-014', credentialTitle: 'Advanced Software Engineering Certificate', credentialType: 'CERTIFICATE', issueHash: '0x9e1a4f3d2c7b8e5...c18d', status: 'ISSUED' },
      ];

      for (const cred of defaultCreds) {
        await prisma.digitalCredential.create({
          data: { schoolId: school.id, ...cred },
        });
      }

      credentials = await prisma.digitalCredential.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(credentials);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch digital credentials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, rollNo, credentialTitle, credentialType } = await req.json();

    if (!studentName || !rollNo || !credentialTitle) {
      return NextResponse.json({ error: 'Student name, roll no, and credential title are required' }, { status: 400 });
    }

    const rawData = `${school.id}-${rollNo}-${credentialTitle}-${Date.now()}`;
    const issueHash = `0x${crypto.createHash('sha256').update(rawData).digest('hex')}`;

    const credential = await prisma.digitalCredential.create({
      data: {
        schoolId: school.id,
        studentName,
        rollNo,
        credentialTitle,
        credentialType: credentialType || 'DEGREE',
        issueHash,
        status: 'VERIFIED',
      },
    });

    return NextResponse.json(credential);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to issue digital credential' }, { status: 500 });
  }
}

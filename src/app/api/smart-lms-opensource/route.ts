export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartLmsOpenSourceHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { toolName: 'Open edX Courseware & XBlock Engine', category: 'Open Courseware', version: 'v3.8.4', integrationStatus: 'ACTIVE', repositoryUrl: 'https://github.com/openedx/edx-platform' },
        { toolName: 'Moodle LTI Advantage Plugin Suite', category: 'Moodle Plugin', version: 'v4.1.0', integrationStatus: 'ACTIVE', repositoryUrl: 'https://github.com/moodle/moodle' },
        { toolName: 'Rust-based SCORM 2004 & xAPI Parser', category: 'SCORM/xAPI Engine', version: 'v2.0.5', integrationStatus: 'DEPLOYED', repositoryUrl: 'https://github.com/rust-lms/scorm-xapi-parser' },
        { toolName: 'H5P Interactive Content Authoring Module', category: 'Open Courseware', version: 'v1.26.0', integrationStatus: 'ACTIVE', repositoryUrl: 'https://github.com/h5p/h5p-php-library' },
        { toolName: 'LLM-Powered Open-Source Tutor Agent', category: 'AI Tutor', version: 'v1.5.0', integrationStatus: 'EVALUATING', repositoryUrl: 'https://github.com/smartcampus-ai/open-tutor-agent' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartLmsOpenSourceHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartLmsOpenSourceHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch open-source LMS records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { toolName, category, version, repositoryUrl, integrationStatus } = await req.json();

    if (!toolName) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    const record = await prisma.smartLmsOpenSourceHub.create({
      data: {
        schoolId: school.id,
        toolName,
        category: category || 'SCORM/xAPI Engine',
        version: version || 'v1.0.0',
        repositoryUrl: repositoryUrl || 'https://github.com/open-source-lms/enhancement-core',
        integrationStatus: integrationStatus || 'ACTIVE',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add open-source LMS tool' }, { status: 500 });
  }
}

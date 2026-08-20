export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let labs = await prisma.smartRoboticsLabHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (labs.length === 0) {
      const defaultLabs = [
        { labCode: 'ROBO-LAB-01', labName: 'Advanced Humanoid & Quadruped Robotics Center', activeRobotsCount: 45, payloadCapacityKg: 25.0, neuralGraspSuccessRatePct: 99.6, aiNavigationMode: 'SIMULTANEOUS_LOCALIZATION_AND_MAPPING_VIO' },
        { labCode: 'ROBO-LAB-02', labName: 'Precision Micro-Assembly Robotic Arm Facility', activeRobotsCount: 30, payloadCapacityKg: 5.2, neuralGraspSuccessRatePct: 99.9, aiNavigationMode: 'COMPUTER_VISION_TACTILE_FEEDBACK_GRASP' },
        { labCode: 'ROBO-LAB-03', labName: 'Campus Automated Autonomous Logistics Fleet Hub', activeRobotsCount: 60, payloadCapacityKg: 50.0, neuralGraspSuccessRatePct: 98.8, aiNavigationMode: 'DEEP_REINFORCEMENT_LEARNING_PATHFINDER' },
      ];

      for (const l of defaultLabs) {
        await prisma.smartRoboticsLabHub.create({
          data: { schoolId: school.id, ...l },
        });
      }

      labs = await prisma.smartRoboticsLabHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(labs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch robotics lab records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { labCode, labName, activeRobotsCount, payloadCapacityKg, neuralGraspSuccessRatePct, aiNavigationMode } = await req.json();

    if (!labCode || !labName) {
      return NextResponse.json({ error: 'Lab code and name are required' }, { status: 400 });
    }

    const lab = await prisma.smartRoboticsLabHub.create({
      data: {
        schoolId: school.id,
        labCode,
        labName,
        activeRobotsCount: parseInt(activeRobotsCount) || 35,
        payloadCapacityKg: parseFloat(payloadCapacityKg) || 15.5,
        neuralGraspSuccessRatePct: parseFloat(neuralGraspSuccessRatePct) || 99.4,
        aiNavigationMode: aiNavigationMode || 'SIMULTANEOUS_LOCALIZATION_AND_MAPPING_VIO',
      },
    });

    return NextResponse.json(lab);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register robotics lab' }, { status: 500 });
  }
}

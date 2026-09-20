import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type ClassInput = {
  name: string;
  sections?: string[];
};

type OnboardingBody = {
  subdomain?: string;
  schoolName?: string;
  schoolType?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  academicYear?: {
    name?: string;
    startDate?: string;
    endDate?: string;
  };
  classes?: ClassInput[];
};

function id() {
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OnboardingBody;
    const subdomain = body.subdomain?.trim();

    if (!subdomain) {
      return NextResponse.json(
        { success: false, error: "School workspace is required." },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "School workspace not found." },
        { status: 404 }
      );
    }

    if (tenant.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "School subscription is not active." },
        { status: 403 }
      );
    }

    const schoolName = body.schoolName?.trim();
    const yearName = body.academicYear?.name?.trim();

    if (!schoolName || !yearName) {
      return NextResponse.json(
        {
          success: false,
          error: "School name and academic year are required.",
        },
        { status: 400 }
      );
    }

    const classes = (body.classes ?? [])
      .map((item) => ({
        name: item.name?.trim(),
        sections: (item.sections ?? [])
          .map((section) => section.trim())
          .filter(Boolean),
      }))
      .filter((item) => item.name);

    const result = await prisma.$transaction(
      async (tx) => {
      await tx.tenant.update({
        where: { id: tenant.id },
        data: {
          name: schoolName,
          schoolType: body.schoolType?.trim() || tenant.schoolType,
          contactEmail: body.contactEmail?.trim() || tenant.contactEmail,
          contactPhone: body.contactPhone?.trim() || tenant.contactPhone,
        },
      });

      const existingYear = await tx.academic_years.findFirst({
        where: {
          tenantId: tenant.id,
          name: yearName,
        },
      });

      const academicYear = existingYear
        ? await tx.academic_years.update({
            where: { id: existingYear.id },
            data: {
              start_date: body.academicYear?.startDate
                ? new Date(body.academicYear.startDate)
                : existingYear.start_date,
              end_date: body.academicYear?.endDate
                ? new Date(body.academicYear.endDate)
                : existingYear.end_date,
              status: "ACTIVE",
            },
          })
        : await tx.academic_years.create({
            data: {
              id: id(),
              tenantId: tenant.id,
              name: yearName,
              start_date: body.academicYear?.startDate
                ? new Date(body.academicYear.startDate)
                : null,
              end_date: body.academicYear?.endDate
                ? new Date(body.academicYear.endDate)
                : null,
              status: "ACTIVE",
            },
          });

      for (let index = 0; index < classes.length; index++) {
        const classInput = classes[index];

        const existingClass = await tx.classes.findFirst({
          where: {
            academic_year_id: academicYear.id,
            name: classInput.name,
          },
        });

        const schoolClass = existingClass
          ? await tx.classes.update({
              where: { id: existingClass.id },
              data: {
                display_order: index,
                status: "ACTIVE",
              },
            })
          : await tx.classes.create({
              data: {
                id: id(),
                tenantId: tenant.id,
                academic_year_id: academicYear.id,
                name: classInput.name,
                display_order: index,
                status: "ACTIVE",
              },
            });

        for (let sectionIndex = 0; sectionIndex < classInput.sections.length; sectionIndex++) {
          const sectionName = classInput.sections[sectionIndex];

          const existingSection = await tx.sections.findFirst({
            where: {
              class_id: schoolClass.id,
              name: sectionName,
            },
          });

          if (existingSection) {
            await tx.sections.update({
              where: { id: existingSection.id },
              data: {
                display_order: sectionIndex,
                status: "ACTIVE",
              },
            });
          } else {
            await tx.sections.create({
              data: {
                id: id(),
                tenantId: tenant.id,
                class_id: schoolClass.id,
                name: sectionName,
                display_order: sectionIndex,
                status: "ACTIVE",
              },
            });
          }
        }
      }

      return tx.tenant.update({
        where: { id: tenant.id },
        data: {
          onboardingStatus: "COMPLETED",
        },
      });
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );

    return NextResponse.json({
      success: true,
      school: {
        id: result.id,
        subdomain: result.subdomain,
        name: result.name,
        onboardingStatus: result.onboardingStatus,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to complete onboarding.",
      },
      { status: 500 }
    );
  }
}

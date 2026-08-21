import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrentSchool } from "@/lib/current-school";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type TenantDataBody = {
  type?: unknown;
  zoneName?: unknown;
  solar?: unknown;
  hvac?: unknown;
  status?: unknown;
  name?: unknown;
  rollNo?: unknown;
};

type SchoolWithOptionalTenant = {
  id: string;
  tenantId?: string | null;
};

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const userRole = headerList.get("x-user-role") || "TENANT_ADMIN";

    if (userRole === "VIEWER") {
      return NextResponse.json(
        {
          error: "Permission denied: VIEWER has read-only access",
        },
        { status: 403 }
      );
    }

    const school = await getCurrentSchool();

    const body = (await req.json()) as TenantDataBody;

    const type =
      typeof body.type === "string"
        ? body.type
        : "";

    const zoneName =
      typeof body.zoneName === "string"
        ? body.zoneName.trim()
        : "";

    const solar =
      typeof body.solar === "string"
        ? body.solar
        : "40 kW";

    const hvac =
      typeof body.hvac === "string"
        ? body.hvac
        : "Optimized (22°C)";

    const status =
      typeof body.status === "string"
        ? body.status
        : "Optimal";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const rollNo =
      typeof body.rollNo === "string"
        ? body.rollNo.trim()
        : "";

    if (type === "facility") {
      if (!zoneName) {
        return NextResponse.json(
          {
            error: "Zone name is required",
          },
          { status: 400 }
        );
      }

      const facility = await (
        prisma as typeof prisma & {
          facility: {
            create: (args: {
              data: {
                schoolId: string;
                zoneName: string;
                solar: string;
                hvac: string;
                status: string;
              };
            }) => Promise<unknown>;
          };
        }
      ).facility.create({
        data: {
          schoolId: school.id,
          zoneName,
          solar,
          hvac,
          status,
        },
      });

      return NextResponse.json(facility);
    }

    if (type === "student") {
      if (!name || !rollNo) {
        return NextResponse.json(
          {
            error:
              "Name and roll number are required",
          },
          { status: 400 }
        );
      }

      /*
       * getCurrentSchool() has a fallback school object
       * that does not contain tenantId.
       *
       * Normalize the result before accessing tenantId.
       */
      const schoolContext =
        school as SchoolWithOptionalTenant;

      const tenantId = schoolContext.tenantId;

      if (!tenantId) {
        return NextResponse.json(
          {
            error:
              "A valid tenant workspace is required before creating a student.",
          },
          { status: 400 }
        );
      }

      const student = await prisma.student.create({
        data: {
          tenantId,
          admissionNumber: rollNo,
          name,
          grade: "Grade 10",
          guardianName: "Guardian",
          status: "Active",
          feeStatus: "PENDING",
        },
      });

      return NextResponse.json(student);
    }

    return NextResponse.json(
      {
        error: "Invalid record type",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Tenant data POST error:", error);

    return NextResponse.json(
      {
        error: "Failed to add record",
      },
      { status: 500 }
    );
  }
}

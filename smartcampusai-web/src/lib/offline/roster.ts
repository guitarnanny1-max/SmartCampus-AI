import {
  getStudentsBySection,
  putStudents,
} from "./db";

import type {
  CachedStudent,
} from "./types";

export async function cacheAttendanceRoster(args: {
  tenantId: string;
  classId: string;
  sectionId: string;
  students: Array<{
    id: string;
    name: string | null;
    rollNumber?: string | null;
    grade?: string | null;
    status?: string | null;
  }>;
}): Promise<CachedStudent[]> {
  const cached: CachedStudent[] = args.students.map(
    (student) => ({
      id: student.id,
      tenantId: args.tenantId,
      name: student.name ?? student.id,
      admissionNumber:
        student.rollNumber ?? null,
      classId: args.classId,
      sectionId: args.sectionId,
      updatedAt: new Date().toISOString(),
    }),
  );

  await putStudents(cached);

  return cached;
}

export async function getCachedAttendanceRoster(
  tenantId: string,
  classId: string,
  sectionId: string,
): Promise<CachedStudent[]> {
  return getStudentsBySection(
    tenantId,
    classId,
    sectionId,
  );
}

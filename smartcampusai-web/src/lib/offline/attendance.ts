import {
  putAttendance,
} from "./db";

import {
  enqueueOfflineOperation,
} from "./queue";

import type {
  CachedAttendanceRecord,
  OfflineSource,
} from "./types";

export interface SaveOfflineAttendanceArgs {
  tenantId: string;
  userId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  attendanceDate: string;
  status: "PRESENT" | "ABSENT";
  notes?: string | null;
  source?: OfflineSource;
}

function createLocalAttendanceId(): string {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return `offline_attendance_${crypto.randomUUID()}`;
  }

  return `offline_attendance_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

export async function saveOfflineAttendance(
  args: SaveOfflineAttendanceArgs,
): Promise<CachedAttendanceRecord> {
  const now = new Date().toISOString();

  const record: CachedAttendanceRecord = {
    id: createLocalAttendanceId(),
    tenantId: args.tenantId,
    studentId: args.studentId,
    classId: args.classId,
    sectionId: args.sectionId,
    attendanceDate: args.attendanceDate,
    status: args.status,
    notes: args.notes ?? null,
    source: args.source ?? "MANUAL",
    updatedAt: now,
  };

  await putAttendance(record);

  await enqueueOfflineOperation({
    tenantId: args.tenantId,
    userId: args.userId,
    entityType: "ATTENDANCE",
    operation: "CREATE",
    entityId: record.id,
    payload: record,
  });

  return record;
}

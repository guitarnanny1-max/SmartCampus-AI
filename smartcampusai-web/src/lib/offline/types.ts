export type OfflineEntityType =
  | "ATTENDANCE"
  | "FEE_PAYMENT";

export type OfflineOperationType =
  | "CREATE"
  | "UPDATE"
  | "DELETE";

export type OfflineQueueStatus =
  | "PENDING"
  | "SYNCING"
  | "SYNCED"
  | "FAILED"
  | "CONFLICT";

export type OfflineSource =
  | "RFID"
  | "BIOMETRIC"
  | "QR"
  | "MOBILE"
  | "MANUAL";

export interface OfflineQueueItem {
  id: string;
  operationId: string;
  tenantId: string;
  userId: string;
  deviceId: string;
  entityType: OfflineEntityType;
  operation: OfflineOperationType;
  entityId: string;
  payload: unknown;
  createdAt: string;
  attemptCount: number;
  status: OfflineQueueStatus;
  lastError?: string | null;
  syncedAt?: string | null;
}

export interface OfflineEntitlement {
  tenantId: string;
  plan: string;
  features: string[];
  deviceId: string;
  issuedAt: string;
  expiresAt: string;
  graceUntil: string;
  updatedAt: string;
}

export interface CachedStudent {
  id: string;
  tenantId: string;
  name: string;
  admissionNumber?: string | null;
  classId?: string | null;
  sectionId?: string | null;
  updatedAt?: string | null;
}

export interface CachedFeeDue {
  id: string;
  tenantId: string;
  studentId: string;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate?: string | null;
  status: string;
  updatedAt?: string | null;
}

export interface CachedAttendanceRecord {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  attendanceDate: string;
  status: "PRESENT" | "ABSENT";
  notes?: string | null;
  source: OfflineSource;
  updatedAt: string;
}

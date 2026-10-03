export const FRONT_DESK_PREVIEW_STORAGE_KEY =
  "smartcampus.frontDeskAdmissionPreviews";

export type WalkInVisitor = {
  id: string;
  visitorName: string;
  studentName: string;
  hostName: string;
  purpose: string;
  badgeNo: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  dateOfBirth: string;
  gender: string;
  gradeApplyingFor: string;
  academicYear: string;
  checkedInAt: string;
};

/**
 * Mirrors prisma `AdmissionEnquiry` columns (preview-only, no id/timestamps).
 * Required in schema: studentName, status.
 */
export type AdmissionEnquiryPreview = {
  leadId: string | null;
  tenantId: string | null;
  studentName: string;
  parentName: string | null;
  parentEmail: string | null;
  parentPhone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  gradeApplyingFor: string | null;
  academicYear: string | null;
  source: string;
  status: string;
  notes: string | null;
};

export type FieldMappingRow = {
  sourceField: string;
  sourceValue: string;
  destinationField: keyof AdmissionEnquiryPreview;
  destinationValue: string;
};

export type ConversionValidation = {
  errors: string[];
  warnings: string[];
  duplicates: string[];
};

const ADMISSION_PURPOSE_PATTERN =
  /admission|enquiry|enquir|enroll|enrol|prospect|tour|counsel|campus visit|application/i;

function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isAdmissionRelatedPurpose(purpose: string): boolean {
  return ADMISSION_PURPOSE_PATTERN.test(purpose);
}

export function mapWalkInToAdmissionEnquiry(
  walkIn: WalkInVisitor,
): AdmissionEnquiryPreview {
  const noteParts = [
    walkIn.purpose.trim() ? `Visit purpose: ${walkIn.purpose.trim()}` : null,
    walkIn.hostName.trim() ? `Campus host: ${walkIn.hostName.trim()}` : null,
    walkIn.badgeNo.trim() ? `Badge: ${walkIn.badgeNo.trim()}` : null,
  ].filter((part): part is string => Boolean(part));

  return {
    leadId: null,
    tenantId: null,
    studentName: walkIn.studentName.trim(),
    parentName: blankToNull(walkIn.parentName),
    parentEmail: blankToNull(walkIn.parentEmail),
    parentPhone: blankToNull(walkIn.parentPhone),
    dateOfBirth: blankToNull(walkIn.dateOfBirth),
    gender: blankToNull(walkIn.gender),
    gradeApplyingFor: blankToNull(walkIn.gradeApplyingFor),
    academicYear: blankToNull(walkIn.academicYear),
    source: "FRONT_DESK",
    status: "NEW",
    notes: noteParts.length > 0 ? noteParts.join(" | ") : null,
  };
}

export function buildFieldMappings(
  walkIn: WalkInVisitor,
  enquiry: AdmissionEnquiryPreview,
): FieldMappingRow[] {
  return [
    {
      sourceField: "studentName",
      sourceValue: walkIn.studentName || "—",
      destinationField: "studentName",
      destinationValue: enquiry.studentName || "—",
    },
    {
      sourceField: "parentName",
      sourceValue: walkIn.parentName || "—",
      destinationField: "parentName",
      destinationValue: enquiry.parentName || "—",
    },
    {
      sourceField: "parentEmail",
      sourceValue: walkIn.parentEmail || "—",
      destinationField: "parentEmail",
      destinationValue: enquiry.parentEmail || "—",
    },
    {
      sourceField: "parentPhone",
      sourceValue: walkIn.parentPhone || "—",
      destinationField: "parentPhone",
      destinationValue: enquiry.parentPhone || "—",
    },
    {
      sourceField: "dateOfBirth",
      sourceValue: walkIn.dateOfBirth || "—",
      destinationField: "dateOfBirth",
      destinationValue: enquiry.dateOfBirth || "—",
    },
    {
      sourceField: "gender",
      sourceValue: walkIn.gender || "—",
      destinationField: "gender",
      destinationValue: enquiry.gender || "—",
    },
    {
      sourceField: "gradeApplyingFor",
      sourceValue: walkIn.gradeApplyingFor || "—",
      destinationField: "gradeApplyingFor",
      destinationValue: enquiry.gradeApplyingFor || "—",
    },
    {
      sourceField: "academicYear",
      sourceValue: walkIn.academicYear || "—",
      destinationField: "academicYear",
      destinationValue: enquiry.academicYear || "—",
    },
    {
      sourceField: "(constant)",
      sourceValue: "FRONT_DESK",
      destinationField: "source",
      destinationValue: enquiry.source,
    },
    {
      sourceField: "(constant)",
      sourceValue: "NEW",
      destinationField: "status",
      destinationValue: enquiry.status,
    },
    {
      sourceField: "purpose + hostName + badgeNo",
      sourceValue: [walkIn.purpose, walkIn.hostName, walkIn.badgeNo]
        .filter((value) => value.trim())
        .join(" / ") || "—",
      destinationField: "notes",
      destinationValue: enquiry.notes || "—",
    },
    {
      sourceField: "(not mapped)",
      sourceValue: "—",
      destinationField: "leadId",
      destinationValue: enquiry.leadId || "null",
    },
    {
      sourceField: "(not mapped)",
      sourceValue: "—",
      destinationField: "tenantId",
      destinationValue: enquiry.tenantId || "null",
    },
  ];
}

export function walkInDuplicateKey(walkIn: WalkInVisitor): string {
  return `${normalizeKey(walkIn.visitorName)}|${normalizeKey(walkIn.parentPhone)}`;
}

export function enquiryDuplicateKey(enquiry: AdmissionEnquiryPreview): string {
  return `${normalizeKey(enquiry.studentName)}|${normalizeKey(enquiry.parentPhone || "")}`;
}

export function validateConversionPreview(
  walkIn: WalkInVisitor,
  enquiry: AdmissionEnquiryPreview,
  otherWalkIns: WalkInVisitor[],
  existingPreviews: AdmissionEnquiryPreview[],
): ConversionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const duplicates: string[] = [];

  if (!enquiry.studentName) {
    errors.push("Student name is required before confirming an admissions preview.");
  }

  if (!walkIn.purpose.trim()) {
    errors.push("Visit purpose is required before converting a walk-in.");
  }

  if (enquiry.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.parentEmail)) {
    errors.push("parentEmail must be a valid email address.");
  }

  if (!enquiry.gradeApplyingFor) {
    warnings.push("gradeApplyingFor is empty. Admissions teams usually need a target grade.");
  }

  if (!enquiry.parentPhone && !enquiry.parentEmail) {
    warnings.push("No parentPhone or parentEmail mapped. Follow-up will be harder.");
  }

  if (walkIn.purpose.trim() && !isAdmissionRelatedPurpose(walkIn.purpose)) {
    warnings.push(
      "Purpose does not look like an admissions enquiry. Confirm before treating this as a conversion.",
    );
  }

  const currentKey = walkInDuplicateKey(walkIn);
  const walkInDupes = otherWalkIns.filter(
    (item) => walkInDuplicateKey(item) === currentKey && currentKey !== "|",
  );
  if (walkInDupes.length > 0) {
    duplicates.push(
      `Another walk-in already uses the same student name and parent phone (${walkIn.visitorName}).`,
    );
  }

  const previewDupes = existingPreviews.filter(
    (item) => enquiryDuplicateKey(item) === enquiryDuplicateKey(enquiry) && enquiry.studentName,
  );
  if (previewDupes.length > 0) {
    duplicates.push(
      "A Front Desk conversion preview with this student name and parent phone is already confirmed in this browser session.",
    );
  }

  return { errors, warnings, duplicates };
}

export function readStoredPreviews(): AdmissionEnquiryPreview[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(FRONT_DESK_PREVIEW_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as AdmissionEnquiryPreview[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredPreviews(previews: AdmissionEnquiryPreview[]): void {
  window.sessionStorage.setItem(
    FRONT_DESK_PREVIEW_STORAGE_KEY,
    JSON.stringify(previews),
  );
}

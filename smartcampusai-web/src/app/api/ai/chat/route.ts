import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

type Student = {
  id: string;
  name: string | null;
  rollNumber: string | null;
  grade: string | null;
  parentEmail: string | null;
  status: string | null;
};

type Enrollment = {
  id: string;
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string | null;
  roll_number: string | null;
  status: string | null;
  enrolled_at: string | null;
};

type ClassRecord = {
  id: string;
  name: string | null;
};

type SectionRecord = {
  id: string;
  class_id: string;
  name: string | null;
};

type AcademicYear = {
  id: string;
  name: string | null;
  status: string | null;
};

type SchoolContext = {
  school: {
    tenantId: string;
    administrator: {
      name: string | null;
      role: string | null;
    };
  };
  students: {
    total: number;
    active: number;
  };
  teachers: {
    total: number;
    active: number;
  };
  fees: {
    assignedTotal: number;
    collectedTotal: number;
    outstandingAmount: number;
    outstandingCount: number;
  };
  payments: {
    completedCount: number;
    totalCollected: number;
  };
  exams: {
    total: number;
    upcoming: Array<{
      id: string;
      name: string;
      exam_type: string | null;
      start_date: string | null;
      end_date: string | null;
      status: string | null;
    }>;
  };
  studentDirectory: {
    students: Student[];
    enrollments: Enrollment[];
    classes: ClassRecord[];
    sections: SectionRecord[];
    academicYears: AcademicYear[];
  };
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string | null) {
  if (!value) {
    return "date not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractStudentSearchTerm(message: string) {
  const cleaned = message
    .replace(/[?!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const patterns = [
    /\btell me about\s+(.+)$/i,
    /\bshow me\s+(.+)$/i,
    /\bfind\s+(.+)$/i,
    /\bsearch for\s+(.+)$/i,
    /\blookup\s+(.+)$/i,
    /\blook up\s+(.+)$/i,
    /\bdetails for\s+(.+)$/i,
    /\bdetails of\s+(.+)$/i,
    /\binformation about\s+(.+)$/i,
    /\binformation on\s+(.+)$/i,
    /\bprofile of\s+(.+)$/i,
    /\babout\s+student\s+(.+)$/i,
    /\babout\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function looksLikeStudentQuestion(message: string) {
  const q = message.toLowerCase();

  return (
    /\b(student|pupil|child|children)\b/.test(q) &&
    (
      /\b(who|what|which|find|search|show|tell|details|profile|information|grade|class|section|roll|status|parent)\b/.test(
        q
      ) ||
      /\b(name)\b/.test(q)
    )
  );
}

function answerStudentQuestion(
  message: string,
  students: Student[],
  enrollments: Enrollment[],
  classes: ClassRecord[],
  sections: SectionRecord[],
  academicYears: AcademicYear[]
): string | null {
  const q = message.toLowerCase();

  const searchTerm = extractStudentSearchTerm(message);

  if (!searchTerm && !looksLikeStudentQuestion(message)) {
    return null;
  }

  let matches: Student[] = [];

  if (searchTerm) {
    const normalizedSearch = normalize(searchTerm);

    if (normalizedSearch) {
      matches = students.filter((student) => {
        const studentName = normalize(student.name ?? "");
        const rollNumber = normalize(student.rollNumber ?? "");
        const grade = normalize(student.grade ?? "");

        return (
          studentName.includes(normalizedSearch) ||
          rollNumber.includes(normalizedSearch) ||
          grade === normalizedSearch
        );
      });
    }
  } else if (students.length === 1) {
    matches = students;
  }

  if (matches.length === 0) {
    if (searchTerm) {
      return `I couldn't find a student matching "${searchTerm}" in this school. Please check the student's name or roll number.`;
    }

    return "Please provide the student's name or roll number so I can look up the correct student.";
  }

  if (matches.length > 1) {
    const names = matches
      .slice(0, 8)
      .map(
        (student) =>
          `${student.name ?? "Unnamed student"}${
            student.rollNumber
              ? ` (${student.rollNumber})`
              : ""
          }`
      )
      .join(", ");

    return `I found multiple students matching your request: ${names}. Please provide the student's full name or roll number so I don't choose the wrong student.`;
  }

  const student = matches[0];

  const studentEnrollments = enrollments
    .filter((enrollment) => enrollment.student_id === student.id)
    .sort((a, b) => {
      const aDate = a.enrolled_at
        ? new Date(a.enrolled_at).getTime()
        : 0;

      const bDate = b.enrolled_at
        ? new Date(b.enrolled_at).getTime()
        : 0;

      return bDate - aDate;
    });

  const enrollment = studentEnrollments[0];

  const classRecord = enrollment
    ? classes.find((item) => item.id === enrollment.class_id)
    : null;

  const sectionRecord = enrollment?.section_id
    ? sections.find((item) => item.id === enrollment.section_id)
    : null;

  const academicYear = enrollment
    ? academicYears.find(
        (item) => item.id === enrollment.academic_year_id
      )
    : null;

  const requestedParentEmail =
    /\b(parent|guardian|email)\b/.test(q);

  const requestedGrade = /\b(grade|class)\b/.test(q);
  const requestedRoll = /\b(roll|roll number|admission number)\b/.test(
    q
  );
  const requestedStatus = /\b(status|active|inactive)\b/.test(q);
  const requestedSection = /\b(section)\b/.test(q);

  const details: string[] = [
    `**${student.name ?? "Unnamed student"}**`,
  ];

  if (requestedGrade || !requestedSection) {
    details.push(`Grade: ${student.grade ?? "Not available"}`);
  }

  if (enrollment && (requestedGrade || !requestedSection)) {
    details.push(
      `Class: ${classRecord?.name ?? student.grade ?? "Not available"}`
    );
  }

  if (requestedSection || sectionRecord) {
    details.push(
      `Section: ${sectionRecord?.name ?? "Not assigned"}`
    );
  }

  if (requestedRoll || !requestedGrade) {
    details.push(
      `Roll Number: ${
        enrollment?.roll_number ??
        student.rollNumber ??
        "Not available"
      }`
    );
  }

  if (requestedStatus || !requestedParentEmail) {
    details.push(
      `Status: ${student.status ?? "Not available"}`
    );
  }

  if (academicYear) {
    details.push(`Academic Year: ${academicYear.name}`);
  }

  if (requestedParentEmail) {
    details.push(
      `Parent Email: ${student.parentEmail ?? "Not available"}`
    );
  }

  return details.join("\n");
}

function answerFromContext(
  message: string,
  context: SchoolContext
): string | null {
  const q = message.toLowerCase().trim();

  const asksStudents =
    /\b(student|students|pupil|pupils|children|child)\b/.test(q);

  const asksTeachers =
    /\b(teacher|teachers|staff|faculty)\b/.test(q);

  const asksFees =
    /\b(fee|fees|finance|financial|collection|collections|collected|outstanding|dues|due|payment|payments)\b/.test(
      q
    );

  const asksExams =
    /\b(exam|exams|examination|examinations|test|tests)\b/.test(q);

  const asksUpcoming =
    /\b(upcoming|next|scheduled|schedule)\b/.test(q);

  const asksTotal =
    /\b(how many|count|number|total)\b/.test(q);

  const asksActive =
    /\b(active|currently active)\b/.test(q);

  if (asksStudents && (asksTotal || asksActive)) {
    if (asksActive) {
      return `There are ${context.students.active} active students out of ${context.students.total} total students.`;
    }

    return `The school currently has ${context.students.total} students, including ${context.students.active} active students.`;
  }

  if (asksTeachers && (asksTotal || asksActive)) {
    if (asksActive) {
      return `There are ${context.teachers.active} active teachers out of ${context.teachers.total} total teachers.`;
    }

    return `The school currently has ${context.teachers.total} teachers, including ${context.teachers.active} active teachers.`;
  }

  if (asksFees) {
    if (/\b(outstanding|dues|due)\b/.test(q)) {
      return `Outstanding fees are ${formatCurrency(
        context.fees.outstandingAmount
      )} across ${context.fees.outstandingCount} fee records.`;
    }

    if (
      /\b(collected|collection|collections|received)\b/.test(q)
    ) {
      return `The school has collected ${formatCurrency(
        context.fees.collectedTotal
      )} through ${context.payments.completedCount} completed payments.`;
    }

    if (
      /\b(assigned|assessed|total fees|total fee)\b/.test(q)
    ) {
      return `The total assigned fee value is ${formatCurrency(
        context.fees.assignedTotal
      )}.`;
    }

    return `Fee summary: ${formatCurrency(
      context.fees.collectedTotal
    )} collected, ${formatCurrency(
      context.fees.outstandingAmount
    )} outstanding, with ${context.fees.outstandingCount} outstanding fee records.`;
  }

  if (asksExams) {
    if (asksUpcoming || q.includes("next exam")) {
      if (context.exams.upcoming.length === 0) {
        return "There are no scheduled or published upcoming exams in the current school data.";
      }

      const exams = context.exams.upcoming
        .slice(0, 5)
        .map(
          (exam) =>
            `${exam.name} — ${formatDate(
              exam.start_date
            )} to ${formatDate(exam.end_date)}`
        )
        .join("\n");

      return `Upcoming exams:\n${exams}`;
    }

    return `There are ${context.exams.total} exams in the current school data, including ${context.exams.upcoming.length} scheduled or published exams.`;
  }

  if (
    /\b(summary|overview|dashboard|status|school status|how are we doing)\b/.test(
      q
    )
  ) {
    return [
      "Here is the current school overview:",
      "",
      `• Students: ${context.students.total} total (${context.students.active} active)`,
      `• Teachers: ${context.teachers.total} total (${context.teachers.active} active)`,
      `• Fees assigned: ${formatCurrency(context.fees.assignedTotal)}`,
      `• Fees collected: ${formatCurrency(context.fees.collectedTotal)}`,
      `• Fees outstanding: ${formatCurrency(context.fees.outstandingAmount)}`,
      `• Outstanding fee records: ${context.fees.outstandingCount}`,
      `• Completed payments: ${context.payments.completedCount}`,
      `• Upcoming exams: ${context.exams.upcoming.length}`,
    ].join("\n");
  }

  if (
    /\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(
      q
    )
  ) {
    const name = context.school.administrator.name;

    return `Hello${
      name ? ` ${name}` : ""
    }! I'm SmartCampusAI. I can currently help with your school's student, teacher, fee, payment, and examination information.`;
  }

  return null;
}

async function getAuthenticatedContext(): Promise<{
  context?: SchoolContext;
  error?: Response;
}> {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: Response.json(
        {
          success: false,
          error: "Supabase configuration is incomplete.",
        },
        { status: 500 }
      ),
    };
  }

  const supabase = createServerClient(
    supabaseUrl,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Read-only request context.
          }
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return {
      error: Response.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      ),
    };
  }

  const admin = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: appUser, error: appUserError } = await admin
    .from("User")
    .select('id, "tenantId", email, name, role')
    .eq("email", user.email)
    .maybeSingle();

  if (appUserError) {
    console.error("AI user lookup error:", appUserError);

    return {
      error: Response.json(
        {
          success: false,
          error: "Unable to verify your account.",
        },
        { status: 500 }
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: Response.json(
        {
          success: false,
          error: "Your account is not associated with a school.",
        },
        { status: 403 }
      ),
    };
  }

  const tenantId = appUser.tenantId as string;

  const [
    studentsResult,
    teachersResult,
    feesResult,
    paymentsResult,
    allocationsResult,
    examsResult,
    enrollmentsResult,
    classesResult,
    sectionsResult,
    academicYearsResult,
  ] = await Promise.all([
    admin
      .from("Student")
      .select(
        'id, name, "rollNumber", grade, "parentEmail", status'
      )
      .eq("tenantId", tenantId),

    admin
      .from("Staff")
      .select("id, name, status")
      .eq("tenantId", tenantId)
      .eq("role", "Teacher"),

    admin
      .from("student_fees")
      .select(
        "id, student_id, amount, discount_amount, net_amount, due_date, status"
      )
      .eq("tenantId", tenantId),

    admin
      .from("fee_payments")
      .select(
        "id, student_id, payment_date, amount, payment_method, status"
      )
      .eq("tenantId", tenantId)
      .eq("status", "COMPLETED"),

    admin
      .from("fee_payment_allocations")
      .select("id, payment_id, student_fee_id, amount")
      .eq("tenantId", tenantId),

    admin
      .from("exams")
      .select(
        "id, name, exam_type, start_date, end_date, status"
      )
      .eq("tenantId", tenantId)
      .order("start_date", { ascending: true }),

    admin
      .from("student_enrollments")
      .select(
        'id, "tenantId", student_id, academic_year_id, class_id, section_id, roll_number, status, enrolled_at'
      )
      .eq("tenantId", tenantId)
      .order("enrolled_at", { ascending: false }),

    admin
      .from("classes")
      .select("id, name")
      .eq("tenantId", tenantId),

    admin
      .from("sections")
      .select("id, class_id, name")
      .eq("tenantId", tenantId),

    admin
      .from("academic_years")
      .select('id, "tenantId", name, status')
      .eq("tenantId", tenantId),
  ]);

  if (studentsResult.error) {
    throw new Error(`Students: ${studentsResult.error.message}`);
  }

  if (teachersResult.error) {
    throw new Error(`Teachers: ${teachersResult.error.message}`);
  }

  if (feesResult.error) {
    throw new Error(`Fees: ${feesResult.error.message}`);
  }

  if (paymentsResult.error) {
    throw new Error(`Payments: ${paymentsResult.error.message}`);
  }

  if (allocationsResult.error) {
    throw new Error(
      `Payment allocations: ${allocationsResult.error.message}`
    );
  }

  if (examsResult.error) {
    throw new Error(`Exams: ${examsResult.error.message}`);
  }

  if (enrollmentsResult.error) {
    throw new Error(
      `Student enrollments: ${enrollmentsResult.error.message}`
    );
  }

  if (classesResult.error) {
    throw new Error(`Classes: ${classesResult.error.message}`);
  }

  if (sectionsResult.error) {
    throw new Error(`Sections: ${sectionsResult.error.message}`);
  }

  if (academicYearsResult.error) {
    throw new Error(
      `Academic years: ${academicYearsResult.error.message}`
    );
  }

  const students = (studentsResult.data ?? []) as Student[];
  const teachers = teachersResult.data ?? [];
  const fees = feesResult.data ?? [];
  const payments = paymentsResult.data ?? [];
  const allocations = allocationsResult.data ?? [];
  const exams = examsResult.data ?? [];

  const enrollments =
    (enrollmentsResult.data ?? []) as Enrollment[];

  const classes =
    (classesResult.data ?? []) as ClassRecord[];

  const sections =
    (sectionsResult.data ?? []) as SectionRecord[];

  const academicYears =
    (academicYearsResult.data ?? []) as AcademicYear[];

  const completedPaymentIds = new Set(
    payments.map((payment) => payment.id)
  );

  const paidByFee = new Map<string, number>();

  for (const allocation of allocations) {
    if (!completedPaymentIds.has(allocation.payment_id)) {
      continue;
    }

    const current =
      paidByFee.get(allocation.student_fee_id) ?? 0;

    paidByFee.set(
      allocation.student_fee_id,
      current + Number(allocation.amount ?? 0)
    );
  }

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  const totalTeachers = teachers.length;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "ACTIVE"
  ).length;

  const totalAssignedFees = fees.reduce(
    (sum, fee) => sum + Number(fee.net_amount ?? 0),
    0
  );

  const totalCollected = payments.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  const feeBalances = fees.map((fee) => {
    const netAmount = Number(fee.net_amount ?? 0);
    const paidAmount = paidByFee.get(fee.id) ?? 0;

    return {
      ...fee,
      paidAmount,
      outstandingAmount: Math.max(
        0,
        netAmount - paidAmount
      ),
    };
  });

  const outstandingFees = feeBalances.filter(
    (fee) => fee.outstandingAmount > 0
  );

  const outstandingAmount = outstandingFees.reduce(
    (sum, fee) => sum + fee.outstandingAmount,
    0
  );

  return {
    context: {
      school: {
        tenantId,
        administrator: {
          name: appUser.name,
          role: appUser.role,
        },
      },

      students: {
        total: totalStudents,
        active: activeStudents,
      },

      teachers: {
        total: totalTeachers,
        active: activeTeachers,
      },

      fees: {
        assignedTotal: totalAssignedFees,
        collectedTotal: totalCollected,
        outstandingAmount,
        outstandingCount: outstandingFees.length,
      },

      payments: {
        completedCount: payments.length,
        totalCollected,
      },

      exams: {
        total: exams.length,
        upcoming: exams.filter(
          (exam) =>
            exam.status === "SCHEDULED" ||
            exam.status === "PUBLISHED"
        ),
      },

      studentDirectory: {
        students,
        enrollments,
        classes,
        sections,
        academicYears,
      },
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return Response.json(
        {
          success: false,
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return Response.json(
        {
          success: false,
          error:
            "Message is too long. Maximum 4000 characters.",
        },
        { status: 400 }
      );
    }

    const result = await getAuthenticatedContext();

    if (result.error) {
      return result.error;
    }

    const context = result.context!;

    const studentAnswer = answerStudentQuestion(
      message,
      context.studentDirectory.students,
      context.studentDirectory.enrollments,
      context.studentDirectory.classes,
      context.studentDirectory.sections,
      context.studentDirectory.academicYears
    );

    if (studentAnswer) {
      return Response.json({
        success: true,
        answer: studentAnswer,
        source: "school-data",
      });
    }

    const answer = answerFromContext(message, context);

    if (answer) {
      return Response.json({
        success: true,
        answer,
        source: "school-data",
      });
    }

    return Response.json({
      success: true,
      answer:
        "I can currently answer questions about students, teachers, fees, payments, and exams using your school's live data. Try asking: \"Tell me about John Test\", \"How many students do we have?\", \"How much fee is outstanding?\", or \"What are the upcoming exams?\"",
      source: "school-data",
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to process your AI request.",
      },
      { status: 500 }
    );
  }
}

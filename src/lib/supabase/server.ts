import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const mockStudents = [
  {
    student_id: "s1",
    admission_number: "ADM001",
    first_name: "John",
    middle_name: "",
    last_name: "Test",
    dob: "2005-04-12",
    gender: "Male",
    status: "Active",
    created_at: "2026-01-10T00:00:00.000Z"
  },
  {
    student_id: "s2",
    admission_number: "ADM002",
    first_name: "Alice",
    middle_name: "M",
    last_name: "Johnson",
    dob: "2006-08-22",
    gender: "Female",
    status: "Active",
    created_at: "2026-02-15T00:00:00.000Z"
  },
  {
    student_id: "s3",
    admission_number: "ADM003",
    first_name: "Bob",
    middle_name: "",
    last_name: "Smith",
    dob: "2005-11-05",
    gender: "Male",
    status: "Active",
    created_at: "2026-02-20T00:00:00.000Z"
  },
  {
    student_id: "s4",
    admission_number: "ADM004",
    first_name: "Charlie",
    middle_name: "D",
    last_name: "Davis",
    dob: "2004-03-19",
    gender: "Male",
    status: "Active",
    created_at: "2026-03-01T00:00:00.000Z"
  },
  {
    student_id: "s5",
    admission_number: "ADM005",
    first_name: "Diana",
    middle_name: "",
    last_name: "Prince",
    dob: "2006-01-30",
    gender: "Female",
    status: "Active",
    created_at: "2026-03-05T00:00:00.000Z"
  }
];

const mockLeads = [
  { id: "l1", name: "Ethan Hunt", email: "ethan@example.com", status: "New" },
  { id: "l2", name: "Fiona Gallagher", email: "fiona@example.com", status: "Contacted" },
  { id: "l3", name: "George Bailey", email: "george@example.com", status: "Tour Scheduled" }
];

const createQueryBuilder = (initialData: any[]) => {
  let currentData = [...initialData];

  const builder: any = {
    select: (columns?: string) => builder,
    eq: (column: string, value: any) => {
      currentData = currentData.filter(item => item[column] === value);
      return builder;
    },
    order: (column: string, options?: { ascending?: boolean }) => {
      currentData.sort((a, b) => {
        if (a[column] < b[column]) return options?.ascending ? -1 : 1;
        if (a[column] > b[column]) return options?.ascending ? 1 : -1;
        return 0;
      });
      return builder;
    },
    single: async () => ({ data: currentData[0] || null, error: null }),
    insert: async (val: any) => ({ data: val, error: null }),
    update: async (val: any) => ({ data: val, error: null }),
    delete: async () => ({ data: null, error: null }),
    then: (onFulfilled: any, onRejected: any) => {
      return Promise.resolve({ data: currentData, error: null, count: currentData.length }).then(onFulfilled, onRejected);
    }
  };
  return builder;
};

const mockClient: any = {
  from: (table: string) => {
    let data: any[] = [];
    if (table === "students") data = mockStudents;
    if (table === "leads") data = mockLeads;
    return createQueryBuilder(data);
  },
  auth: {
    getUser: async () => ({ data: { user: { email: "admin@globalsmartcampus.edu" } }, error: null }),
  }
};

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.startsWith("#") || url.includes("your-supabase")) {
    return mockClient;
  }

  const cookieStore = await cookies();
  return createServerClient(url, key, {
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
          // Server Component context
        }
      },
    },
  });
}

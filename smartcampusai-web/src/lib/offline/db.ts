import type {
  CachedAttendanceRecord,
  CachedFeeDue,
  CachedStudent,
  OfflineEntitlement,
  OfflineQueueItem,
} from "./types";

const DB_NAME = "smartcampusai-offline";
const DB_VERSION = 1;

export const STORES = {
  students: "students",
  feeDues: "fee_dues",
  attendance: "attendance",
  queue: "sync_queue",
  entitlement: "entitlement",
} as const;

function ensureBrowser() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    throw new Error("IndexedDB is not available in this environment.");
  }
}

function openDatabase(): Promise<IDBDatabase> {
  ensureBrowser();

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(
        request.error ??
          new Error("Unable to open the offline database."),
      );
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORES.students)) {
        const store = db.createObjectStore(STORES.students, {
          keyPath: "id",
        });

        store.createIndex("tenantId", "tenantId", {
          unique: false,
        });

        store.createIndex("classId", "classId", {
          unique: false,
        });

        store.createIndex("sectionId", "sectionId", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(STORES.feeDues)) {
        const store = db.createObjectStore(STORES.feeDues, {
          keyPath: "id",
        });

        store.createIndex("tenantId", "tenantId", {
          unique: false,
        });

        store.createIndex("studentId", "studentId", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(STORES.attendance)) {
        const store = db.createObjectStore(STORES.attendance, {
          keyPath: "id",
        });

        store.createIndex("tenantId", "tenantId", {
          unique: false,
        });

        store.createIndex("studentId", "studentId", {
          unique: false,
        });

        store.createIndex(
          "attendanceDate",
          "attendanceDate",
          {
            unique: false,
          },
        );
      }

      if (!db.objectStoreNames.contains(STORES.queue)) {
        const store = db.createObjectStore(STORES.queue, {
          keyPath: "id",
        });

        store.createIndex(
          "operationId",
          "operationId",
          {
            unique: true,
          },
        );

        store.createIndex("tenantId", "tenantId", {
          unique: false,
        });

        store.createIndex("status", "status", {
          unique: false,
        });

        store.createIndex("entityType", "entityType", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(STORES.entitlement)) {
        db.createObjectStore(STORES.entitlement, {
          keyPath: "tenantId",
        });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        db.close();
      };

      resolve(db);
    };
  });
}

function requestToPromise<T>(
  request: IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(
        request.error ??
          new Error("IndexedDB request failed."),
      );
    };
  });
}

export async function putStudent(
  student: CachedStudent,
): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.students,
      "readwrite",
    );

    transaction.objectStore(STORES.students).put(student);

    await requestToPromise(transaction.objectStore(STORES.students).get(student.id));
  } finally {
    db.close();
  }
}

export async function putStudents(
  students: CachedStudent[],
): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.students,
      "readwrite",
    );

    const store = transaction.objectStore(
      STORES.students,
    );

    for (const student of students) {
      store.put(student);
    }

    await transactionComplete(transaction);
  } finally {
    db.close();
  }
}

export async function getStudent(
  id: string,
): Promise<CachedStudent | undefined> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.students,
      "readonly",
    );

    return await requestToPromise(
      transaction.objectStore(STORES.students).get(id),
    );
  } finally {
    db.close();
  }
}

export async function getStudentsBySection(
  tenantId: string,
  classId: string,
  sectionId: string,
): Promise<CachedStudent[]> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.students,
      "readonly",
    );

    const store = transaction.objectStore(
      STORES.students,
    );

    const request = store.getAll();

    const students =
      await requestToPromise(request);

    return students.filter(
      (student) =>
        student.tenantId === tenantId &&
        student.classId === classId &&
        student.sectionId === sectionId,
    );
  } finally {
    db.close();
  }
}

export async function putFeeDues(
  dues: CachedFeeDue[],
): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.feeDues,
      "readwrite",
    );

    const store = transaction.objectStore(
      STORES.feeDues,
    );

    for (const due of dues) {
      store.put(due);
    }

    await transactionComplete(transaction);
  } finally {
    db.close();
  }
}

export async function putAttendance(
  record: CachedAttendanceRecord,
): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.attendance,
      "readwrite",
    );

    transaction.objectStore(STORES.attendance).put(record);

    await transactionComplete(transaction);
  } finally {
    db.close();
  }
}

export async function updateQueueItem(
  id: string,
  updates: Partial<OfflineQueueItem>,
): Promise<OfflineQueueItem | undefined> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.queue,
      "readwrite",
    );

    const store = transaction.objectStore(STORES.queue);

    const existing = await requestToPromise(
      store.get(id),
    );

    if (!existing) {
      return undefined;
    }

    const updated: OfflineQueueItem = {
      ...existing,
      ...updates,
    };

    store.put(updated);

    await transactionComplete(transaction);

    return updated;
  } finally {
    db.close();
  }
}

export async function putQueueItem(
  item: OfflineQueueItem,
): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.queue,
      "readwrite",
    );

    transaction.objectStore(STORES.queue).put(item);

    await transactionComplete(transaction);
  } finally {
    db.close();
  }
}

export async function clearQueue(): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.queue,
      "readwrite",
    );

    transaction.objectStore(STORES.queue).clear();

    await transactionComplete(transaction);
  } finally {
    db.close();
  }
}

export async function getPendingQueueItems(): Promise<
  OfflineQueueItem[]
> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.queue,
      "readonly",
    );

    const request = transaction
      .objectStore(STORES.queue)
      .index("status")
      .getAll("PENDING");

    return await requestToPromise(request);
  } finally {
    db.close();
  }
}

export async function putEntitlement(
  entitlement: OfflineEntitlement,
): Promise<void> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.entitlement,
      "readwrite",
    );

    transaction
      .objectStore(STORES.entitlement)
      .put(entitlement);

    await transactionComplete(transaction);
  } finally {
    db.close();
  }
}

export async function getEntitlement(
  tenantId: string,
): Promise<OfflineEntitlement | undefined> {
  const db = await openDatabase();

  try {
    const transaction = db.transaction(
      STORES.entitlement,
      "readonly",
    );

    return await requestToPromise(
      transaction.objectStore(STORES.entitlement).get(
        tenantId,
      ),
    );
  } finally {
    db.close();
  }
}

function transactionComplete(
  transaction: IDBTransaction,
): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();

    transaction.onerror = () => {
      reject(
        transaction.error ??
          new Error("IndexedDB transaction failed."),
      );
    };

    transaction.onabort = () => {
      reject(
        transaction.error ??
          new Error("IndexedDB transaction aborted."),
      );
    };
  });
}

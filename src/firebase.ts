import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import type {
  AdminBooking,
  AdminData,
  ApartmentUnit,
  Employee,
  Guest,
  HousekeepingTask,
  MaintenanceIssue,
  MessageLead,
  Payment,
  ReportMetric,
  Role,
  StaffUser,
  WebsiteContent,
} from "./admin/types";

export type { User };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

type AuthClient = ReturnType<typeof getAuth>;
type Db = ReturnType<typeof getFirestore>;
type Collection = ReturnType<typeof collection>;

let appInstance: FirebaseApp | null | undefined;
let authInstance: AuthClient | null | undefined;
let dbInstance: Db | null | undefined;
let warnedFirestoreUnavailable = false;

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      !firebaseConfig.apiKey.includes("..."),
  );
}

function getFirebaseApp(): FirebaseApp | null {
  if (appInstance !== undefined) return appInstance;
  if (!isFirebaseConfigured()) {
    appInstance = null;
    return appInstance;
  }

  try {
    appInstance = initializeApp(firebaseConfig, "chippolux");
  } catch {
    appInstance = null;
  }

  return appInstance;
}

function getFirebaseAuth(): AuthClient | null {
  if (authInstance !== undefined) return authInstance;
  const app = getFirebaseApp();
  authInstance = app ? getAuth(app) : null;
  return authInstance;
}

function warnFirestoreUnavailable() {
  if (warnedFirestoreUnavailable) return;
  warnedFirestoreUnavailable = true;
  console.info("Firebase is not configured yet. The admin panel will show empty setup states.");
}

export function getFirebaseDb(): Db | null {
  if (dbInstance !== undefined) return dbInstance;
  const app = getFirebaseApp();
  if (!app) {
    dbInstance = null;
    warnFirestoreUnavailable();
    return dbInstance;
  }

  try {
    dbInstance = getFirestore(app);
  } catch {
    dbInstance = null;
    warnFirestoreUnavailable();
  }

  return dbInstance;
}

function getCollection(name: string): Collection | null {
  const db = getFirebaseDb();
  if (!db) return null;
  return collection(db, name);
}

function noopUnsubscribe() {
  return undefined;
}

// Auth
export const loginAdmin = (email: string, password: string): Promise<UserCredential> => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* values before testing admin login.");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = () => {
  const auth = getFirebaseAuth();
  return auth ? signOut(auth) : Promise.resolve();
};

export const onAuthChange = (cb: (user: User | null) => void) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return noopUnsubscribe;
  }
  return onAuthStateChanged(auth, cb);
};

// Bookings submitted from the public website
export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
  createdAt: Timestamp;
  status: "new" | "contacted" | "booked" | "closed";
}

export const addBooking = async (data: Omit<Booking, "id" | "createdAt" | "status">) => {
  const bookingsRef = getCollection("chippolux_bookings");
  if (!bookingsRef) return "offline-booking";

  const docRef = await addDoc(bookingsRef, {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const subscribeBookings = (
  cb: (bookings: Booking[]) => void,
  onError?: (err: Error) => void,
) => {
  const bookingsRef = getCollection("chippolux_bookings");
  if (!bookingsRef) {
    cb([]);
    onError?.(new Error("Firebase Firestore is unavailable."));
    return noopUnsubscribe;
  }

  const q = query(bookingsRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Booking[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Booking[];
      cb(list);
    },
    (err) => {
      console.info("Firebase booking feed could not sync.");
      cb([]);
      onError?.(err);
    },
  );
};

type AdminCollectionConfig<T> = {
  key: keyof AdminData;
  name: string;
  fallback: T[];
};

const adminCollections: Array<AdminCollectionConfig<unknown>> = [
  { key: "apartments", name: "chippolux_apartments", fallback: [] },
  { key: "bookings", name: "chippolux_admin_bookings", fallback: [] },
  { key: "guests", name: "chippolux_guests", fallback: [] },
  { key: "payments", name: "chippolux_payments", fallback: [] },
  { key: "housekeepingTasks", name: "chippolux_housekeeping_tasks", fallback: [] },
  { key: "maintenanceIssues", name: "chippolux_maintenance_issues", fallback: [] },
  { key: "messageLeads", name: "chippolux_message_leads", fallback: [] },
  { key: "staffUsers", name: "chippolux_staff_users", fallback: [] },
  { key: "reportMetrics", name: "chippolux_report_metrics", fallback: [] },
];

export const subscribeAdminData = (
  cb: (data: Partial<AdminData>) => void,
  onError?: (err: Error) => void,
) => {
  const db = getFirebaseDb();
  if (!db) {
    cb({
      apartments: [],
      bookings: [],
      guests: [],
      payments: [],
      housekeepingTasks: [],
      maintenanceIssues: [],
      messageLeads: [],
      staffUsers: [],
      reportMetrics: [],
    });
    return noopUnsubscribe;
  }

  const state: Partial<AdminData> = {};
  const emit = () => cb({ ...state });
  const unsubs = adminCollections.map((config) =>
    subscribeAdminCollection(config.name, config.fallback, (items) => {
      state[config.key] = items as never;
      emit();
    }, onError),
  );

  unsubs.push(
    onSnapshot(
      doc(db, "chippolux_settings", "websiteContent"),
      (snapshot) => {
        if (snapshot.exists()) {
          state.websiteContent = normalizeFirestoreData(snapshot.data()) as WebsiteContent;
          emit();
        }
      },
      (err) => {
        console.info("Firebase website content could not sync.");
        onError?.(err);
      },
    ),
  );

  return () => unsubs.forEach((unsubscribe) => unsubscribe());
};

function subscribeAdminCollection<T>(
  name: string,
  fallback: T[],
  cb: (items: T[]) => void,
  onError?: (err: Error) => void,
) {
  const ref = getCollection(name);
  if (!ref) {
    cb(fallback);
    onError?.(new Error("Firebase Firestore is unavailable."));
    return noopUnsubscribe;
  }

  return onSnapshot(
    ref,
    (snapshot) => {
      cb(snapshot.docs.map((item) => docToData<T>(item)));
    },
    (err) => {
      console.info(`Firebase collection ${name} could not sync.`);
      cb(fallback);
      onError?.(err);
    },
  );
}

function docToData<T>(snapshot: QueryDocumentSnapshot<DocumentData>) {
  const data = normalizeFirestoreData(snapshot.data()) as Record<string, unknown>;
  return {
    id: snapshot.id,
    ...data,
  } as T;
}

function normalizeFirestoreData(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFirestoreData(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeFirestoreData(item)]),
    );
  }

  return value;
}

export const updateBookingStatus = async (id: string, status: Booking["status"]) => {
  const bookingsRef = getCollection("chippolux_bookings");
  if (!bookingsRef) return;
  await updateDoc(doc(bookingsRef, id), { status });
};

export const updateBooking = async (id: string, data: Partial<Booking>) => {
  const bookingsRef = getCollection("chippolux_bookings");
  if (!bookingsRef) return;
  await updateDoc(doc(bookingsRef, id), data);
};

export const deleteBooking = async (id: string) => {
  const bookingsRef = getCollection("chippolux_bookings");
  if (!bookingsRef) return;
  await deleteDoc(doc(bookingsRef, id));
};

// Job applications
export interface JobApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  message: string;
  createdAt: Timestamp;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
}

export const subscribeApplications = (
  cb: (apps: JobApplication[]) => void,
  onError?: (err: Error) => void,
) => {
  const applicationsRef = getCollection("chippolux_applications");
  if (!applicationsRef) {
    cb([]);
    onError?.(new Error("Firebase Firestore is unavailable."));
    return noopUnsubscribe;
  }

  const q = query(applicationsRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: JobApplication[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as JobApplication[];
      cb(list);
    },
    (err) => {
      console.info("Firebase applications feed could not sync.");
      cb([]);
      onError?.(err);
    },
  );
};

export const updateApplicationStatus = async (id: string, status: JobApplication["status"]) => {
  const applicationsRef = getCollection("chippolux_applications");
  if (!applicationsRef) return;
  await updateDoc(doc(applicationsRef, id), { status });
};

export const deleteApplication = async (id: string) => {
  const applicationsRef = getCollection("chippolux_applications");
  if (!applicationsRef) return;
  await deleteDoc(doc(applicationsRef, id));
};

// Employees / role management
export const getEmployee = async (uid: string): Promise<Employee | null> => {
  const employeesRef = getCollection("chippolux_employees");
  if (!employeesRef) return null;

  try {
    const snap = await getDoc(doc(employeesRef, uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Employee;
  } catch {
    return null;
  }
};

export const subscribeEmployees = (
  cb: (employees: Employee[]) => void,
  onError?: (err: Error) => void,
) => {
  const employeesRef = getCollection("chippolux_employees");
  if (!employeesRef) {
    cb([]);
    onError?.(new Error("Firebase Firestore is unavailable."));
    return noopUnsubscribe;
  }

  const q = query(employeesRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Employee[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Employee[];
      cb(list);
    },
    (err) => {
      console.info("Firebase staff feed could not sync.");
      cb([]);
      onError?.(err);
    },
  );
};

export const createEmployee = async (data: {
  email: string;
  password: string;
  displayName: string;
  phone: string;
  role: Role;
}) => {
  const employeesRef = getCollection("chippolux_employees");
  if (!employeesRef) throw new Error("Firebase Firestore is unavailable.");
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is unavailable.");

  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const uid = cred.user.uid;

  // TODO: Move staff creation and role assignment to a backend Admin SDK endpoint.
  await setDoc(doc(employeesRef, uid), {
    email: data.email,
    displayName: data.displayName,
    phone: data.phone,
    role: data.role,
    isActive: true,
    createdAt: Date.now(),
    lastLogin: null,
  });

  await signOut(auth);
  return uid;
};

export const updateEmployee = async (uid: string, data: Partial<Employee>) => {
  const employeesRef = getCollection("chippolux_employees");
  if (!employeesRef) return;
  await updateDoc(doc(employeesRef, uid), data);
};

export const toggleEmployeeActive = async (uid: string, isActive: boolean) => {
  const employeesRef = getCollection("chippolux_employees");
  if (!employeesRef) return;
  await updateDoc(doc(employeesRef, uid), { isActive });
};

export const deleteEmployee = async (uid: string) => {
  const employeesRef = getCollection("chippolux_employees");
  if (!employeesRef) return;
  await deleteDoc(doc(employeesRef, uid));
  // Firebase Auth account deletion requires the Admin SDK on a backend.
};

import { initializeApp } from "firebase/app";
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
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import type { User } from "firebase/auth";
import type { Employee, Role } from "./admin/types";

export type { User };

const firebaseConfig = {
  apiKey: "AIzaSy...sc4Y",
  authDomain: "tailored-manor.firebaseapp.com",
  projectId: "tailored-manor",
  storageBucket: "tailored-manor.firebasestorage.app",
  messagingSenderId: "1012625617073",
  appId: "1:1012625617073:web:a219d1830ff44bdaa57290",
  measurementId: "G-DYL0R9BJN3",
};

const app = initializeApp(firebaseConfig, "chippolux");
export const auth = getAuth(app);

type Db = ReturnType<typeof getFirestore>;
type Collection = ReturnType<typeof collection>;

let dbInstance: Db | null | undefined;
let warnedFirestoreUnavailable = false;

function warnFirestoreUnavailable() {
  if (warnedFirestoreUnavailable) return;
  warnedFirestoreUnavailable = true;
  console.info("Firebase booking feed is offline. The admin panel is using demo data until Firestore is configured.");
}

export function getFirebaseDb(): Db | null {
  if (dbInstance !== undefined) return dbInstance;

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
export const loginAdmin = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutAdmin = () => signOut(auth);

export const onAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

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
      console.info("Firebase booking feed could not sync. The admin panel is using demo data.");
      cb([]);
      onError?.(err);
    },
  );
};

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

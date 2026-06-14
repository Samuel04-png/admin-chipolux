import { business } from "../content";
import type {
  AdminBooking,
  ApartmentStatus,
  ApartmentUnit,
  BookingStatus,
  CleaningStatus,
  HousekeepingStatus,
  LeadStatus,
  MaintenanceIssue,
  MaintenanceIssueStatus,
  PaymentStatus,
  Priority,
} from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

export function formatCurrencyZMW(value: number): string {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export function formatDate(value?: string): string {
  if (!value) return "-";
  return dateFormatter.format(parseDate(value.slice(0, 10)));
}

export function formatShortDate(value?: string): string {
  if (!value) return "-";
  return shortDateFormatter.format(parseDate(value.slice(0, 10)));
}

export function formatTodayLabel(date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = parseDate(checkIn).getTime();
  const end = parseDate(checkOut).getTime();
  const nights = Math.ceil((end - start) / 86400000);
  return nights > 0 ? nights : 0;
}

export function calculateBalance(totalAmount: number, amountPaid: number): number {
  return Math.max(0, totalAmount - amountPaid);
}

export function hasDateOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  if (!startA || !endA || !startB || !endB) return false;
  return parseDate(startA) < parseDate(endB) && parseDate(startB) < parseDate(endA);
}

export function isApartmentAvailable(
  apartmentId: string,
  checkIn: string,
  checkOut: string,
  bookings: AdminBooking[],
  apartments: ApartmentUnit[],
  maintenanceIssues: MaintenanceIssue[] = [],
): boolean {
  const apartment = apartments.find((item) => item.id === apartmentId);
  if (!apartment || apartment.status === "Maintenance" || apartment.status === "Blocked" || apartment.status === "Hidden") {
    return false;
  }

  const blockedByMaintenance = maintenanceIssues.some(
    (issue) =>
      issue.apartmentId === apartmentId &&
      !["Resolved", "Closed"].includes(issue.status) &&
      issue.priority === "Urgent",
  );
  if (blockedByMaintenance) return false;

  return !bookings.some((booking) => {
    const blocksInventory = ["Confirmed", "Checked In", "Awaiting Deposit"].includes(booking.status);
    return blocksInventory && booking.apartmentId === apartmentId && hasDateOverlap(checkIn, checkOut, booking.checkInDate, booking.checkOutDate);
  });
}

export function getApartmentStatusForDate(
  apartmentId: string,
  isoDate: string,
  bookings: AdminBooking[],
  apartments: ApartmentUnit[],
  maintenanceIssues: MaintenanceIssue[],
): ApartmentStatus | BookingStatus {
  const apartment = apartments.find((item) => item.id === apartmentId);
  if (!apartment) return "Hidden";
  if (apartment.status === "Maintenance" || apartment.status === "Blocked" || apartment.status === "Hidden") return apartment.status;

  const blocked = maintenanceIssues.some(
    (issue) => issue.apartmentId === apartmentId && !["Resolved", "Closed"].includes(issue.status) && issue.priority === "Urgent",
  );
  if (blocked) return "Maintenance";

  const booking = bookings.find(
    (item) =>
      item.apartmentId === apartmentId &&
      ["Confirmed", "Checked In", "Awaiting Deposit"].includes(item.status) &&
      hasDateOverlap(isoDate, addDaysIso(isoDate, 1), item.checkInDate, item.checkOutDate),
  );

  return booking?.status ?? apartment.status;
}

export function addDaysIso(isoDate: string, amount: number): string {
  const next = parseDate(isoDate);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
}

export function dateRange(startIso: string, length: number): string[] {
  return Array.from({ length }, (_, index) => addDaysIso(startIso, index));
}

export function statusClass(status: string): string {
  return status
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getBookingStatusTone(status: BookingStatus): string {
  const tones: Record<BookingStatus, string> = {
    Pending: "amber",
    Confirmed: "blue",
    "Checked In": "green",
    "Checked Out": "slate",
    Cancelled: "red",
    "No Show": "red",
    "Awaiting Deposit": "amber",
  };
  return tones[status];
}

export function getPaymentStatusTone(status: PaymentStatus): string {
  const tones: Record<PaymentStatus, string> = {
    Unpaid: "red",
    "Deposit Paid": "amber",
    "Partially Paid": "amber",
    Paid: "green",
    Refunded: "slate",
    Overdue: "red",
  };
  return tones[status];
}

export function getApartmentStatusTone(status: ApartmentStatus | CleaningStatus): string {
  const tones: Record<string, string> = {
    Available: "green",
    Occupied: "blue",
    Booked: "blue",
    Cleaning: "amber",
    Maintenance: "red",
    Blocked: "red",
    Hidden: "slate",
    Ready: "green",
    Dirty: "red",
    Inspected: "green",
    "Do Not Disturb": "slate",
    "Maintenance Required": "red",
  };
  return tones[status] ?? "slate";
}

export function getPriorityTone(priority: Priority): string {
  return { Low: "slate", Medium: "blue", High: "amber", Urgent: "red" }[priority];
}

export function getLeadStatusTone(status: LeadStatus): string {
  const tones: Record<LeadStatus, string> = {
    New: "blue",
    Contacted: "slate",
    Quoted: "amber",
    "Follow Up": "amber",
    Converted: "green",
    Lost: "red",
  };
  return tones[status];
}

export function getHousekeepingTone(status: HousekeepingStatus): string {
  const tones: Record<HousekeepingStatus, string> = {
    Pending: "amber",
    "In Progress": "blue",
    "Ready for Inspection": "green",
    Completed: "slate",
    Blocked: "red",
  };
  return tones[status];
}

export function getMaintenanceTone(status: MaintenanceIssueStatus): string {
  const tones: Record<MaintenanceIssueStatus, string> = {
    Open: "red",
    "In Progress": "blue",
    "Waiting for Parts": "amber",
    "Waiting for Contractor": "amber",
    Resolved: "green",
    Closed: "slate",
  };
  return tones[status];
}

export function whatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, "") || business.whatsappNumber;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function occupancyRate(bookings: AdminBooking[], apartments: ApartmentUnit[], todayIso: string): number {
  const bookable = apartments.filter((item) => item.visibleOnWebsite && item.status !== "Hidden");
  if (!bookable.length) return 0;
  const occupied = bookable.filter((item) => {
    const status = getApartmentStatusForDate(item.id, todayIso, bookings, apartments, []);
    return ["Confirmed", "Checked In", "Occupied", "Booked"].includes(status);
  });
  return Math.round((occupied.length / bookable.length) * 100);
}

export function makeBookingCode(apartmentUnit: string, dateIso: string): string {
  const compact = dateIso.replace(/-/g, "").slice(2);
  return `CLA-${compact}-${apartmentUnit}`;
}

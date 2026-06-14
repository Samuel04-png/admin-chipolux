export type Role =
  | "owner_admin"
  | "manager"
  | "receptionist"
  | "housekeeper"
  | "maintenance"
  | "security"
  | "accountant";

export type Permission =
  | "dashboard.view"
  | "bookings.view"
  | "bookings.edit"
  | "calendar.view"
  | "apartments.view"
  | "apartments.edit"
  | "guests.view"
  | "guests.edit"
  | "payments.view"
  | "payments.edit"
  | "housekeeping.view"
  | "housekeeping.edit"
  | "maintenance.view"
  | "maintenance.edit"
  | "messages.view"
  | "messages.edit"
  | "content.view"
  | "content.edit"
  | "staff.view"
  | "staff.edit"
  | "reports.view"
  | "settings.view"
  | "settings.edit";

export const ROLE_LABELS: Record<Role, string> = {
  owner_admin: "Owner/Admin",
  manager: "Manager",
  receptionist: "Receptionist",
  housekeeper: "Housekeeper",
  maintenance: "Maintenance",
  security: "Security",
  accountant: "Accountant",
};

export const ROLE_COLORS: Record<Role, string> = {
  owner_admin: "#8a5a2b",
  manager: "#2f5f6f",
  receptionist: "#375a7f",
  housekeeper: "#3f704d",
  maintenance: "#9a4f2f",
  security: "#30363f",
  accountant: "#67523b",
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner_admin: [
    "dashboard.view",
    "bookings.view",
    "bookings.edit",
    "calendar.view",
    "apartments.view",
    "apartments.edit",
    "guests.view",
    "guests.edit",
    "payments.view",
    "payments.edit",
    "housekeeping.view",
    "housekeeping.edit",
    "maintenance.view",
    "maintenance.edit",
    "messages.view",
    "messages.edit",
    "content.view",
    "content.edit",
    "staff.view",
    "staff.edit",
    "reports.view",
    "settings.view",
    "settings.edit",
  ],
  manager: [
    "dashboard.view",
    "bookings.view",
    "bookings.edit",
    "calendar.view",
    "apartments.view",
    "apartments.edit",
    "guests.view",
    "guests.edit",
    "payments.view",
    "payments.edit",
    "housekeeping.view",
    "housekeeping.edit",
    "maintenance.view",
    "maintenance.edit",
    "messages.view",
    "messages.edit",
    "reports.view",
  ],
  receptionist: [
    "dashboard.view",
    "bookings.view",
    "bookings.edit",
    "calendar.view",
    "guests.view",
    "guests.edit",
    "payments.view",
    "payments.edit",
    "messages.view",
    "messages.edit",
  ],
  housekeeper: ["dashboard.view", "housekeeping.view", "housekeeping.edit", "maintenance.view"],
  maintenance: ["dashboard.view", "maintenance.view", "maintenance.edit", "apartments.view"],
  security: ["dashboard.view", "calendar.view", "guests.view", "maintenance.view"],
  accountant: ["dashboard.view", "payments.view", "payments.edit", "reports.view"],
};

export type AdminRoute =
  | "login"
  | "dashboard"
  | "bookings"
  | "calendar"
  | "apartments"
  | "guests"
  | "payments"
  | "housekeeping"
  | "maintenance"
  | "messages"
  | "content"
  | "staff"
  | "reports"
  | "settings";

export interface AdminSession {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Employee {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt: number;
  lastLogin: number | null;
}

export type ApartmentStatus =
  | "Available"
  | "Occupied"
  | "Booked"
  | "Cleaning"
  | "Maintenance"
  | "Blocked"
  | "Hidden";

export type CleaningStatus =
  | "Ready"
  | "Dirty"
  | "Cleaning"
  | "Inspected"
  | "Do Not Disturb"
  | "Maintenance Required";

export type MaintenanceStatus = "Clear" | "Open Issue" | "Blocked";

export interface ApartmentUnit {
  id: string;
  name: string;
  unitNumber: string;
  type: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  amenities: string[];
  pricePerNight: number;
  pricePerWeek: number;
  pricePerMonth: number;
  status: ApartmentStatus;
  cleaningStatus: CleaningStatus;
  maintenanceStatus: MaintenanceStatus;
  featuredImage: string;
  galleryImages: string[];
  visibleOnWebsite: boolean;
  featuredOnHomepage: boolean;
  floor: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingSource =
  | "Website"
  | "WhatsApp"
  | "Walk-in"
  | "Phone"
  | "Referral"
  | "Booking.com"
  | "Facebook"
  | "Instagram";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Checked In"
  | "Checked Out"
  | "Cancelled"
  | "No Show"
  | "Awaiting Deposit";

export type PaymentStatus =
  | "Unpaid"
  | "Deposit Paid"
  | "Partially Paid"
  | "Paid"
  | "Refunded"
  | "Overdue";

export interface AdminBooking {
  id: string;
  bookingCode: string;
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  apartmentId: string;
  apartmentName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: number;
  adults: number;
  children: number;
  source: BookingSource;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  depositRequired: number;
  depositPaid: boolean;
  specialRequests: string;
  internalNotes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export interface Guest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  idType: string;
  idNumber: string;
  nationality: string;
  address: string;
  city: string;
  notes: string;
  preferences: string[];
  totalBookings: number;
  totalSpent: number;
  outstandingBalance: number;
  lastStayDate: string;
  repeatGuest: boolean;
  blacklisted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "Cash" | "Mobile Money" | "Bank Transfer" | "Card" | "Other";

export interface Payment {
  id: string;
  bookingId: string;
  bookingCode: string;
  guestId: string;
  guestName: string;
  apartmentName: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber: string;
  paymentDate: string;
  recordedBy: string;
  notes: string;
}

export type HousekeepingTaskType =
  | "Checkout Cleaning"
  | "Stayover Cleaning"
  | "Deep Cleaning"
  | "Linen Change"
  | "Inspection"
  | "Restock Amenities";

export type HousekeepingStatus =
  | "Pending"
  | "In Progress"
  | "Ready for Inspection"
  | "Completed"
  | "Blocked";

export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface HousekeepingTask {
  id: string;
  apartmentId: string;
  apartmentName: string;
  taskType: HousekeepingTaskType;
  status: HousekeepingStatus;
  priority: Priority;
  assignedTo: string;
  dueDate: string;
  dueTime: string;
  checklist: Array<{ label: string; done: boolean }>;
  notes: string;
  createdAt: string;
  completedAt?: string;
}

export type MaintenanceIssueStatus =
  | "Open"
  | "In Progress"
  | "Waiting for Parts"
  | "Waiting for Contractor"
  | "Resolved"
  | "Closed";

export interface MaintenanceIssue {
  id: string;
  apartmentId: string;
  apartmentName: string;
  title: string;
  description: string;
  priority: Priority;
  status: MaintenanceIssueStatus;
  reportedBy: string;
  assignedTo: string;
  reportedAt: string;
  resolvedAt?: string;
  images: string[];
  notes: string;
}

export type LeadSource = "WhatsApp" | "Website Form" | "Phone" | "Walk-in" | "Facebook" | "Instagram";
export type LeadStatus = "New" | "Contacted" | "Quoted" | "Follow Up" | "Converted" | "Lost";

export interface MessageLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  requestedCheckIn: string;
  requestedCheckOut: string;
  requestedApartmentType: string;
  message: string;
  status: LeadStatus;
  assignedTo: string;
  convertedToBookingId?: string;
  createdAt: string;
  lastContactedAt?: string;
  notes: string;
}

export type StaffStatus = "Active" | "Off duty" | "Inactive";

export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  status: StaffStatus;
  avatar: string;
  lastActive: string;
  createdAt: string;
}

export interface WebsiteContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  aboutText: string;
  amenities: string[];
  galleryImages: string[];
  contactPhone: string;
  whatsappNumber: string;
  email: string;
  location: string;
  mapLink: string;
  faqItems: Array<{ question: string; answer: string }>;
  testimonials: Array<{ name: string; text: string; rating: number; visible: boolean }>;
  seoTitle: string;
  seoDescription: string;
  promotionalBanner: {
    text: string;
    startDate: string;
    endDate: string;
    active: boolean;
  };
}

export interface ReportMetric {
  label: string;
  value: string;
  change: string;
  period: string;
  status: "positive" | "neutral" | "warning";
}

export interface AdminData {
  apartments: ApartmentUnit[];
  bookings: AdminBooking[];
  guests: Guest[];
  payments: Payment[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceIssues: MaintenanceIssue[];
  messageLeads: MessageLead[];
  staffUsers: StaffUser[];
  websiteContent: WebsiteContent;
  reportMetrics: ReportMetric[];
}

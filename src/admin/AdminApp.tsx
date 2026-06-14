import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Booking as WebsiteBooking } from "../firebase";
import { business, images } from "../content";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "./icons";
import { AdminShell } from "./SharedComponents";
import { mockAdminData, TODAY_ISO } from "./mockData";
import type { AdminData, AdminRoute, AdminSession, LeadStatus, MessageLead } from "./types";
import {
  ApartmentsPage,
  BookingsPage,
  CalendarPage,
  ContentPage,
  DashboardPage,
  GuestsPage,
  HousekeepingPage,
  MaintenancePage,
  MessagesPage,
  PaymentsPage,
  ReportsPage,
  SettingsPage,
  StaffPage,
} from "./pages";

const ADMIN_SESSION_KEY = "chipos-lux-admin-session";
const demoEmail = "admin@chiposluxapartments.com";
const demoPassword = "password123";

const validRoutes: AdminRoute[] = [
  "login",
  "dashboard",
  "bookings",
  "calendar",
  "apartments",
  "guests",
  "payments",
  "housekeeping",
  "maintenance",
  "messages",
  "content",
  "staff",
  "reports",
  "settings",
];

const defaultSession: AdminSession = {
  id: "demo-owner",
  fullName: "Chipo Mwanza",
  email: demoEmail,
  role: "owner_admin",
};

export default function AdminApp() {
  const [route, setRoute] = useState<AdminRoute>(() => readRouteFromLocation());
  const [session, setSession] = useState<AdminSession | null>(() => readStoredSession());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [websiteLeads, setWebsiteLeads] = useState<MessageLead[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState<"linked" | "offline" | "checking">("checking");

  useEffect(() => {
    const onPopState = () => setRoute(readRouteFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!session && route !== "login") {
      navigateTo("login", true);
    }
    if (session && route === "login") {
      navigateTo("dashboard", true);
    }
  }, [route, session]);

  useEffect(() => {
    if (!session) {
      setWebsiteLeads([]);
      setFirebaseStatus("offline");
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    setFirebaseStatus("checking");

    void import("../firebase")
      .then(({ subscribeBookings }) => {
        if (cancelled) return;
        unsubscribe = subscribeBookings(
          (bookings) => {
            setWebsiteLeads(bookings.map(mapWebsiteBookingToLead));
            setFirebaseStatus("linked");
          },
          () => setFirebaseStatus("offline"),
        );
      })
      .catch(() => {
        if (!cancelled) setFirebaseStatus("offline");
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [session]);

  const data: AdminData = useMemo(
    () => ({
      ...mockAdminData,
      messageLeads: mergeLeads(websiteLeads, mockAdminData.messageLeads),
    }),
    [websiteLeads],
  );

  const navigate = (nextRoute: Exclude<AdminRoute, "login">) => {
    navigateTo(nextRoute);
  };

  const handleLogin = (nextSession: AdminSession, remember: boolean) => {
    setSession(nextSession);
    if (remember) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession));
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession));
    }
    navigateTo("dashboard", true);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    void import("../firebase")
      .then(({ logoutAdmin }) => logoutAdmin())
      .catch(() => undefined);
    setSession(null);
    navigateTo("login", true);
  };

  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeRoute = route === "login" ? "dashboard" : route;

  return (
    <AdminShell
      activeRoute={activeRoute}
      session={session}
      sidebarOpen={sidebarOpen}
      firebaseStatus={firebaseStatus}
      onToggleSidebar={() => setSidebarOpen((open) => !open)}
      onCloseSidebar={() => setSidebarOpen(false)}
      onNavigate={navigate}
      onLogout={handleLogout}
    >
      {renderRoute(activeRoute, data, navigate)}
    </AdminShell>
  );
}

function renderRoute(
  route: Exclude<AdminRoute, "login">,
  data: AdminData,
  onNavigate: (route: Exclude<AdminRoute, "login">) => void,
) {
  const props = { data, onNavigate };
  switch (route) {
    case "bookings":
      return <BookingsPage {...props} />;
    case "calendar":
      return <CalendarPage {...props} />;
    case "apartments":
      return <ApartmentsPage {...props} />;
    case "guests":
      return <GuestsPage {...props} />;
    case "payments":
      return <PaymentsPage {...props} />;
    case "housekeeping":
      return <HousekeepingPage {...props} />;
    case "maintenance":
      return <MaintenancePage {...props} />;
    case "messages":
      return <MessagesPage {...props} />;
    case "content":
      return <ContentPage {...props} />;
    case "staff":
      return <StaffPage {...props} />;
    case "reports":
      return <ReportsPage {...props} />;
    case "settings":
      return <SettingsPage {...props} />;
    default:
      return <DashboardPage {...props} />;
  }
}

function LoginPage({ onLogin }: { onLogin: (session: AdminSession, remember: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();

    if (!trimmedEmail || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      if (normalizedEmail === demoEmail && password === demoPassword) {
        onLogin(defaultSession, remember);
        return;
      }

      const { getEmployee, loginAdmin } = await import("../firebase");
      const credential = await loginAdmin(trimmedEmail, password);
      const employee = await getEmployee(credential.user.uid);

      if (employee && !employee.isActive) {
        setError("This admin account is inactive. Ask the owner to reactivate it.");
        return;
      }

      onLogin(
        {
          id: credential.user.uid,
          fullName:
            employee?.displayName ||
            credential.user.displayName ||
            formatNameFromEmail(credential.user.email || trimmedEmail),
          email: credential.user.email || trimmedEmail,
          role: employee?.role || "owner_admin",
          avatar: credential.user.photoURL || undefined,
        },
        remember,
      );
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="login-visual" aria-hidden="true">
        <img src={images.heroFront} alt="" />
        <div className="login-visual-copy">
          <img src={images.logo} alt="" />
          <p>{business.location}</p>
          <h1>Chipo's Lux Apartments Admin</h1>
          <span>Manage bookings, apartments, guests, payments, and daily operations.</span>
        </div>
      </section>

      <section className="login-panel" aria-label="Admin login">
        <div className="login-card">
          <div className="login-brand">
            <img src={images.logo} alt={business.name} />
            <div>
              <span>Private admin</span>
              <h2>Sign in</h2>
            </div>
          </div>

          <form className="login-form" onSubmit={submit} noValidate>
            <label>
              <span>Email</span>
              <div className="input-with-icon">
                <Mail size={18} aria-hidden="true" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@chiposluxapartments.com"
                  autoComplete="email"
                  type="email"
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="input-with-icon">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                />
                <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                </button>
              </div>
            </label>

            <div className="login-options">
              <label>
                <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
                Remember me
              </label>
              <button type="button">Forgot password?</button>
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <button className="button primary login-submit" type="submit" disabled={loading}>
              <ShieldCheck size={18} aria-hidden="true" />
              {loading ? "Checking..." : "Sign in to admin"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function readRouteFromLocation(): AdminRoute {
  const match = window.location.pathname.match(/\/admin\/?([^/]*)/);
  const slug = (match?.[1] || "dashboard").toLowerCase() as AdminRoute;
  return validRoutes.includes(slug) ? slug : "dashboard";
}

function formatNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "Admin User";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLoginErrorMessage(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code?: unknown }).code) : "";
  const message = err instanceof Error ? err.message : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid admin email or password.";
    case "auth/too-many-requests":
      return "Too many login attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email and password login is not enabled in Firebase.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication.";
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    case "auth/invalid-api-key":
      return "Firebase Authentication is not configured correctly for this site.";
    default:
      if (code.includes("api-key") || message.toLowerCase().includes("api key")) {
        return "Firebase Authentication is not configured correctly for this site.";
      }
      if (message && !message.startsWith("Firebase:")) {
        return message;
      }
      return "Unable to sign in. Please check the admin email and password.";
  }
}

function navigateTo(route: AdminRoute, replace = false) {
  const path = route === "login" ? "/admin/login/" : `/admin/${route}/`;
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function readStoredSession(): AdminSession | null {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY) ?? sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

function mapWebsiteBookingToLead(booking: WebsiteBooking): MessageLead {
  const statusMap: Record<WebsiteBooking["status"], LeadStatus> = {
    new: "New",
    contacted: "Contacted",
    booked: "Converted",
    closed: "Lost",
  };
  const createdAt = booking.createdAt?.toMillis ? new Date(booking.createdAt.toMillis()).toISOString() : `${TODAY_ISO}T09:00:00`;
  return {
    id: `firestore-${booking.id}`,
    name: booking.fullName || "Website guest",
    phone: booking.phone || business.phoneDisplay,
    email: booking.email || "",
    source: "Website Form",
    requestedCheckIn: booking.checkIn || TODAY_ISO,
    requestedCheckOut: booking.checkOut || TODAY_ISO,
    requestedApartmentType: "Website inquiry",
    message: booking.message || "Guest submitted the website booking form.",
    status: statusMap[booking.status] ?? "New",
    assignedTo: "Front Desk",
    convertedToBookingId: booking.status === "booked" ? booking.id : undefined,
    createdAt,
    notes: `Guest count: ${booking.guests || "not specified"}`,
  };
}

function mergeLeads(liveLeads: MessageLead[], mockLeads: MessageLead[]): MessageLead[] {
  const liveIds = new Set(liveLeads.map((lead) => lead.id));
  return [...liveLeads, ...mockLeads.filter((lead) => !liveIds.has(lead.id))];
}

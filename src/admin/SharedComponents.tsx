import type { ReactNode } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  FileBarChart2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wrench,
  X,
} from "./icons";
import type { LucideIcon } from "./icons";
import { business, images } from "../content";
import type { AdminRoute, AdminSession } from "./types";
import { ROLE_LABELS } from "./types";
import { formatTodayLabel, statusClass } from "./utils";

export interface NavItem {
  id: Exclude<AdminRoute, "login">;
  label: string;
  section: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", section: "Command", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", section: "Front Desk", icon: CalendarDays },
  { id: "calendar", label: "Availability Calendar", section: "Front Desk", icon: ClipboardCheck },
  { id: "apartments", label: "Apartments / Units", section: "Front Desk", icon: Building2 },
  { id: "guests", label: "Guests", section: "Guest Care", icon: UsersRound },
  { id: "payments", label: "Payments", section: "Guest Care", icon: CreditCard },
  { id: "housekeeping", label: "Housekeeping", section: "Operations", icon: Home },
  { id: "maintenance", label: "Maintenance", section: "Operations", icon: Wrench },
  { id: "messages", label: "Messages / Leads", section: "Sales", icon: MessageSquareText },
  { id: "content", label: "Website Content", section: "Sales", icon: FileBarChart2 },
  { id: "staff", label: "Staff", section: "Admin", icon: ShieldCheck },
  { id: "reports", label: "Reports", section: "Admin", icon: FileBarChart2 },
  { id: "settings", label: "Settings", section: "Admin", icon: Settings },
];

export function routeLabel(route: AdminRoute): string {
  if (route === "login") return "Login";
  return adminNavItems.find((item) => item.id === route)?.label ?? "Dashboard";
}

interface AdminShellProps {
  activeRoute: Exclude<AdminRoute, "login">;
  session: AdminSession;
  sidebarOpen: boolean;
  firebaseStatus: "linked" | "offline" | "checking";
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  onNavigate: (route: Exclude<AdminRoute, "login">) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AdminShell({
  activeRoute,
  session,
  sidebarOpen,
  firebaseStatus,
  onToggleSidebar,
  onCloseSidebar,
  onNavigate,
  onLogout,
  children,
}: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`} aria-label="Admin navigation">
        <div className="sidebar-brand">
          <img src={images.logo} alt={business.name} className="sidebar-logo" />
          <div>
            <strong>{business.name}</strong>
            <span>Private Operations</span>
          </div>
        </div>

        <div className="sidebar-shift">
          <span>Today</span>
          <strong>{formatTodayLabel(new Date())}</strong>
        </div>

        <nav className="sidebar-nav">
          {adminNavItems.map((item, index) => {
            const showSection = index === 0 || adminNavItems[index - 1].section !== item.section;
            const Icon = item.icon;
            return (
              <div key={item.id}>
                {showSection ? <p className="sidebar-section">{item.section}</p> : null}
                <button
                  className={`sidebar-link ${activeRoute === item.id ? "is-active" : ""}`}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseSidebar();
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{initials(session.fullName)}</div>
          <div>
            <strong>{session.fullName}</strong>
            <span>{ROLE_LABELS[session.role]}</span>
          </div>
          <button type="button" className="icon-button is-muted" onClick={onLogout} aria-label="Sign out">
            <LogOut size={17} aria-hidden="true" />
          </button>
        </div>
      </aside>

      {sidebarOpen ? <button className="sidebar-overlay" aria-label="Close navigation" onClick={onCloseSidebar} /> : null}

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="icon-button mobile-menu" onClick={onToggleSidebar} aria-label="Open navigation">
            <Menu size={21} aria-hidden="true" />
          </button>

          <div className="topbar-title">
            <span>{routeLabel(activeRoute)}</span>
            <small>{firebaseStatus === "linked" ? "Firebase booking feed linked" : firebaseStatus === "checking" ? "Checking booking feed" : "Demo data active"}</small>
          </div>

          <label className="topbar-search">
            <Search size={17} aria-hidden="true" />
            <input type="search" placeholder="Search guests, bookings, units" />
          </label>

          <button type="button" className="topbar-action" onClick={() => onNavigate("bookings")}>
            New Booking
          </button>

          <button type="button" className="icon-button" aria-label="Notifications">
            <Bell size={18} aria-hidden="true" />
            <span className="notification-dot" />
          </button>

          <div className="profile-menu">
            <div className="avatar is-small">{initials(session.fullName)}</div>
            <span>{session.fullName.split(" ")[0]}</span>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "charcoal",
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {detail ? <small>{detail}</small> : null}
      </div>
    </article>
  );
}

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || action || eyebrow) ? (
        <div className="panel-header">
          <div>
            {eyebrow ? <p>{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatusPill({ label, tone = "slate" }: { label: string; tone?: string }) {
  return <span className={`status-pill tone-${tone} status-${statusClass(label)}`}>{label}</span>;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search-input">
      <Search size={17} aria-hidden="true" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type="search" />
    </label>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <p>{title}</p>
      {text ? <span>{text}</span> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function Drawer({
  title,
  open,
  onClose,
  children,
  footer,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button className="drawer-backdrop" aria-label="Close drawer" onClick={onClose} />
      <aside className="drawer-panel">
        <div className="drawer-header">
          <h2>{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer ? <div className="drawer-footer">{footer}</div> : null}
      </aside>
    </div>
  );
}

export function Modal({
  title,
  open,
  onClose,
  children,
  footer,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal-backdrop" aria-label="Close modal" onClick={onClose} />
      <div className="modal-panel">
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? "is-active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function MiniBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const width = max ? Math.min(100, Math.round((value / max) * 100)) : value;
  return (
    <div className="mini-bar">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <i>
        <b style={{ width: `${width}%` }} />
      </i>
    </div>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button type="button" className={`toggle-switch ${checked ? "is-on" : ""}`} onClick={() => onChange?.(!checked)}>
      <span aria-hidden="true" />
      <strong>{label}</strong>
    </button>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

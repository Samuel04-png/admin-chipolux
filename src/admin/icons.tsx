import type { ComponentType, ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export type LucideIcon = ComponentType<IconProps>;

function createIcon(name: string, paths: ReactNode): LucideIcon {
  const Icon = ({ size = 18, strokeWidth = 1.9, className = "", ...props }: IconProps) => (
    <svg
      aria-hidden={props["aria-hidden"] ?? true}
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {paths}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

export const AlertTriangle = createIcon("AlertTriangle", (
  <>
    <path d="M12 3 2.8 20h18.4L12 3Z" />
    <path d="M12 9v5" />
    <path d="M12 18h.01" />
  </>
));

export const ArrowRight = createIcon("ArrowRight", (
  <>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </>
));

export const Banknote = createIcon("Banknote", (
  <>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.4" />
    <path d="M7 10.5v3" />
    <path d="M17 10.5v3" />
  </>
));

export const BedDouble = createIcon("BedDouble", (
  <>
    <path d="M4 5v14" />
    <path d="M20 11v8" />
    <path d="M4 11h16" />
    <path d="M7 8h4v3H7z" />
    <path d="M13 8h4v3h-4z" />
    <path d="M4 19h16" />
  </>
));

export const Bell = createIcon("Bell", (
  <>
    <path d="M6 10a6 6 0 1 1 12 0c0 5 2 5.5 2 7H4c0-1.5 2-2 2-7Z" />
    <path d="M10 20a2.4 2.4 0 0 0 4 0" />
  </>
));

export const Building2 = createIcon("Building2", (
  <>
    <path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h8A1.5 1.5 0 0 1 16 4.5V21" />
    <path d="M16 8h1.5A1.5 1.5 0 0 1 19 9.5V21" />
    <path d="M3 21h18" />
    <path d="M8 7h4" />
    <path d="M8 11h4" />
    <path d="M8 15h4" />
  </>
));

export const CalendarCheck = createIcon("CalendarCheck", (
  <>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M4 10h16" />
    <path d="m8.5 15 2.3 2.3 4.7-5" />
  </>
));

export const CalendarDays = createIcon("CalendarDays", (
  <>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M4 10h16" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </>
));

export const Check = createIcon("Check", <path d="m5 12.5 4.2 4.2L19 7" />);

export const ChevronDown = createIcon("ChevronDown", <path d="m6 9 6 6 6-6" />);

export const ClipboardCheck = createIcon("ClipboardCheck", (
  <>
    <path d="M9 4h6l1 2h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1-2Z" />
    <path d="M9 4h6" />
    <path d="m8 14 2.5 2.5L16 11" />
  </>
));

export const CreditCard = createIcon("CreditCard", (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </>
));

export const Download = createIcon("Download", (
  <>
    <path d="M12 4v11" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 20h14" />
  </>
));

export const Eye = createIcon("Eye", (
  <>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.7" />
  </>
));

export const EyeOff = createIcon("EyeOff", (
  <>
    <path d="M3 3 21 21" />
    <path d="M9.7 5.4A10.5 10.5 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-3 4.1" />
    <path d="M6.3 6.8A16 16 0 0 0 2.5 12s3.5 7 9.5 7c1.5 0 2.8-.3 4-.8" />
    <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
  </>
));

export const FileBarChart2 = createIcon("FileBarChart2", (
  <>
    <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5" />
    <path d="M8 17v-3" />
    <path d="M12 17v-6" />
    <path d="M16 17v-4" />
  </>
));

export const FileText = createIcon("FileText", (
  <>
    <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5" />
    <path d="M8 13h8" />
    <path d="M8 17h6" />
  </>
));

export const Home = createIcon("Home", (
  <>
    <path d="m3 11 9-7 9 7" />
    <path d="M5 10.5V21h14V10.5" />
    <path d="M10 21v-6h4v6" />
  </>
));

export const HousePlus = createIcon("HousePlus", (
  <>
    <path d="m3 11 9-7 9 7" />
    <path d="M5 10.5V21h14V10.5" />
    <path d="M12 13v5" />
    <path d="M9.5 15.5h5" />
  </>
));

export const ImagePlus = createIcon("ImagePlus", (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m7 16 3-3 2 2 3-4 2 3" />
    <circle cx="8" cy="9" r="1.2" />
    <path d="M17 6v4" />
    <path d="M15 8h4" />
  </>
));

export const LayoutDashboard = createIcon("LayoutDashboard", (
  <>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="5" rx="1.5" />
    <rect x="13" y="10" width="8" height="11" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
  </>
));

export const LockKeyhole = createIcon("LockKeyhole", (
  <>
    <rect x="5" y="10" width="14" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 15v2" />
  </>
));

export const LogOut = createIcon("LogOut", (
  <>
    <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
    <path d="M14 8l4 4-4 4" />
    <path d="M18 12H9" />
  </>
));

export const Mail = createIcon("Mail", (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </>
));

export const Menu = createIcon("Menu", (
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>
));

export const MessageCircle = createIcon("MessageCircle", (
  <>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L4 20l1-4.5A8.5 8.5 0 1 1 21 11.5Z" />
    <path d="M8.5 11h7" />
    <path d="M8.5 14h4.5" />
  </>
));

export const MessageSquareText = createIcon("MessageSquareText", (
  <>
    <path d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3.5A2 2 0 0 1 3 16V7a2 2 0 0 1 2-2Z" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </>
));

export const MoreHorizontal = createIcon("MoreHorizontal", (
  <>
    <circle cx="6" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="18" cy="12" r="1" />
  </>
));

export const Phone = createIcon("Phone", (
  <path d="M6.5 4.5 9 7c.6.6.6 1.5.1 2.1L8 10.4a13.5 13.5 0 0 0 5.6 5.6l1.3-1.1c.6-.5 1.5-.4 2.1.1l2.5 2.5c.6.6.7 1.6.1 2.2-.9 1-2.2 1.5-3.6 1.2C9.6 19.9 4.1 14.4 3.1 8c-.2-1.4.2-2.7 1.2-3.6.6-.6 1.6-.5 2.2.1Z" />
));

export const Plus = createIcon("Plus", (
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>
));

export const Receipt = createIcon("Receipt", (
  <>
    <path d="M6 3h12v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L6 21V3Z" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </>
));

export const Search = createIcon("Search", (
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4 4" />
  </>
));

export const Settings = createIcon("Settings", (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7.5 7.5 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-1.8-1L14.4 3h-4.8l-.3 3.1a7.5 7.5 0 0 0-1.8 1l-2.4-1-2 3.4 2 1.5A7.5 7.5 0 0 0 5 12c0 .3 0 .7.1 1l-2 1.5 2 3.4 2.4-1a7.5 7.5 0 0 0 1.8 1l.3 3.1h4.8l.3-3.1a7.5 7.5 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
  </>
));

export const ShieldCheck = createIcon("ShieldCheck", (
  <>
    <path d="M12 3 20 6v5.5c0 4.5-3.2 7.8-8 9.5-4.8-1.7-8-5-8-9.5V6l8-3Z" />
    <path d="m8.5 12 2.3 2.3 4.7-5" />
  </>
));

export const Sparkles = createIcon("Sparkles", (
  <>
    <path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path d="M5 15.5 5.8 18 8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-1L5 15.5Z" />
    <path d="M19 3.5 19.7 6 22 7l-2.3.8L19 10l-.8-2.2L16 7l2.2-1L19 3.5Z" />
  </>
));

export const TrendingUp = createIcon("TrendingUp", (
  <>
    <path d="m3 17 6-6 4 4 7-8" />
    <path d="M15 7h5v5" />
  </>
));

export const UserPlus = createIcon("UserPlus", (
  <>
    <circle cx="9" cy="8" r="4" />
    <path d="M3 21a6 6 0 0 1 12 0" />
    <path d="M19 8v6" />
    <path d="M16 11h6" />
  </>
));

export const UserRound = createIcon("UserRound", (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
  </>
));

export const UsersRound = createIcon("UsersRound", (
  <>
    <circle cx="9" cy="8" r="4" />
    <path d="M3 21a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3.5 3.5 0 0 1 0 5" />
    <path d="M17 15a5 5 0 0 1 4 5" />
  </>
));

export const Wrench = createIcon("Wrench", (
  <path d="M21 6.5a5.5 5.5 0 0 1-7.3 5.2L6.5 19a2.1 2.1 0 0 1-3-3l7.3-7.2A5.5 5.5 0 0 1 17.5 2l-3.2 3.2 4.5 4.5L21 6.5Z" />
));

export const X = createIcon("X", (
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>
));

import {
  Building2,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Network,
  Scale,
  ScrollText,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Role = "aicte" | "institution";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

export const NAV: Record<Role, NavGroup[]> = {
  aicte: [
    {
      heading: "Monitoring",
      items: [
        { label: "National overview", href: "/aicte", icon: LayoutDashboard },
        { label: "Institutions", href: "/aicte/institutions", icon: Building2 },
      ],
    },
    {
      heading: "Integrity",
      items: [
        { label: "Review queue", href: "/aicte/review", icon: ClipboardCheck, count: 11 },
        { label: "Fraud rings", href: "/aicte/fraud-rings", icon: Network, count: 1 },
        { label: "Policy rules", href: "/aicte/policy", icon: Scale },
      ],
    },
    {
      heading: "Records",
      items: [
        { label: "Reports", href: "/aicte/reports", icon: FileText },
        { label: "Audit log", href: "/aicte/audit", icon: ScrollText },
      ],
    },
  ],
  institution: [
    {
      heading: "Admissions 2026–27",
      items: [
        { label: "Dashboard", href: "/institution", icon: LayoutDashboard },
        { label: "Submit records", href: "/institution/upload", icon: Upload },
        { label: "Student records", href: "/institution/students", icon: Users, count: 6 },
      ],
    },
    {
      heading: "Compliance",
      items: [{ label: "Reports & returns", href: "/institution/reports", icon: FileSpreadsheet }],
    },
  ],
};

export const USERS: Record<Role, { name: string; initials: string; role: string; org: string }> = {
  aicte: { name: "Rekha Menon", initials: "RM", role: "Deputy Director", org: "AICTE · Approval Bureau" },
  institution: { name: "Prakash Hegde", initials: "PH", role: "Admissions Officer (Maker)", org: "Kaveri College of Engineering" },
};

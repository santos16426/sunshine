import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  FolderOpen,
  Briefcase,
  CreditCard,
  Settings,
  Palette,
} from "lucide-react";
import type { AuthUser } from "@/features/auth";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

/** Admin sidebar nav (for now). */
const ADMIN_NAV: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scheduling", href: "/scheduling", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Therapists", href: "/therapists", icon: Stethoscope },
  { name: "Doctor Directory", href: "/doctors", icon: FolderOpen },
  { name: "Services", href: "/services", icon: Briefcase },
  // { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Appearance", href: "/settings", icon: Palette },
];

export function getNavigation(_user: AuthUser | null): NavigationItem[] {
  // TODO: Implement navigation for other roles
  return ADMIN_NAV;
}

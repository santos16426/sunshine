import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  FolderOpen,
  Briefcase,
  CreditCard,
  Palette,
} from "lucide-react";
import type { PublicUser } from "@/features/users";

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
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Appearance", href: "/settings", icon: Palette },
];

const SECRETARY_NAV: NavigationItem[] = [
  { name: "Scheduling", href: "/scheduling", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Therapists", href: "/therapists", icon: Stethoscope },
];

export function getNavigation(profile: PublicUser | null): NavigationItem[] {
  if (profile?.role === "secretary") return SECRETARY_NAV;
  return ADMIN_NAV;
}

"use client";

import Link from "next/link";
import { Megaphone, UserPlus, PlusCircle } from "lucide-react";

const actions = [
  {
    label: "Broadcast",
    href: "#",
    icon: Megaphone,
    className: "text-primary bg-primary/10 border-primary/20",
  },
  {
    label: "Register",
    href: "/patients",
    icon: UserPlus,
    className: "text-chart-2 bg-chart-2/20 border-chart-2/30",
  },
  {
    label: "Booking",
    href: "/scheduling",
    icon: PlusCircle,
    className: "text-foreground bg-muted border-border",
  },
] as const;

export function QuickActions() {
  return (
    <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Quick Actions
        </h4>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[24px] border transition-all duration-300 hover:shadow-lg hover:shadow-muted/50 active:scale-[0.95] group ${action.className}`}
            >
              <span className="p-1 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-center text-[9px] font-bold uppercase tracking-wider opacity-80">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

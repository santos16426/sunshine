"use client";

import { useEffect } from "react";
import {
  DollarSign,
  Activity,
  Layers,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { StatBox } from "./StatBox";
import { QuickActions } from "./QuickActions";
import { ActiveStars } from "./ActiveStars";
import { ClinicalTeam } from "./ClinicalTeam";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { usePublicUser } from "@/features/users";

const emptyStats = {
  total_revenue: 0,
  total_sessions: 0,
  active_services: 0,
  total_therapists: 0,
};

function formatRevenue(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardOverview() {
  const { stats, topPatients, therapists, isLoading, error, fetchDashboard } =
    useDashboardStore();

  const { profile } = usePublicUser();
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const s = stats ?? emptyStats;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="font-semibold text-destructive">{error}</p>
          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="mt-3 rounded-xl bg-destructive/20 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const greetingName = profile?.full_name?.trim()?.split(/\s+/)[0] ?? "";
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left mb-5">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
              Active Practitioner
            </span>
          </div>
          <h2 className="text-5xl font-medium text-foreground mb-1 tracking-tight">
            {greetingName ? `Good day, ${greetingName}` : "Dashboard"}
          </h2>
        </div>
      </header>

      {/* Stat Grid: Total Revenue, Total Sessions, Active Programs, Total Therapists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatBox
          label="Total Revenue"
          value={formatRevenue(s.total_revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          accent="primary"
        />
        <StatBox
          label="Total Sessions"
          value={s.total_sessions.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
          accent="chart-1"
        />
        <StatBox
          label="Active Programs"
          value={s.active_services}
          trend="On Track"
          icon={<Layers className="h-5 w-5" />}
          accent="chart-2"
        />
        <StatBox
          label="Total Therapists"
          value={s.total_therapists}
          icon={<Stethoscope className="h-5 w-5" />}
          accent="chart-3"
        />
      </div>

      {/* Two columns: Active Stars (top 5 by sessions) | Quick Actions + Clinical Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="min-w-0">
          <ActiveStars patients={topPatients} />
        </div>
        <div className="space-y-8 h-full flex flex-col">
          <QuickActions />
          <ClinicalTeam therapists={therapists} />
        </div>
      </div>
    </div>
  );
}

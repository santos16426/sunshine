"use client";

import Link from "next/link";
import { ChevronRight, Stethoscope } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { TherapistSummary } from "../types";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ClinicalTeamProps {
  therapists: TherapistSummary[];
}

export function ClinicalTeam({ therapists }: ClinicalTeamProps) {
  return (
    <div className="rounded-[40px] border border-border bg-card p-8 shadow-sm grow">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Clinical Team
        </h4>
        {therapists.length > 0 && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {therapists.length} Active
          </span>
        )}
      </div>
      <div className="space-y-6">
        {therapists.length > 0 ? (
          therapists.map((t) => (
            <Link
              key={t.id}
              href={`/therapists/${t.id}`}
              className="flex items-center justify-between gap-2 rounded-2xl p-2 transition-colors hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-primary-foreground shadow-md transition-transform group-hover:scale-110 ${!t.calendar_color ? "bg-primary" : ""}`}
                  style={
                    t.calendar_color
                      ? { backgroundColor: t.calendar_color }
                      : undefined
                  }
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground tracking-tight">
                    {t.name}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    {t.therapist_type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            icon={<Stethoscope className="h-7 w-7" />}
            title="Clinical Team"
            description="No therapists yet. Start by creating a new therapist."
            actionLabel="Create new Therapists"
            actionHref="/therapists"
          />
        )}
      </div>
      {therapists.length > 0 && (
        <Link
          href="/therapists"
          className="mt-8 flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-primary-foreground shadow-md transition-colors hover:opacity-90"
        >
          Full Directory
        </Link>
      )}
    </div>
  );
}

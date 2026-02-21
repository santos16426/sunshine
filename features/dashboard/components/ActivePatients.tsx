"use client";

import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { PatientSummary } from "../types";

const AVATAR_CLASSES = [
  "bg-primary/15 text-primary",
  "bg-chart-1/20 text-chart-1",
  "bg-chart-2/20 text-chart-2",
  "bg-chart-3/20 text-chart-3",
  "bg-chart-4/20 text-chart-4",
  "bg-chart-5/20 text-chart-5",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ActivePatientsProps {
  patients: PatientSummary[];
}

export function ActivePatients({ patients }: ActivePatientsProps) {
  if (patients.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7" />}
        title="Active patients"
        description="No patients yet. Create one from Quick actions."
        actionLabel="Go to Patients"
        actionHref="/patients"
      />
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Active patients</h3>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent
          </p>
        </div>
        <Link
          href="/patients"
          className="rounded-xl border border-border bg-muted px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y divide-border">
        {patients.map((p, i) => (
          <li key={p.id}>
            <Link
              href={`/patients?edit=${p.id}`}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${AVATAR_CLASSES[i % AVATAR_CLASSES.length]}`}
                >
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{p.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {p.guardian_name}
                    {p.medical_diagnosis ? ` · ${p.medical_diagnosis}` : ""}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

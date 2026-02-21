"use client";

import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientListHeaderProps {
  patientCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddPatient: () => void;
}

export function PatientListHeader({
  patientCount,
  searchTerm,
  onSearchChange,
  onAddPatient,
}: PatientListHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl sm:text-4xl font-medium text-foreground tracking-tight">
          Patient Records
        </h2>
        <p className="text-sm text-muted-foreground">
          Managing {patientCount} patient record{patientCount !== 1 ? "s" : ""}.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-3 rounded-full border border-border bg-muted px-4 py-2.5 flex-1 sm:flex-initial sm:w-48 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm flex-1 min-w-0 text-foreground placeholder:text-muted-foreground"
            placeholder="Search by name..."
          />
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Button onClick={onAddPatient} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>
    </header>
  );
}

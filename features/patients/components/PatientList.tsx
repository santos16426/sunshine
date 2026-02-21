"use client";

import type { Patient } from "../types";
import type { PatientFormData } from "../types";
import { PatientListCard } from "./PatientListCard";
import { PatientListTable } from "./PatientListTable";

interface PatientWithDoctorName extends Patient {
  doctor_name?: string;
}

interface PatientListProps {
  patients: PatientWithDoctorName[];
  onEdit: (patient: PatientFormData & { id: string }) => void;
  onDelete: (id: string) => void;
  emptyState: React.ReactNode;
}

export function PatientList({
  patients,
  onEdit,
  onDelete,
  emptyState,
}: PatientListProps) {
  if (patients.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <div className="md:hidden space-y-4 px-3 py-3 sm:px-4 sm:py-4">
        {patients.map((p) => (
          <PatientListCard
            key={p.id}
            patient={p}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div className="hidden md:block">
        <PatientListTable patients={patients} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </>
  );
}

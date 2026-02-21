"use client";

import type { Doctor } from "../types";
import type { DoctorFormData } from "../types";
import { DoctorListCard } from "./DoctorListCard";
import { DoctorListTable } from "./DoctorListTable";

interface DoctorListProps {
  doctors: Doctor[];
  onEdit: (doctor: DoctorFormData & { id: string }) => void;
  onDelete: (id: string) => void;
  emptyState: React.ReactNode;
}

export function DoctorList({
  doctors,
  onEdit,
  onDelete,
  emptyState,
}: DoctorListProps) {
  if (doctors.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <div className="md:hidden space-y-4 px-3 py-3 sm:px-4 sm:py-4">
        {doctors.map((d) => (
          <DoctorListCard key={d.id} doctor={d} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <div className="hidden md:block">
        <DoctorListTable doctors={doctors} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </>
  );
}

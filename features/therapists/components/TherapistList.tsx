"use client";

import type { Therapist } from "../types";
import type { TherapistFormData } from "../types";
import { TherapistListCard } from "./TherapistListCard";
import { TherapistListTable } from "./TherapistListTable";

interface TherapistListProps {
  therapists: Therapist[];
  onEdit: (therapist: TherapistFormData & { id: string }) => void;
  onDelete: (id: string) => void;
  emptyState: React.ReactNode;
}

export function TherapistList({
  therapists,
  onEdit,
  onDelete,
  emptyState,
}: TherapistListProps) {
  if (therapists.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <div className="md:hidden space-y-4 px-3 py-3 sm:px-4 sm:py-4">
        {therapists.map((t) => (
          <TherapistListCard key={t.id} therapist={t} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <div className="hidden md:block">
        <TherapistListTable therapists={therapists} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </>
  );
}

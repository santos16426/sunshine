"use client";

import { Pencil, Phone, Trash2 } from "lucide-react";
import type { Therapist } from "../types";
import type { TherapistFormData } from "../types";

interface TherapistListCardProps {
  therapist: Therapist;
  onEdit: (therapist: TherapistFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function TherapistListCard({
  therapist: t,
  onEdit,
  onDelete,
}: TherapistListCardProps) {
  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-foreground leading-tight truncate capitalize">
              {t.name.toLowerCase()}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t.therapist_type}
            </p>
          </div>
          <span
            className="w-10 h-10 rounded-xl border border-border shrink-0"
            style={{ backgroundColor: t.calendar_color }}
            title={t.calendar_color}
          />
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center gap-2 text-muted-foreground">
        <Phone className="w-4 h-4 shrink-0" />
        <span className="text-sm truncate">{t.contact_number}</span>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() =>
            onEdit({
              id: t.id,
              name: t.name,
              therapist_type: t.therapist_type,
              contact_number: t.contact_number,
              calendar_color: t.calendar_color,
            })
          }
          className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <Pencil className="w-4 h-4 shrink-0" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(t.id)}
          className="min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-xl border border-border text-destructive font-semibold text-sm hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          Delete
        </button>
      </div>
    </article>
  );
}

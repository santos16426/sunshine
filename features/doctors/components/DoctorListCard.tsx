"use client";

import { Pencil, Phone, Trash2 } from "lucide-react";
import type { Doctor } from "../types";
import type { DoctorFormData } from "../types";

interface DoctorListCardProps {
  doctor: Doctor;
  onEdit: (doctor: DoctorFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function DoctorListCard({ doctor: d, onEdit, onDelete }: DoctorListCardProps) {
  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 pb-3">
        <h3 className="text-lg font-bold text-foreground leading-tight truncate">
          {d.name}
        </h3>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4 shrink-0" />
          <span className="text-sm truncate">{d.contact_information}</span>
        </div>
        <p className="text-sm text-foreground truncate">
          {d.hospital_affiliation}
        </p>
        {d.remarks && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {d.remarks}
          </p>
        )}
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() =>
            onEdit({
              id: d.id,
              name: d.name,
              contact_information: d.contact_information,
              hospital_affiliation: d.hospital_affiliation,
              remarks: d.remarks ?? "",
            })
          }
          className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <Pencil className="w-4 h-4 shrink-0" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(d.id)}
          className="min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-xl border border-border text-destructive font-semibold text-sm hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          Delete
        </button>
      </div>
    </article>
  );
}

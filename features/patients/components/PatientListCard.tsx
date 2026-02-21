"use client";

import { Pencil, Phone, Trash2, User } from "lucide-react";
import type { Patient } from "../types";
import type { PatientFormData } from "../types";

interface PatientWithDoctorName extends Patient {
  doctor_name?: string;
}

interface PatientListCardProps {
  patient: PatientWithDoctorName;
  onEdit: (patient: PatientFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function PatientListCard({ patient: p, onEdit, onDelete }: PatientListCardProps) {
  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-foreground leading-tight truncate">
            {p.name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pb-4">
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
            Age
          </p>
          <p className="text-sm font-bold text-foreground">{p.age} yrs</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
            Doctor
          </p>
          <p className="text-sm font-bold text-foreground truncate">
            {p.doctor_name ?? "—"}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <User className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Guardian
            </p>
            <p className="text-sm font-bold text-foreground truncate">
              {p.guardian_name}
            </p>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
              <Phone className="w-3 h-3 shrink-0" />
              <span className="text-xs truncate">{p.guardian_contact_number}</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
            Diagnosis
          </p>
          <p className="text-sm text-foreground truncate">
            {p.medical_diagnosis}
          </p>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() =>
            onEdit({
              id: p.id,
              name: p.name,
              date_of_birth: p.date_of_birth,
              age: p.age,
              guardian_name: p.guardian_name,
              guardian_relationship: p.guardian_relationship,
              guardian_contact_number: p.guardian_contact_number,
              medical_diagnosis: p.medical_diagnosis,
              doctor_id: p.doctor_id,
              remarks: p.remarks ?? "",
            })
          }
          className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <Pencil className="w-4 h-4 shrink-0" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(p.id)}
          className="min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-xl border border-border text-destructive font-semibold text-sm hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          Delete
        </button>
      </div>
    </article>
  );
}

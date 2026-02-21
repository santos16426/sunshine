"use client";

import { Pencil, Phone, Trash2 } from "lucide-react";
import type { Patient } from "../types";
import type { PatientFormData } from "../types";

interface PatientWithDoctorName extends Patient {
  doctor_name?: string;
}

interface PatientListTableProps {
  patients: PatientWithDoctorName[];
  onEdit: (patient: PatientFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function PatientListTable({ patients, onEdit, onDelete }: PatientListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[640px]">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Full Name
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Age
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Guardian
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Medical Diagnosis
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Doctor
            </th>
            <th className="px-4 lg:px-8 py-4 lg:py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {patients.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-muted/50 transition-colors group"
            >
              <td className="px-6 lg:px-8 py-4 lg:py-6">
                <p className="text-sm font-bold text-foreground truncate max-w-[180px]">
                  {p.name}
                </p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-muted-foreground">{p.age} yrs</p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground truncate max-w-[140px]">
                    {p.guardian_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span className="text-xs truncate max-w-[120px]">
                      {p.guardian_contact_number}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-muted-foreground truncate max-w-[160px]">
                  {p.medical_diagnosis}
                </p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-foreground truncate max-w-[120px]">
                  {p.doctor_name ?? "—"}
                </p>
              </td>
              <td className="px-4 lg:px-8 py-4 lg:py-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-primary/30 hover:bg-card text-muted-foreground hover:text-primary transition-all"
                    title="Edit Patient"
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
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-destructive/30 hover:bg-card text-muted-foreground hover:text-destructive transition-all"
                    title="Delete Patient"
                    onClick={() => onDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

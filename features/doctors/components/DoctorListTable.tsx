"use client";

import { Pencil, Phone, Trash2 } from "lucide-react";
import type { Doctor } from "../types";
import type { DoctorFormData } from "../types";

interface DoctorListTableProps {
  doctors: Doctor[];
  onEdit: (doctor: DoctorFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function DoctorListTable({ doctors, onEdit, onDelete }: DoctorListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[640px]">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Name
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Contact
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Hospital
            </th>
            <th className="px-4 lg:px-8 py-4 lg:py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {doctors.map((d) => (
            <tr
              key={d.id}
              className="hover:bg-muted/50 transition-colors group"
            >
              <td className="px-6 lg:px-8 py-4 lg:py-6">
                <p className="text-sm font-bold text-foreground truncate max-w-[180px]">
                  {d.name}
                </p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="text-sm truncate max-w-[160px]">
                    {d.contact_information}
                  </span>
                </div>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                  {d.hospital_affiliation}
                </p>
              </td>
              <td className="px-4 lg:px-8 py-4 lg:py-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-primary/30 hover:bg-card text-muted-foreground hover:text-primary transition-all"
                    title="Edit Doctor"
                    onClick={() =>
                      onEdit({
                        id: d.id,
                        name: d.name,
                        contact_information: d.contact_information,
                        hospital_affiliation: d.hospital_affiliation,
                        remarks: d.remarks ?? "",
                      })
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-destructive/30 hover:bg-card text-muted-foreground hover:text-destructive transition-all"
                    title="Delete Doctor"
                    onClick={() => onDelete(d.id)}
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

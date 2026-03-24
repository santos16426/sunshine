"use client";

import { Pencil, Phone, Trash2 } from "lucide-react";
import type { Therapist } from "../types";
import type { TherapistFormData } from "../types";

interface TherapistListTableProps {
  therapists: Therapist[];
  onEdit: (therapist: TherapistFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function TherapistListTable({
  therapists,
  onEdit,
  onDelete,
}: TherapistListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[640px]">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Name
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Type
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Contact
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Calendar Color
            </th>
            <th className="px-4 lg:px-8 py-4 lg:py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {therapists.map((t) => (
            <tr
              key={t.id}
              className="hover:bg-muted/50 transition-colors group"
            >
              <td className="px-6 lg:px-8 py-4 lg:py-6">
                <p className="text-sm font-bold text-foreground truncate max-w-[180px] capitalize">
                  {t.name.toLowerCase()}
                </p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-muted-foreground">
                  {t.therapist_type}
                </p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="text-sm truncate max-w-[140px]">
                    {t.contact_number}
                  </span>
                </div>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-6 h-6 rounded-md border border-border shrink-0"
                    style={{ backgroundColor: t.calendar_color }}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {t.calendar_color}
                  </span>
                </div>
              </td>
              <td className="px-4 lg:px-8 py-4 lg:py-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-primary/30 hover:bg-card text-muted-foreground hover:text-primary transition-all"
                    title="Edit Therapist"
                    onClick={() =>
                      onEdit({
                        id: t.id,
                        name: t.name,
                        therapist_type: t.therapist_type,
                        contact_number: t.contact_number,
                        calendar_color: t.calendar_color,
                      })
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-destructive/30 hover:bg-card text-muted-foreground hover:text-destructive transition-all"
                    title="Delete Therapist"
                    onClick={() => onDelete(t.id)}
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

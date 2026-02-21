"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "../types";
import type { ServiceFormData } from "../types";

interface ServiceListTableProps {
  services: Service[];
  onEdit: (service: ServiceFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

function formatRate(n: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(n);
}

export function ServiceListTable({ services, onEdit, onDelete }: ServiceListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[640px]">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Name
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Rate/hour
            </th>
            <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Clinic cut
            </th>
            <th className="px-4 lg:px-8 py-4 lg:py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {services.map((s) => (
            <tr
              key={s.id}
              className="hover:bg-muted/50 transition-colors group"
            >
              <td className="px-6 lg:px-8 py-4 lg:py-6">
                <p className="text-sm font-bold text-foreground truncate max-w-[200px]">
                  {s.name}
                </p>
                {s.description && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">
                    {s.description}
                  </p>
                )}
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-foreground">
                  {formatRate(s.rate_per_hour)}
                </p>
              </td>
              <td className="px-4 lg:px-6 py-4 lg:py-6">
                <p className="text-sm text-muted-foreground">
                  {s.clinic_cut}%
                </p>
              </td>
              <td className="px-4 lg:px-8 py-4 lg:py-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-primary/30 hover:bg-card text-muted-foreground hover:text-primary transition-all"
                    title="Edit Service"
                    onClick={() =>
                      onEdit({
                        id: s.id,
                        name: s.name,
                        description: s.description ?? "",
                        rate_per_hour: s.rate_per_hour,
                        clinic_cut: s.clinic_cut,
                      })
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-transparent hover:border-destructive/30 hover:bg-card text-muted-foreground hover:text-destructive transition-all"
                    title="Delete Service"
                    onClick={() => onDelete(s.id)}
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

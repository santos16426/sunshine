"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "../types";
import type { ServiceFormData } from "../types";

interface ServiceListCardProps {
  service: Service;
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

export function ServiceListCard({ service: s, onEdit, onDelete }: ServiceListCardProps) {
  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 pb-3">
        <h3 className="text-lg font-bold text-foreground leading-tight truncate">
          {s.name}
        </h3>
        {s.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {s.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pb-4">
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
            Rate/hour
          </p>
          <p className="text-sm font-bold text-foreground">
            {formatRate(s.rate_per_hour)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
            Clinic cut
          </p>
          <p className="text-sm font-bold text-foreground">{s.clinic_cut}%</p>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() =>
            onEdit({
              id: s.id,
              name: s.name,
              description: s.description ?? "",
              rate_per_hour: s.rate_per_hour,
              clinic_cut: s.clinic_cut,
            })
          }
          className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <Pencil className="w-4 h-4 shrink-0" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(s.id)}
          className="min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-xl border border-border text-destructive font-semibold text-sm hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          Delete
        </button>
      </div>
    </article>
  );
}

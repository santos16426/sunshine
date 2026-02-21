"use client";

import type { Service } from "../types";
import type { ServiceFormData } from "../types";
import { ServiceListCard } from "./ServiceListCard";
import { ServiceListTable } from "./ServiceListTable";

interface ServiceListProps {
  services: Service[];
  onEdit: (service: ServiceFormData & { id: string }) => void;
  onDelete: (id: string) => void;
  emptyState: React.ReactNode;
}

export function ServiceList({
  services,
  onEdit,
  onDelete,
  emptyState,
}: ServiceListProps) {
  if (services.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <div className="md:hidden space-y-4 px-3 py-3 sm:px-4 sm:py-4">
        {services.map((s) => (
          <ServiceListCard key={s.id} service={s} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <div className="hidden md:block">
        <ServiceListTable services={services} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </>
  );
}

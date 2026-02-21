"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useServiceStore,
  ServiceForm,
  ServiceList,
  ServiceListHeader,
  ServiceEmptyState,
} from "@/features/services";
import type { ServiceFormData } from "@/features/services";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServiceStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialData, setInitialData] = useState<
    (ServiceFormData & { id: string }) | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");

  const loadServices = useCallback(() => {
    void fetchServices(searchTerm || undefined);
  }, [fetchServices, searchTerm]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleSubmit = async (
    formData: ServiceFormData,
  ): Promise<string | null> => {
    try {
      if (initialData?.id) {
        await updateService(initialData.id, formData);
      } else {
        await createService(formData);
      }
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Failed to save service";
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setInitialData(undefined);
  };

  const handleEdit = (service: ServiceFormData & { id: string }) => {
    setInitialData(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const s = services.find((x) => x.id === id);
    if (!s) return;
    if (!window.confirm(`Delete service "${s.name}"? This cannot be undone.`))
      return;
    try {
      await deleteService(id);
      toast.success("Service deleted.");
    } catch {
      toast.error("Failed to delete service.");
    }
  };

  return (
    <>
      <ServiceForm
        isOpen={isFormOpen}
        initialData={initialData}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />

      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 text-left">
        <ServiceListHeader
          serviceCount={services.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddService={() => {
            setInitialData(undefined);
            setIsFormOpen(true);
          }}
        />

        <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <ServiceList
              services={services}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyState={
                <ServiceEmptyState
                  icon={<Briefcase className="w-8 h-8" />}
                  title="No Services Yet"
                  description="Add service offerings with rates and clinic cut to use in scheduling."
                  buttonLabel="Add Service"
                  onButtonClick={() => {
                    setInitialData(undefined);
                    setIsFormOpen(true);
                  }}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

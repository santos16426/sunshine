"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useDoctorStore,
  DoctorForm,
  DoctorList,
  DoctorListHeader,
  DoctorEmptyState,
} from "@/features/doctors";
import type { DoctorFormData } from "@/features/doctors";
import { FolderOpen } from "lucide-react";
import { toast } from "sonner";

export default function DoctorsPage() {
  const {
    doctors,
    isLoading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  } = useDoctorStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialData, setInitialData] = useState<
    (DoctorFormData & { id: string }) | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");

  const loadDoctors = useCallback(() => {
    void fetchDoctors(searchTerm || undefined);
  }, [fetchDoctors, searchTerm]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleSubmit = async (formData: DoctorFormData): Promise<string | null> => {
    try {
      if (initialData?.id) {
        await updateDoctor(initialData.id, formData);
      } else {
        await createDoctor(formData);
      }
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Failed to save doctor";
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setInitialData(undefined);
  };

  const handleEdit = (doctor: DoctorFormData & { id: string }) => {
    setInitialData(doctor);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const d = doctors.find((x) => x.id === id);
    if (!d) return;
    if (!window.confirm(`Delete doctor "${d.name}"? This cannot be undone.`)) return;
    try {
      await deleteDoctor(id);
      toast.success("Doctor deleted.");
    } catch {
      toast.error("Failed to delete doctor.");
    }
  };

  return (
    <>
      <DoctorForm
        isOpen={isFormOpen}
        initialData={initialData}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />

      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 text-left">
        <DoctorListHeader
          doctorCount={doctors.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddDoctor={() => {
            setInitialData(undefined);
            setIsFormOpen(true);
          }}
        />

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <DoctorList
              doctors={doctors}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyState={
                <DoctorEmptyState
                  icon={<FolderOpen className="w-8 h-8" />}
                  title="No Doctors in Directory"
                  description="Add referring doctors to assign patients and track affiliations."
                  buttonLabel="Add Doctor"
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

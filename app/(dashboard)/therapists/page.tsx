"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useTherapistStore,
  TherapistForm,
  TherapistList,
  TherapistListHeader,
  TherapistEmptyState,
} from "@/features/therapists";
import type { TherapistFormData } from "@/features/therapists";
import type { TherapyTypeOption } from "@/features/therapists/services/therapist.service";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function TherapistsPage() {
  const {
    therapists,
    isLoading,
    error,
    fetchTherapists,
    createTherapist,
    updateTherapist,
    deleteTherapist,
  } = useTherapistStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialData, setInitialData] = useState<
    (TherapistFormData & { id: string }) | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [therapyTypes, setTherapyTypes] = useState<TherapyTypeOption[]>([]);

  const loadTherapists = useCallback(() => {
    void fetchTherapists(searchTerm || undefined);
  }, [fetchTherapists, searchTerm]);

  useEffect(() => {
    loadTherapists();
  }, [loadTherapists]);

  const handleSubmit = async (
    formData: TherapistFormData,
  ): Promise<string | null> => {
    try {
      if (initialData?.id) {
        await updateTherapist(initialData.id, formData);
      } else {
        await createTherapist(formData);
      }
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Failed to save therapist";
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setInitialData(undefined);
  };

  const handleEdit = (therapist: TherapistFormData & { id: string }) => {
    setInitialData(therapist);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const t = therapists.find((x) => x.id === id);
    if (!t) return;
    if (!window.confirm(`Delete therapist "${t.name}"? This cannot be undone.`))
      return;
    try {
      await deleteTherapist(id);
      toast.success("Therapist deleted.");
    } catch {
      toast.error("Failed to delete therapist.");
    }
  };

  return (
    <>
      <TherapistForm
        isOpen={isFormOpen}
        initialData={initialData}
        therapyTypes={therapyTypes.length > 0 ? therapyTypes : undefined}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />

      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 text-left">
        <TherapistListHeader
          therapistCount={therapists.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddTherapist={() => {
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
            <TherapistList
              therapists={therapists}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyState={
                <TherapistEmptyState
                  icon={<UserPlus className="w-8 h-8" />}
                  title="No Therapists Yet"
                  description="Add therapists to your practice to manage schedules and assign appointments."
                  buttonLabel="Add Therapist"
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

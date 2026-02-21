"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  usePatientStore,
  PatientForm,
  PatientList,
  PatientListHeader,
  PatientEmptyState,
} from "@/features/patients";
import type { PatientFormData } from "@/features/patients";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function PatientsPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    patients,
    doctors,
    isLoading,
    error,
    fetchPatients,
    fetchDoctors,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatientStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialData, setInitialData] = useState<
    (PatientFormData & { id: string }) | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (editId && patients.length > 0 && !initialData) {
      const p = patients.find((x) => x.id === editId);
      if (p) {
        setInitialData({
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
        });
        setIsFormOpen(true);
      }
    }
  }, [editId, patients, initialData]);

  const handleDelete = async (id: string) => {
    const p = patients.find((x) => x.id === id);
    if (!p) return;
    if (!window.confirm(`Delete patient "${p.name}"? This cannot be undone.`))
      return;
    try {
      await deletePatient(id);
      toast.success("Patient deleted.");
    } catch {
      toast.error("Failed to delete patient.");
    }
  };

  const loadPatients = useCallback(() => {
    void fetchPatients(searchTerm || undefined);
  }, [fetchPatients, searchTerm]);

  useEffect(() => {
    void fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleSubmit = async (
    formData: PatientFormData,
  ): Promise<string | null> => {
    try {
      if (initialData?.id) {
        await updatePatient(initialData.id, formData);
      } else {
        await createPatient(formData);
      }
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Failed to save patient";
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setInitialData(undefined);
  };

  const handleEdit = (patient: PatientFormData & { id: string }) => {
    setInitialData(patient);
    setIsFormOpen(true);
  };

  return (
    <>
      <PatientForm
        isOpen={isFormOpen}
        initialData={initialData}
        doctors={doctors}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />

      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 text-left">
        <PatientListHeader
          patientCount={patients.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddPatient={() => {
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
            <PatientList
              patients={patients}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyState={
                <PatientEmptyState
                  icon={<UserPlus className="w-8 h-8" />}
                  title="No Records Found"
                  description="Your registry is currently empty. Start by enrolling your first patient to begin clinical documentation."
                  buttonLabel="Enroll New Patient"
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

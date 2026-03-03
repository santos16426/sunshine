"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { PatientFormData } from "../types";
import { patientFormSchema } from "../schemas/patient.schema";

function computeAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return Math.max(0, age);
}

const blankFormData: PatientFormData = {
  name: "",
  date_of_birth: "",
  age: 0,
  guardian_name: "",
  guardian_relationship: "",
  guardian_contact_number: "",
  medical_diagnosis: "",
  doctor_id: "",
  remarks: "",
};

interface PatientFormProps {
  isOpen: boolean;
  initialData?: PatientFormData & { id?: string };
  doctors: { id: string; name: string }[];
  onSubmit: (data: PatientFormData) => Promise<string | null>;
  onClose: () => void;
}

export function PatientForm({
  isOpen,
  initialData,
  doctors,
  onSubmit,
  onClose,
}: PatientFormProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<PatientFormData>(
    initialData ?? blankFormData,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PatientFormData, string>>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? blankFormData);
      setSubmitError(null);
      setFieldErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (
    field: keyof PatientFormData,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "date_of_birth" && typeof value === "string") {
      setForm((prev) => ({ ...prev, age: computeAge(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = patientFormSchema.safeParse({
      ...form,
      age: form.date_of_birth ? computeAge(form.date_of_birth) : form.age,
    });
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      const byField: Partial<Record<keyof PatientFormData, string>> = {};
      if (issues.fieldErrors) {
        for (const [k, v] of Object.entries(issues.fieldErrors)) {
          const msg = Array.isArray(v) ? v[0] : v;
          if (msg) byField[k as keyof PatientFormData] = msg;
        }
      }
      setFieldErrors(byField);
      const first = issues.formErrors?.[0] ?? Object.values(byField)[0];
      if (first) toast.error(first);
      return;
    }
    const payload: PatientFormData = { ...form, age: parsed.data.age };
    if (payload.doctor_id === "") {
      delete (payload as any).doctor_id;
    }
    setIsSaving(true);
    try {
      const error = await onSubmit(payload);
      if (error) {
        setSubmitError(error);
        toast.error(error);
        return;
      }
      toast.success(
        isEdit
          ? "Patient updated successfully."
          : "Patient enrolled successfully.",
      );
      onClose();
      setForm(blankFormData);
    } catch {
      const msg = "Failed to save patient";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = () => {
    onClose();
    setForm(blankFormData);
    setSubmitError(null);
    setFieldErrors({});
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="patient-modal-title"
          className="text-2xl font-bold text-foreground p-6 pb-0"
        >
          {isEdit ? "Edit Patient" : "Enroll Patient"}
        </h2>
        <p className="text-sm text-muted-foreground px-6 pt-1">
          {isEdit
            ? "Update patient details."
            : "Add a new patient to the registry."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto no-scrollbar flex-1 px-6 py-6 space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Patient Identity
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Full Name *
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value)
                    }
                    className="bg-muted border-border"
                    aria-invalid={Boolean(fieldErrors.date_of_birth)}
                  />
                  {fieldErrors.date_of_birth && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.date_of_birth}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Age
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={form.age || ""}
                    onChange={(e) =>
                      handleChange("age", parseInt(e.target.value, 10) || 0)
                    }
                    placeholder="Auto"
                    className="bg-muted border-border"
                    aria-invalid={Boolean(fieldErrors.age)}
                  />
                  {fieldErrors.age && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.age}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Guardian Details
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Guardian Name *
                </label>
                <Input
                  value={form.guardian_name}
                  onChange={(e) =>
                    handleChange("guardian_name", e.target.value)
                  }
                  placeholder="Full name"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.guardian_name)}
                />
                {fieldErrors.guardian_name && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.guardian_name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Relationship *
                  </label>
                  <Input
                    value={form.guardian_relationship}
                    onChange={(e) =>
                      handleChange("guardian_relationship", e.target.value)
                    }
                    placeholder="e.g. Mother"
                    className="bg-muted border-border"
                    aria-invalid={Boolean(fieldErrors.guardian_relationship)}
                  />
                  {fieldErrors.guardian_relationship && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.guardian_relationship}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Contact Number *
                  </label>
                  <Input
                    value={form.guardian_contact_number}
                    onChange={(e) =>
                      handleChange("guardian_contact_number", e.target.value)
                    }
                    placeholder="09XX-XXX-XXXX"
                    className="bg-muted border-border"
                    aria-invalid={Boolean(fieldErrors.guardian_contact_number)}
                  />
                  {fieldErrors.guardian_contact_number && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.guardian_contact_number}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Medical & Doctor
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Medical Diagnosis *
                </label>
                <Input
                  value={form.medical_diagnosis}
                  onChange={(e) =>
                    handleChange("medical_diagnosis", e.target.value)
                  }
                  placeholder="Diagnosis"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.medical_diagnosis)}
                />
                {fieldErrors.medical_diagnosis && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.medical_diagnosis}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Assigned Doctor *
                </label>
                <select
                  value={form.doctor_id}
                  onChange={(e) => handleChange("doctor_id", e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-muted px-3 py-1 text-sm text-foreground"
                  aria-invalid={Boolean(fieldErrors.doctor_id)}
                >
                  <option value="">Select doctor...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.doctor_id && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.doctor_id}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Remarks
                </label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  placeholder="Optional notes"
                  rows={3}
                  className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground resize-none"
                />
              </div>
            </section>

            {submitError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6 pt-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Complete Enrollment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}

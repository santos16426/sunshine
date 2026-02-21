"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { DoctorFormData } from "../types";
import { doctorFormSchema } from "../schemas/doctor.schema";

const blankFormData: DoctorFormData = {
  name: "",
  contact_information: "",
  hospital_affiliation: "",
  remarks: "",
};

interface DoctorFormProps {
  isOpen: boolean;
  initialData?: DoctorFormData & { id?: string };
  onSubmit: (data: DoctorFormData) => Promise<string | null>;
  onClose: () => void;
}

export function DoctorForm({
  isOpen,
  initialData,
  onSubmit,
  onClose,
}: DoctorFormProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<DoctorFormData>(initialData ?? blankFormData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof DoctorFormData, string>>
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

  const handleChange = (field: keyof DoctorFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = doctorFormSchema.safeParse(form);
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      const byField: Partial<Record<keyof DoctorFormData, string>> = {};
      if (issues.fieldErrors) {
        for (const [k, v] of Object.entries(issues.fieldErrors)) {
          const msg = Array.isArray(v) ? v[0] : v;
          if (msg) byField[k as keyof DoctorFormData] = msg;
        }
      }
      setFieldErrors(byField);
      const first = issues.formErrors?.[0] ?? Object.values(byField)[0];
      if (first) toast.error(first);
      return;
    }

    setIsSaving(true);
    try {
      const error = await onSubmit(parsed.data);
      if (error) {
        setSubmitError(error);
        toast.error(error);
        return;
      }
      toast.success(
        isEdit ? "Doctor updated successfully." : "Doctor added successfully."
      );
      onClose();
      setForm(blankFormData);
    } catch {
      const msg = "Failed to save doctor";
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
      aria-labelledby="doctor-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="doctor-modal-title"
          className="text-2xl font-bold text-foreground p-6 pb-0"
        >
          {isEdit ? "Edit Doctor" : "Add Doctor"}
        </h2>
        <p className="text-sm text-muted-foreground px-6 pt-1">
          {isEdit
            ? "Update doctor details."
            : "Add a doctor to your directory."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto no-scrollbar flex-1 px-6 py-6 space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Identity
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Full Name *
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Dr. Juan Dela Cruz"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Contact & Affiliation
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Contact Information *
                </label>
                <Input
                  value={form.contact_information}
                  onChange={(e) =>
                    handleChange("contact_information", e.target.value)
                  }
                  placeholder="Phone or email"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.contact_information)}
                />
                {fieldErrors.contact_information && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.contact_information}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Hospital Affiliation *
                </label>
                <Input
                  value={form.hospital_affiliation}
                  onChange={(e) =>
                    handleChange("hospital_affiliation", e.target.value)
                  }
                  placeholder="Hospital or clinic name"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.hospital_affiliation)}
                />
                {fieldErrors.hospital_affiliation && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.hospital_affiliation}
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
                "Add Doctor"
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

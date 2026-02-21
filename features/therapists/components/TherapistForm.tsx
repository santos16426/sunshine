"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { TherapistFormData } from "../types";
import { therapistFormSchema } from "../schemas/therapist.schema";

const blankFormData: TherapistFormData = {
  name: "",
  therapist_type: "",
  contact_number: "",
  calendar_color: "#3B82F6",
};

const DEFAULT_THERAPY_TYPES = [
  { code: "Physical Therapist", label: "Physical Therapist" },
  { code: "Occupational Therapist", label: "Occupational Therapist" },
  { code: "Speech-Language Therapist", label: "Speech-Language Therapist" },
  { code: "Special Education Teacher", label: "Special Education Teacher" },
  { code: "Play School Teacher", label: "Play School Teacher" },
  { code: "Psychologist", label: "Psychologist" },
];

interface TherapyTypeOption {
  code: string;
  label: string;
}

interface TherapistFormProps {
  isOpen: boolean;
  initialData?: TherapistFormData & { id?: string };
  therapyTypes?: TherapyTypeOption[];
  onSubmit: (data: TherapistFormData) => Promise<string | null>;
  onClose: () => void;
}

export function TherapistForm({
  isOpen,
  initialData,
  therapyTypes = DEFAULT_THERAPY_TYPES,
  onSubmit,
  onClose,
}: TherapistFormProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<TherapistFormData>(
    initialData ?? blankFormData,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof TherapistFormData, string>>
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

  const handleChange = (field: keyof TherapistFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = therapistFormSchema.safeParse(form);
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      const byField: Partial<Record<keyof TherapistFormData, string>> = {};
      if (issues.fieldErrors) {
        for (const [k, v] of Object.entries(issues.fieldErrors)) {
          const msg = Array.isArray(v) ? v[0] : v;
          if (msg) byField[k as keyof TherapistFormData] = msg;
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
        isEdit
          ? "Therapist updated successfully."
          : "Therapist added successfully.",
      );
      onClose();
      setForm(blankFormData);
    } catch {
      const msg = "Failed to save therapist";
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
      aria-labelledby="therapist-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="therapist-modal-title"
          className="text-2xl font-bold text-foreground p-6 pb-0"
        >
          {isEdit ? "Edit Therapist" : "Add Therapist"}
        </h2>
        <p className="text-sm text-muted-foreground px-6 pt-1">
          {isEdit
            ? "Update therapist details."
            : "Add a new therapist to your practice."}
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
                  placeholder="e.g. Maria Santos"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Type *
                </label>
                <select
                  value={form.therapist_type}
                  onChange={(e) =>
                    handleChange("therapist_type", e.target.value)
                  }
                  className="w-full h-9 rounded-md border border-border bg-muted px-3 py-1 text-sm text-foreground"
                  aria-invalid={Boolean(fieldErrors.therapist_type)}
                >
                  <option value="">Select type...</option>
                  {therapyTypes.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.therapist_type && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.therapist_type}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Contact & Calendar
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Contact Number *
                </label>
                <Input
                  value={form.contact_number}
                  onChange={(e) =>
                    handleChange("contact_number", e.target.value)
                  }
                  placeholder="09XX-XXX-XXXX"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.contact_number)}
                />
                {fieldErrors.contact_number && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.contact_number}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Calendar Color *
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.calendar_color}
                    onChange={(e) =>
                      handleChange("calendar_color", e.target.value)
                    }
                    className="h-9 w-14 rounded-md border border-border cursor-pointer bg-muted"
                    aria-invalid={Boolean(fieldErrors.calendar_color)}
                  />
                  <Input
                    value={form.calendar_color}
                    onChange={(e) =>
                      handleChange("calendar_color", e.target.value)
                    }
                    placeholder="#3B82F6"
                    className="bg-muted border-border flex-1"
                    aria-invalid={Boolean(fieldErrors.calendar_color)}
                  />
                </div>
                {fieldErrors.calendar_color && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.calendar_color}
                  </p>
                )}
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
                "Add Therapist"
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

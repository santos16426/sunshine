"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ServiceFormData } from "../types";
import { serviceFormSchema } from "../schemas/service.schema";

const blankFormData: ServiceFormData = {
  name: "",
  description: "",
  rate_per_hour: 0,
  clinic_cut: 0,
};

interface ServiceFormProps {
  isOpen: boolean;
  initialData?: ServiceFormData & { id?: string };
  onSubmit: (data: ServiceFormData) => Promise<string | null>;
  onClose: () => void;
}

export function ServiceForm({
  isOpen,
  initialData,
  onSubmit,
  onClose,
}: ServiceFormProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<ServiceFormData>(initialData ?? blankFormData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ServiceFormData, string>>
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
    field: keyof ServiceFormData,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const toNum = (v: number): number =>
      typeof v === "number" && !Number.isNaN(v) ? v : 0;
    const payload = {
      ...form,
      rate_per_hour: toNum(form.rate_per_hour),
      clinic_cut: toNum(form.clinic_cut),
    };

    const parsed = serviceFormSchema.safeParse(payload);
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      const byField: Partial<Record<keyof ServiceFormData, string>> = {};
      if (issues.fieldErrors) {
        for (const [k, v] of Object.entries(issues.fieldErrors)) {
          const msg = Array.isArray(v) ? v[0] : v;
          if (msg) byField[k as keyof ServiceFormData] = msg;
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
        isEdit ? "Service updated successfully." : "Service added successfully."
      );
      onClose();
      setForm(blankFormData);
    } catch {
      const msg = "Failed to save service";
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
      aria-labelledby="service-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="service-modal-title"
          className="text-2xl font-bold text-foreground p-6 pb-0"
        >
          {isEdit ? "Edit Service" : "Add Service"}
        </h2>
        <p className="text-sm text-muted-foreground px-6 pt-1">
          {isEdit
            ? "Update service and rates."
            : "Add a new service offering."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto no-scrollbar flex-1 px-6 py-6 space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Service
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Name *
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Physical Therapy"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Optional"
                  rows={3}
                  className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground resize-none"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Rates
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Rate per hour (₱) *
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.rate_per_hour || ""}
                  onChange={(e) =>
                    handleChange(
                      "rate_per_hour",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.rate_per_hour)}
                />
                {fieldErrors.rate_per_hour && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.rate_per_hour}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Clinic cut (%) *
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={form.clinic_cut || ""}
                  onChange={(e) =>
                    handleChange("clinic_cut", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0–100"
                  className="bg-muted border-border"
                  aria-invalid={Boolean(fieldErrors.clinic_cut)}
                />
                {fieldErrors.clinic_cut && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.clinic_cut}
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
                "Add Service"
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

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { FormSearchSelect } from "@/components/common/FormSearchSelect";
import type { SessionFormData, PatientOption, TherapistOption, ServiceOption } from "../types";

interface SessionModalProps {
  isEdit: boolean;
  formData: SessionFormData;
  onFormChange: (data: SessionFormData) => void;
  onSave: () => void;
  onDelete?: () => void;
  onClose: () => void;
  patients: PatientOption[];
  therapists: TherapistOption[];
  services: ServiceOption[];
}

export function SessionModal({
  isEdit,
  formData,
  onFormChange,
  onSave,
  onDelete,
  onClose,
  patients,
  therapists,
  services,
}: SessionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const overlay = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
    >
      <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-border relative">
        {isEdit && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="absolute right-4 top-4 rounded-md p-2 text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete session"
            title="Delete session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
        <h2 id="session-modal-title" className="text-2xl font-bold text-foreground mb-6">
          {isEdit ? "Edit Session" : "Add New Session"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.session_date}
              onChange={(e) =>
                onFormChange({ ...formData, session_date: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time *
            </label>
            <select
              value={formData.session_time}
              onChange={(e) =>
                onFormChange({ ...formData, session_time: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background text-foreground"
            >
              {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>

          <FormSearchSelect
            label="Select Patient"
            value={formData.patient_id}
            onChange={(value) =>
              onFormChange({ ...formData, patient_id: value })
            }
            options={patients.map((p) => ({ value: p.id, label: p.name }))}
            placeholder="Search and select patient..."
            required
          />

          <FormSearchSelect
            label="Select Therapist"
            value={formData.therapist_id}
            onChange={(value) =>
              onFormChange({ ...formData, therapist_id: value })
            }
            options={therapists.map((t) => ({
              value: t.id,
              label: `${t.name} (${t.therapist_type})`,
            }))}
            placeholder="Search and select therapist..."
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Service *
            </label>
            <select
              value={formData.service_id}
              onChange={(e) =>
                onFormChange({ ...formData, service_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background text-foreground"
            >
              <option value="">Choose a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₱{service.rate_per_hour}/hr
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) =>
                onFormChange({ ...formData, remarks: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none bg-background text-foreground"
              rows={3}
              placeholder="Add any notes for this session..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-semibold"
          >
            {isEdit ? "Update Session" : "Add Session"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

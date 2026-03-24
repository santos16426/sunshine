"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar1,
  Check,
  Pencil,
  TextAlignStart,
  Trash2,
  User,
  X,
} from "lucide-react";

interface PopoverPos {
  top: number;
  left: number;
}

interface ViewSessionDetailsPopupProps {
  patientName: string;
  scheduleDate: string;
  scheduleTime: string;
  therapistName: string;
  serviceName: string;
  remarks: string;
  popoverPos: PopoverPos;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ViewSessionDetailsPopup({
  patientName,
  scheduleDate,
  scheduleTime,
  therapistName,
  serviceName,
  remarks,
  popoverPos,
  popoverRef,
  onEdit,
  onDelete,
  onClose,
}: ViewSessionDetailsPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const overlay = (
    <div
      ref={popoverRef}
      className="fixed w-[400px] bg-card border border-border rounded-2xl shadow-2xl z-100 animate-in fade-in zoom-in duration-150 origin-top-left flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-session-details-title"
      style={{ top: popoverPos.top, left: popoverPos.left }}
    >
      <div className="flex items-center justify-end p-2 border-b border-border/50 bg-muted/20">
        {!isDeleteConfirming && (
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
            aria-label="Edit schedule"
            title="Edit schedule"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (isDeleteConfirming) {
              onDelete();
              return;
            }
            setIsDeleteConfirming(true);
          }}
          className="px-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          aria-label="Delete schedule"
          title={isDeleteConfirming ? "Confirm delete" : "Delete schedule"}
        >
          {isDeleteConfirming ? (
            <span className="text-white text-xs bg-destructive p-2 rounded-full">
              Confirm
            </span>
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
        {isDeleteConfirming ? (
          <button
            type="button"
            onClick={() => setIsDeleteConfirming(false)}
            className="hover:bg-muted rounded-full transition-colors text-muted-foreground"
            aria-label="Cancel delete"
            title="Cancel delete"
          >
            <span className="text-white text-xs bg-muted-foreground p-2 rounded-full">
              Cancel
            </span>
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground ml-1"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {/* <div className="w-4 h-4 rounded-sm mt-1 shrink-0 bg-primary" /> */}
          <div className="flex flex-col">
            <h2
              id="view-session-details-title"
              className="text-lg font-bold text-foreground leading-tight capitalize"
            >
              {patientName.toLowerCase()}
            </h2>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar1 className="w-4 h-4" />
              <span>{scheduleDate}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>{scheduleTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground/80 capitalize">
          <User className="w-4 h-4" />
          <span>{therapistName.toLowerCase()}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground/80">
          {/* <span className="w-4 h-4 rounded bg-muted-foreground/30 shrink-0" /> */}
          <TextAlignStart className="w-4 h-4" />
          <span>{serviceName}</span>
        </div>

        <div className="flex items-start gap-4 text-sm text-foreground/80">
          {/* <span className="w-4 h-4 rounded bg-muted-foreground/30 shrink-0 mt-0.5" /> */}
          <span className="leading-snug italic text-muted-foreground">
            {remarks || "No remarks"}
          </span>
        </div>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

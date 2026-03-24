"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Filter as FilterIcon, X } from "lucide-react";
import type { TherapistOption } from "../types";

interface FilterProps {
  therapists: TherapistOption[];
  selectedTherapistIds: string[];
  onTherapistFilterChange: (ids: string[]) => void;
}

export function Filter({
  therapists,
  selectedTherapistIds,
  onTherapistFilterChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        popoverRef.current &&
        event.target instanceof Node &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const activeCount = selectedTherapistIds.length;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
          isOpen
            ? "border-slate-900 bg-slate-900 text-white ring-4 ring-slate-100"
            : activeCount > 0
              ? "border-slate-300 bg-slate-50 text-slate-900 shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300",
        )}
      >
        <FilterIcon
          className={cn(
            "w-4 h-4",
            activeCount > 0 ? "text-indigo-500" : "text-current",
          )}
        />
        <span>Filter Therapists</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center bg-indigo-500 text-white text-[10px] w-5 h-5 rounded-full font-bold">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-left">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Select Therapists
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => onTherapistFilterChange([])}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                CLEAR ALL
              </button>
            )}
          </div>

          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="grid gap-1">
              {therapists.map((therapist) => {
                const isSelected = selectedTherapistIds.includes(therapist.id);
                return (
                  <button
                    key={therapist.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        onTherapistFilterChange(
                          selectedTherapistIds.filter(
                            (id) => id !== therapist.id,
                          ),
                        );
                        return;
                      }
                      onTherapistFilterChange([
                        ...selectedTherapistIds,
                        therapist.id,
                      ]);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-left",
                      isSelected ? "bg-slate-50" : "hover:bg-slate-50/80",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: therapist.calendar_color }}
                      />
                      <span
                        className={cn(
                          isSelected
                            ? "font-semibold text-slate-900"
                            : "text-slate-600",
                        )}
                      >
                        {therapist.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

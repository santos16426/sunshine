"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import type { ScheduleSession, TherapistOption } from "../types";

interface SidebarAgendaProps {
  selectedDateObj: Date;
  selectedDayAppointments: ScheduleSession[];
  getTherapist: (therapistId: string) => TherapistOption | undefined;
  getPatientName: (patientId: string) => string;
  onEditSession: (sessionId: string) => void;
  onAddSession: () => void;
  isLoading: boolean;
  draggedSessionId: string | null;
  onDragStart: (e: React.DragEvent, sessionId: string) => void;
  onDragEnd: () => void;
  formatSessionTime: (hour: number) => string;
}

export function SidebarAgenda({
  selectedDateObj,
  selectedDayAppointments,
  getTherapist,
  getPatientName,
  onEditSession,
  onAddSession,
  isLoading,
  draggedSessionId,
  onDragStart,
  onDragEnd,
  formatSessionTime,
}: SidebarAgendaProps) {
  return (
    <div className="w-full xl:w-80 shrink-0 space-y-4">
      <div className="flex items-center justify-between px-2 text-left">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {selectedDateObj.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
          })}{" "}
          Agenda
        </h3>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-muted/50 border border-dashed border-border rounded-3xl p-10 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Loading...
            </p>
          </div>
        ) : selectedDayAppointments.length > 0 ? (
          selectedDayAppointments.map((session) => {
            const therapist = getTherapist(session.therapist_id);
            const color = therapist?.calendar_color ?? "var(--primary)";
            return (
              <div
                key={session.id}
                draggable
                onDragStart={(e) => onDragStart(e, session.id)}
                onDragEnd={onDragEnd}
                onClick={() => onEditSession(session.id)}
                className={cn(
                  "my-2 bg-card p-5 rounded-3xl border border-border flex items-center gap-4 hover:border-primary/30 transition-all text-left group cursor-grab active:cursor-grabbing",
                  draggedSessionId === session.id && "opacity-50",
                )}
              >
                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">
                    {formatSessionTime(session.session_time)}
                  </p>
                  <h4 className="text-sm font-bold text-foreground truncate capitalize">
                    {getPatientName(session.patient_id).toLowerCase()}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    {session.remarks || "No notes"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSession(session.id);
                  }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-muted text-muted-foreground hover:text-foreground transition-opacity"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="bg-muted/50 border border-dashed border-border rounded-3xl p-10 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              No Bookings
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onAddSession}
          className="w-full py-4 rounded-3xl border-2 border-dashed border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
        >
          Quick Add
        </button>
      </div>
    </div>
  );
}

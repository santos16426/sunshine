"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, Plus, Pencil, Filter } from "lucide-react";
import { toLocalDateString, parseLocalDate, isSameLocalDay } from "../utils/date";
import type { ScheduleSession, TherapistOption } from "../types";

const DEFAULT_DROP_HOUR = 9;

export interface ScheduleGridProps {
  sessions: ScheduleSession[];
  therapists: TherapistOption[];
  selectedTherapistIds: string[];
  onTherapistFilterChange: (ids: string[]) => void;
  getPatientName: (patientId: string) => string;
  getTherapist: (therapistId: string) => TherapistOption | undefined;
  updateSession: (
    sessionId: string,
    payload: { session_date?: string; session_time?: number }
  ) => Promise<void>;
  onEditSession: (sessionId: string) => void;
  onAddSession: () => void;
  currentDate: Date;
  viewMode: "Month" | "Week";
  selectedDateObj: Date;
  onCurrentDateChange: (date: Date) => void;
  onViewModeChange: (mode: "Month" | "Week") => void;
  onSelectedDateChange: (date: Date) => void;
  isLoading?: boolean;
  error?: string | null;
}

function formatSessionTime(hour: number): string {
  if (hour === 12) return "12:00 PM";
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}

export function ScheduleGrid({
  sessions,
  therapists,
  selectedTherapistIds,
  onTherapistFilterChange,
  getPatientName,
  getTherapist,
  updateSession,
  onEditSession,
  onAddSession,
  currentDate,
  viewMode,
  selectedDateObj,
  onCurrentDateChange,
  onViewModeChange,
  onSelectedDateChange,
  isLoading = false,
  error = null,
}: ScheduleGridProps) {
  const [draggedSessionId, setDraggedSessionId] = useState<string | null>(null);
  const [dropTargetDateKey, setDropTargetDateKey] = useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    if (selectedTherapistIds.length === 0) return sessions;
    return sessions.filter((s) => selectedTherapistIds.includes(s.therapist_id));
  }, [sessions, selectedTherapistIds]);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const monthIdx = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === "Month") {
      onCurrentDateChange(new Date(year, monthIdx - 1, 1));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      onCurrentDateChange(prevWeek);
    }
  };

  const handleNext = () => {
    if (viewMode === "Month") {
      onCurrentDateChange(new Date(year, monthIdx + 1, 1));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      onCurrentDateChange(nextWeek);
    }
  };

  const gridDays = useMemo(() => {
    if (viewMode === "Month") {
      const days: { date: Date | null; isCurrentMonth: boolean }[] = [];
      const firstDay = new Date(year, monthIdx, 1).getDay();
      const totalDays = new Date(year, monthIdx + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        days.push({ date: null, isCurrentMonth: false });
      }
      for (let i = 1; i <= totalDays; i++) {
        days.push({ date: new Date(year, monthIdx, i), isCurrentMonth: true });
      }
      return days;
    } else {
      const days: { date: Date | null; isCurrentMonth: boolean }[] = [];
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push({ date: day, isCurrentMonth: day.getMonth() === monthIdx });
      }
      return days;
    }
  }, [currentDate, viewMode, monthIdx, year]);

  const getAppointmentsForDay = (date: Date) => {
    return filteredSessions.filter((s) => {
      const d = parseLocalDate(s.session_date);
      return isSameLocalDay(d, date);
    });
  };

  const selectedDayAppointments = useMemo(() => {
    return getAppointmentsForDay(selectedDateObj).sort(
      (a, b) => a.session_time - b.session_time
    );
  }, [filteredSessions, selectedDateObj]);

  const handleDragStart = (e: React.DragEvent, sessionId: string) => {
    setDraggedSessionId(sessionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", sessionId);
    e.dataTransfer.setData("application/session-id", sessionId);
  };

  const handleDragEnd = () => {
    setDraggedSessionId(null);
    setDropTargetDateKey(null);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedSessionId) {
      setDropTargetDateKey(toLocalDateString(date));
    }
  };

  const handleDragLeave = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const related = e.relatedTarget as Node | null;
    const current = e.currentTarget;
    if (!current.contains(related)) {
      setDropTargetDateKey(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    targetDate: Date
  ) => {
    e.preventDefault();
    setDropTargetDateKey(null);
    const sessionId =
      e.dataTransfer.getData("application/session-id") ||
      e.dataTransfer.getData("text/plain");
    if (sessionId) {
      const dateStr = toLocalDateString(targetDate);
      void updateSession(sessionId, {
        session_date: dateStr,
        session_time: DEFAULT_DROP_HOUR,
      });
    }
    setDraggedSessionId(null);
  };

  const maxChips = viewMode === "Month" ? 2 : 6;

  return (
    <>
      <div className="space-y-6 pb-32 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Schedule
              </span>
            </div>
            <h2 className="text-4xl font-medium text-foreground">
              Appointments
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Therapist filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                Therapists:
              </span>
              {therapists.map((t) => {
                const isSelected =
                  selectedTherapistIds.length === 0 ||
                  selectedTherapistIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (selectedTherapistIds.length === 0) {
                        onTherapistFilterChange([t.id]);
                      } else if (selectedTherapistIds.includes(t.id)) {
                        const next = selectedTherapistIds.filter((id) => id !== t.id);
                        onTherapistFilterChange(next);
                      } else {
                        onTherapistFilterChange([...selectedTherapistIds, t.id]);
                      }
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      isSelected
                        ? "border-transparent text-white"
                        : "border-border bg-muted/50 text-muted-foreground opacity-60 hover:opacity-80"
                    )}
                    style={
                      isSelected
                        ? { backgroundColor: t.calendar_color }
                        : undefined
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 border border-white/30"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.8)"
                          : t.calendar_color,
                      }}
                    />
                    {t.name}
                  </button>
                );
              })}
              {therapists.length > 0 && selectedTherapistIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => onTherapistFilterChange([])}
                  className="text-[10px] font-bold text-muted-foreground hover:text-foreground underline"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onAddSession}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" /> New Booking
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Calendar grid */}
          <div className="flex-1 bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden w-full">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {viewMode === "Month"
                  ? `${monthName} ${year}`
                  : `Week of ${gridDays[0]?.date?.toLocaleDateString("default", {
                      month: "short",
                      day: "numeric",
                    })}`}
              </h3>
              <div className="flex gap-1">
                <div className="flex bg-muted p-1 rounded-full mr-2">
                  <button
                    type="button"
                    onClick={() => onViewModeChange("Month")}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all",
                      viewMode === "Month"
                        ? "bg-card shadow-sm text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewModeChange("Week")}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all",
                      viewMode === "Week"
                        ? "bg-card shadow-sm text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    Week
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center border-r border-border last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div
              className={cn(
                "grid grid-cols-7",
                viewMode === "Month" ? "auto-rows-[120px]" : "auto-rows-[300px]"
              )}
            >
              {gridDays.map((item, idx) => {
                if (!item.date) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="p-2 border-r border-b border-border bg-muted/20"
                    />
                  );
                }

                const dayVal = item.date.getDate();
                const monthVal = item.date.getMonth();
                const dayAppts = getAppointmentsForDay(item.date);
                const isSelected =
                  selectedDateObj.getDate() === dayVal &&
                  selectedDateObj.getMonth() === monthVal;
                const isDropTarget =
                  dropTargetDateKey !== null &&
                  toLocalDateString(item.date) === dropTargetDateKey;

                return (
                  <div
                    key={item.date.toISOString()}
                    onDragOver={(e) => handleDragOver(e, item.date!)}
                    onDragLeave={(e) => handleDragLeave(e, item.date!)}
                    onDrop={(e) => handleDrop(e, item.date!)}
                    onClick={() => onSelectedDateChange(item.date!)}
                    className={cn(
                      "p-2 border-r border-b border-border text-left transition-all relative flex flex-col gap-1 cursor-pointer hover:bg-muted/50",
                      isSelected ? "bg-primary/10" : "bg-card",
                      !item.isCurrentMonth && viewMode === "Month" && "opacity-40",
                      isDropTarget &&
                        "ring-2 ring-primary ring-inset bg-primary/20 shadow-inner"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {dayVal}
                    </span>

                    <div className="space-y-1 overflow-hidden flex-1 min-h-0">
                      {dayAppts.slice(0, maxChips).map((session) => {
                        const therapist = getTherapist(session.therapist_id);
                        const color = therapist?.calendar_color ?? "var(--primary)";
                        return (
                          <div
                            key={session.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, session.id)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditSession(session.id);
                            }}
                            className={cn(
                              "px-2 py-1 rounded-md text-[9px] font-bold truncate cursor-grab active:cursor-grabbing text-white hover:opacity-90 transition-opacity",
                              draggedSessionId === session.id && "opacity-50"
                            )}
                            style={{ backgroundColor: color }}
                          >
                            {formatSessionTime(session.session_time)}{" "}
                            {getPatientName(session.patient_id)}
                          </div>
                        );
                      })}
                      {dayAppts.length > maxChips && (
                        <div className="text-[9px] font-bold text-muted-foreground pl-1 uppercase tracking-tighter">
                          + {dayAppts.length - maxChips} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar agenda */}
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
                      onDragStart={(e) => handleDragStart(e, session.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onEditSession(session.id)}
                      className={cn(
                        "my-2 bg-card p-5 rounded-3xl border border-border flex items-center gap-4 hover:border-primary/30 transition-all text-left group cursor-grab active:cursor-grabbing",
                        draggedSessionId === session.id && "opacity-50"
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
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {getPatientName(session.patient_id)}
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
        </div>
      </div>
    </>
  );
}

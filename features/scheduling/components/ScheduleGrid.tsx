"use client";

import React, { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import {
  toLocalDateString,
  parseLocalDate,
  isSameLocalDay,
} from "../utils/date";
import { DEFAULT_DROP_HOUR } from "../constants/calendar.constants";
import type { CalendarViewMode } from "../constants/calendar.constants";
import type { ScheduleSession, TherapistOption } from "../types";
import { Calendar } from "./Calendar";
import { SidebarAgenda } from "./SidebarAgenda";
import { Filter } from "./Filter";

export interface ScheduleGridProps {
  sessions: ScheduleSession[];
  therapists: TherapistOption[];
  selectedTherapistIds: string[];
  onTherapistFilterChange: (ids: string[]) => void;
  getPatientName: (patientId: string) => string;
  getTherapist: (therapistId: string) => TherapistOption | undefined;
  updateSession: (
    sessionId: string,
    payload: { session_date?: string; session_time?: number },
  ) => Promise<void>;
  onEditSession: (sessionId: string, event: React.MouseEvent) => void;
  onAddSession: () => void;
  currentDate: Date;
  viewMode: CalendarViewMode;
  selectedDateObj: Date;
  onCurrentDateChange: (date: Date) => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
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
  const [dropTargetDateKey, setDropTargetDateKey] = useState<string | null>(
    null,
  );

  const filteredSessions = useMemo(() => {
    if (selectedTherapistIds.length === 0) return sessions;
    return sessions.filter((session) =>
      selectedTherapistIds.includes(session.therapist_id),
    );
  }, [sessions, selectedTherapistIds]);

  const year = currentDate.getFullYear();
  const monthIdx = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === "Month") {
      onCurrentDateChange(new Date(year, monthIdx - 1, 1));
      return;
    }
    if (viewMode === "Week") {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      onCurrentDateChange(prevWeek);
      return;
    }
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    onCurrentDateChange(prevDay);
    onSelectedDateChange(prevDay);
  };

  const handleNext = () => {
    if (viewMode === "Month") {
      onCurrentDateChange(new Date(year, monthIdx + 1, 1));
      return;
    }
    if (viewMode === "Week") {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      onCurrentDateChange(nextWeek);
      return;
    }
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    onCurrentDateChange(nextDay);
    onSelectedDateChange(nextDay);
  };

  const gridDays = useMemo(() => {
    if (viewMode === "Month") {
      const days: { date: Date | null; isCurrentMonth: boolean }[] = [];
      const firstDay = new Date(year, monthIdx, 1).getDay();
      const totalDays = new Date(year, monthIdx + 1, 0).getDate();
      for (let i = 0; i < firstDay; i++)
        days.push({ date: null, isCurrentMonth: false });
      for (let i = 1; i <= totalDays; i++)
        days.push({ date: new Date(year, monthIdx, i), isCurrentMonth: true });
      return days;
    }

    if (viewMode === "Week") {
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

    return [
      {
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === monthIdx,
      },
    ];
  }, [currentDate, monthIdx, viewMode, year]);

  const getAppointmentsForDay = (date: Date) =>
    filteredSessions.filter((session) => {
      const sessionDate = parseLocalDate(session.session_date);
      return isSameLocalDay(sessionDate, date);
    });

  const selectedDayAppointments = useMemo(
    () =>
      getAppointmentsForDay(selectedDateObj).sort(
        (left, right) => left.session_time - right.session_time,
      ),
    [filteredSessions, selectedDateObj],
  );

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

  const handleMonthCellDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedSessionId) setDropTargetDateKey(toLocalDateString(date));
  };

  const handleMonthCellDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;
    const current = e.currentTarget;
    if (!current.contains(related)) setDropTargetDateKey(null);
  };

  const handleMonthCellDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDropTargetDateKey(null);
    const sessionId =
      e.dataTransfer.getData("application/session-id") ||
      e.dataTransfer.getData("text/plain");
    if (sessionId) {
      void updateSession(sessionId, {
        session_date: toLocalDateString(targetDate),
        session_time: DEFAULT_DROP_HOUR,
      });
    }
    setDraggedSessionId(null);
  };

  const handleHourSlotDrop = (
    e: React.DragEvent,
    targetDate: Date,
    hour: number,
  ) => {
    e.preventDefault();
    const sessionId =
      e.dataTransfer.getData("application/session-id") ||
      e.dataTransfer.getData("text/plain");
    if (sessionId) {
      void updateSession(sessionId, {
        session_date: toLocalDateString(targetDate),
        session_time: hour,
      });
    }
    setDraggedSessionId(null);
    setDropTargetDateKey(null);
  };

  const handleHourSlotDragOver = (
    e: React.DragEvent,
    date: Date,
    hour: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetDateKey(`${toLocalDateString(date)}-${hour}`);
  };

  const handleHourSlotDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;
    const current = e.currentTarget;
    if (!current.contains(related)) setDropTargetDateKey(null);
  };

  const calendarDays =
    viewMode === "Week"
      ? gridDays
      : [
          {
            date: currentDate,
            isCurrentMonth: currentDate.getMonth() === monthIdx,
          },
        ];
  const maxChips = viewMode === "Month" ? 2 : 6;

  return (
    <div className="space-y-6 pb-32 p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Schedule
            </span>
          </div>
          <h2 className="text-4xl font-medium text-foreground">Appointments</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Filter
            therapists={therapists}
            selectedTherapistIds={selectedTherapistIds}
            onTherapistFilterChange={onTherapistFilterChange}
          />
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
        <Calendar
          viewMode={viewMode}
          currentDate={currentDate}
          selectedDateObj={selectedDateObj}
          gridDays={gridDays}
          calendarDays={calendarDays}
          dropTargetDateKey={dropTargetDateKey}
          draggedSessionId={draggedSessionId}
          maxChips={maxChips}
          onViewModeChange={onViewModeChange}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectedDateChange={onSelectedDateChange}
          getAppointmentsForDay={getAppointmentsForDay}
          getPatientName={getPatientName}
          getTherapist={getTherapist}
          onEditSession={onEditSession}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMonthCellDragOver={handleMonthCellDragOver}
          onMonthCellDragLeave={handleMonthCellDragLeave}
          onMonthCellDrop={handleMonthCellDrop}
          onHourSlotDrop={handleHourSlotDrop}
          onHourSlotDragOver={handleHourSlotDragOver}
          onHourSlotDragLeave={handleHourSlotDragLeave}
          formatSessionTime={formatSessionTime}
        />

        <SidebarAgenda
          selectedDateObj={selectedDateObj}
          selectedDayAppointments={selectedDayAppointments}
          getTherapist={getTherapist}
          getPatientName={getPatientName}
          onEditSession={onEditSession}
          onAddSession={onAddSession}
          isLoading={isLoading}
          draggedSessionId={draggedSessionId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          formatSessionTime={formatSessionTime}
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toLocalDateString, isSameLocalDay } from "../utils/date";
import {
  END_HOUR,
  HOURS,
  HOUR_HEIGHT,
  START_HOUR,
  VIEW_MODES,
  WEEKDAY_LABELS,
} from "../constants/calendar.constants";
import type { CalendarViewMode } from "../constants/calendar.constants";
import type { ScheduleSession, TherapistOption } from "../types";

interface CalendarDayItem {
  date: Date | null;
  isCurrentMonth: boolean;
}

interface CalendarProps {
  viewMode: CalendarViewMode;
  currentDate: Date;
  selectedDateObj: Date;
  gridDays: CalendarDayItem[];
  calendarDays: CalendarDayItem[];
  dropTargetDateKey: string | null;
  draggedSessionId: string | null;
  maxChips: number;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectedDateChange: (date: Date) => void;
  getAppointmentsForDay: (date: Date) => ScheduleSession[];
  getPatientName: (patientId: string) => string;
  getTherapist: (therapistId: string) => TherapistOption | undefined;
  onEditSession: (sessionId: string) => void;
  onDragStart: (e: React.DragEvent, sessionId: string) => void;
  onDragEnd: () => void;
  onMonthCellDragOver: (e: React.DragEvent, date: Date) => void;
  onMonthCellDragLeave: (e: React.DragEvent, date: Date) => void;
  onMonthCellDrop: (e: React.DragEvent, date: Date) => void;
  onHourSlotDrop: (e: React.DragEvent, date: Date, hour: number) => void;
  onHourSlotDragOver: (e: React.DragEvent, date: Date, hour: number) => void;
  onHourSlotDragLeave: (e: React.DragEvent) => void;
  formatSessionTime: (hour: number) => string;
}

function formatHeaderTitle(
  viewMode: CalendarViewMode,
  currentDate: Date,
  gridDays: CalendarDayItem[],
): string {
  if (viewMode === "Month") {
    return currentDate.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });
  }
  if (viewMode === "Week") {
    const start = gridDays[0]?.date;
    if (!start) return "Week";
    return `Week of ${start.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    })}`;
  }
  return currentDate.toLocaleDateString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatHourLabel(hour: number): string {
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

function calculateTop(hour: number): number {
  const clampedHour = Math.min(Math.max(hour, START_HOUR), END_HOUR);
  return (clampedHour - START_HOUR) * HOUR_HEIGHT;
}

export function Calendar({
  viewMode,
  currentDate,
  selectedDateObj,
  gridDays,
  calendarDays,
  dropTargetDateKey,
  draggedSessionId,
  maxChips,
  onViewModeChange,
  onPrev,
  onNext,
  onSelectedDateChange,
  getAppointmentsForDay,
  getPatientName,
  getTherapist,
  onEditSession,
  onDragStart,
  onDragEnd,
  onMonthCellDragOver,
  onMonthCellDragLeave,
  onMonthCellDrop,
  onHourSlotDrop,
  onHourSlotDragOver,
  onHourSlotDragLeave,
  formatSessionTime,
}: CalendarProps) {
  return (
    <div className="flex-1 bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden w-full">
      <div className="p-6 flex items-center justify-between border-b border-border">
        <h3 className="text-lg font-bold text-foreground">
          {formatHeaderTitle(viewMode, currentDate, gridDays)}
        </h3>
        <div className="flex gap-1">
          <div className="flex bg-muted p-1 rounded-full mr-2">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  viewMode === mode
                    ? "bg-card shadow-sm text-primary"
                    : "text-muted-foreground",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onPrev}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === "Month" ? (
        <>
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAY_LABELS.map((day) => (
              <div
                key={day}
                className="py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center border-r border-border last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-[150px]">
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
                  onDragOver={(e) => onMonthCellDragOver(e, item.date!)}
                  onDragLeave={(e) => onMonthCellDragLeave(e, item.date!)}
                  onDrop={(e) => onMonthCellDrop(e, item.date!)}
                  onClick={() => onSelectedDateChange(item.date!)}
                  className={cn(
                    "p-2 border-r border-b border-border text-left transition-all relative flex flex-col gap-1 cursor-pointer hover:bg-muted/50",
                    isSelected ? "bg-primary/10" : "bg-card",
                    !item.isCurrentMonth && "opacity-40",
                    isDropTarget &&
                      "ring-2 ring-primary ring-inset bg-primary/20 shadow-inner",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full shrink-0",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {dayVal}
                  </span>

                  <div className="space-y-1 overflow-hidden flex-1 min-h-0">
                    {dayAppts.slice(0, maxChips).map((session) => {
                      const therapist = getTherapist(session.therapist_id);
                      const color =
                        therapist?.calendar_color ?? "var(--primary)";
                      return (
                        <div
                          key={session.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, session.id)}
                          onDragEnd={onDragEnd}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSession(session.id);
                          }}
                          className={cn(
                            "px-2 py-1 rounded-md border border-border  bg-card text-foreground text-[9px] font-bold truncate cursor-grab active:cursor-grabbing hover:bg-muted/40 transition-colors",
                            draggedSessionId === session.id && "opacity-50",
                          )}
                          style={{
                            borderLeftColor: color,
                            borderLeftWidth: "10px",
                          }}
                        >
                          {formatSessionTime(session.session_time)}
                          <br />
                          <span className="capitalize">
                            {getPatientName(session.patient_id).toLowerCase()}
                          </span>
                        </div>
                      );
                    })}
                    {dayAppts.length > maxChips && (
                      <div className="text-[9px] font-bold text-muted-foreground pl-1 tracking-tighter">
                        + {dayAppts.length - maxChips} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-[760px] overflow-hidden">
          <div className="grid grid-cols-[70px_1fr] border-b border-border bg-card">
            <div className="border-r border-border bg-muted/5" />
            <div
              className={cn(
                "grid bg-muted/5",
                viewMode === "Week" ? "grid-cols-7" : "grid-cols-1",
              )}
            >
              {calendarDays.map((item, idx) => (
                <div
                  key={`${item.date?.toISOString() ?? `empty-${idx}`}`}
                  className="py-3 text-center border-r border-border last:border-r-0"
                >
                  <div className="text-[9px] font-black text-muted-foreground uppercase">
                    {item.date ? WEEKDAY_LABELS[item.date.getDay()] : ""}
                  </div>
                  <div
                    className={cn(
                      "text-xl font-bold mt-1 w-fit mx-auto rounded-full px-3 py-1 hover:bg-primary/10",
                      item.date &&
                        isSameLocalDay(item.date, selectedDateObj) &&
                        "bg-primary text-primary-foreground",
                    )}
                    onClick={() => item.date && onSelectedDateChange(item.date)}
                  >
                    {item.date?.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-[70px_1fr] min-h-full">
              <div className="border-r border-border bg-muted/5 relative">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="text-[10px] font-bold text-muted-foreground text-right pr-3 pt-2"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  >
                    {formatHourLabel(hour)}
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "grid relative",
                  viewMode === "Week" ? "grid-cols-7" : "grid-cols-1",
                )}
              >
                {HOURS.map((hour, index) => (
                  <div
                    key={`line-${hour}`}
                    className="absolute left-0 right-0 border-b border-border/40 pointer-events-none"
                    style={{
                      top: `${index * HOUR_HEIGHT}px`,
                      height: `${HOUR_HEIGHT}px`,
                    }}
                  />
                ))}

                {calendarDays.map((item, colIdx) => {
                  const dayDate = item.date;
                  return (
                    <div
                      key={`${dayDate?.toISOString() ?? `day-${colIdx}`}`}
                      className="relative border-r border-border/40 last:border-r-0"
                      style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
                      onClick={() => dayDate && onSelectedDateChange(dayDate)}
                    >
                      {dayDate &&
                        HOURS.map((hour, index) => (
                          <div
                            key={`${dayDate.toISOString()}-${hour}`}
                            className="absolute left-0 right-0 cursor-pointer hover:bg-muted/30 transition-colors"
                            style={{
                              top: `${index * HOUR_HEIGHT}px`,
                              height: `${HOUR_HEIGHT}px`,
                            }}
                            onDragOver={(e) =>
                              onHourSlotDragOver(e, dayDate, hour)
                            }
                            onDragLeave={onHourSlotDragLeave}
                            onDrop={(e) => onHourSlotDrop(e, dayDate, hour)}
                          >
                            {dropTargetDateKey ===
                              `${toLocalDateString(dayDate)}-${hour}` && (
                              <div className="absolute inset-0 ring-2 ring-primary ring-inset bg-primary/15" />
                            )}
                          </div>
                        ))}

                      {dayDate &&
                        (() => {
                          const daySessions = getAppointmentsForDay(dayDate);
                          const sessionsByHour = daySessions.reduce(
                            (acc, session) => {
                              const key = String(session.session_time);
                              if (!acc[key]) acc[key] = [];
                              acc[key].push(session);
                              return acc;
                            },
                            {} as Record<string, typeof daySessions>,
                          );

                          const overlapMeta = new Map<
                            string,
                            { index: number; count: number }
                          >();

                          Object.values(sessionsByHour).forEach((group) => {
                            group.forEach((session, index) => {
                              overlapMeta.set(session.id, {
                                index,
                                count: group.length,
                              });
                            });
                          });

                          return daySessions.map((session) => {
                            const therapist = getTherapist(
                              session.therapist_id,
                            );
                            const color =
                              therapist?.calendar_color ?? "var(--primary)";
                            const isOutsideBusinessHours =
                              session.session_time < START_HOUR ||
                              session.session_time > END_HOUR;
                            const meta = overlapMeta.get(session.id) ?? {
                              index: 0,
                              count: 1,
                            };
                            const itemWidthPercent = 100 / meta.count;
                            return (
                              <div
                                key={session.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, session.id)}
                                onDragEnd={onDragEnd}
                                onClick={() => onEditSession(session.id)}
                                className={cn(
                                  "absolute p-2 rounded-lg border border-border bg-card text-foreground text-[10px] font-bold overflow-hidden z-10 cursor-grab active:cursor-grabbing hover:bg-muted/40 transition-colors",
                                  draggedSessionId === session.id &&
                                    "opacity-50",
                                  isOutsideBusinessHours && "opacity-60",
                                )}
                                style={{
                                  borderLeftColor: color,
                                  borderLeftWidth:
                                    viewMode === "Week" ? "3px" : "10px",
                                  top: `${calculateTop(session.session_time)}px`,
                                  height: `${Math.max(HOUR_HEIGHT - 12, 48)}px`,
                                  left: `calc(${meta.index * itemWidthPercent}% + 4px)`,
                                  width: `calc(${itemWidthPercent}% - 8px)`,
                                }}
                                title={
                                  isOutsideBusinessHours
                                    ? "Outside 7 AM - 6 PM visible range"
                                    : undefined
                                }
                              >
                                <div className="opacity-90">
                                  {formatSessionTime(session.session_time)}
                                </div>
                                <div className="truncate capitalize">
                                  {getPatientName(
                                    session.patient_id,
                                  ).toLowerCase()}
                                </div>
                              </div>
                            );
                          });
                        })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

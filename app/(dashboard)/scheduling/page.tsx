"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useSchedulingStore,
  ScheduleGrid,
  SessionModal,
  ViewSessionDetailsPopup,
} from "@/features/scheduling";
import type { CalendarViewMode } from "@/features/scheduling/constants/calendar.constants";
import type { ScheduleSession } from "@/features/scheduling";

const initialFormData = {
  patient_id: "",
  therapist_id: "",
  service_id: "",
  remarks: "",
  session_date: new Date().toISOString().split("T")[0],
  session_time: "10",
};

function getRangeStartEnd(
  viewMode: CalendarViewMode,
  currentDate: Date,
): { start: Date; end: Date } {
  const year = currentDate.getFullYear();
  const monthIdx = currentDate.getMonth();

  if (viewMode === "Month") {
    return {
      start: new Date(year, monthIdx, 1),
      end: new Date(year, monthIdx + 1, 0),
    };
  }
  if (viewMode === "Week") {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }

  return { start: new Date(currentDate), end: new Date(currentDate) };
}

export default function SchedulingPage() {
  const {
    sessions,
    patients,
    therapists,
    services,
    fetchForDateRange,
    fetchOptions,
    addSession,
    updateSession,
    deleteSession,
    getPatientName,
    getTherapist,
    isLoading,
    error,
  } = useSchedulingStore();

  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  const [viewMode, setViewMode] = useState<CalendarViewMode>("Day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [selectedTherapistIds, setSelectedTherapistIds] = useState<string[]>(
    [],
  );

  const loadRange = useCallback(() => {
    const { start, end } = getRangeStartEnd(viewMode, currentDate);
    void fetchForDateRange(start, end);
  }, [viewMode, currentDate, fetchForDateRange]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    loadRange();
  }, [loadRange]);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingSessionId(null);
  };

  const handleOpenEditModal = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setFormData({
        patient_id: session.patient_id,
        therapist_id: session.therapist_id,
        service_id: session.service_id,
        remarks: session.remarks,
        session_date: session.session_date,
        session_time: String(session.session_time),
      });
      setEditingSessionId(sessionId);
      setShowAddSessionModal(true);
    }
  };

  const handleOpenDetailsModal = (
    sessionId: string,
    event: React.MouseEvent,
  ) => {
    const anchor = event.currentTarget as HTMLElement;
    const rect = anchor.getBoundingClientRect();
    const popupWidth = 400;
    const gutter = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const prefersRight = rect.right + gutter + popupWidth <= viewportWidth;
    const left = prefersRight
      ? rect.right + gutter
      : Math.max(gutter, rect.left - popupWidth - gutter);

    const top = Math.max(
      gutter,
      Math.min(rect.top, viewportHeight - 520 - gutter),
    );

    setPopoverPos({ top, left });
    setSelectedSessionId(sessionId);
    setShowSessionDetailsModal(true);
  };

  useEffect(() => {
    if (!showSessionDetailsModal) return;

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!popoverRef.current?.contains(target)) {
        setShowSessionDetailsModal(false);
        setSelectedSessionId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSessionDetailsModal]);

  const handleSaveSession = async () => {
    if (
      !formData.patient_id ||
      !formData.therapist_id ||
      !formData.service_id ||
      !formData.session_date
    ) {
      return;
    }
    const payload = {
      patient_id: formData.patient_id,
      therapist_id: formData.therapist_id,
      service_id: formData.service_id,
      session_date: formData.session_date,
      session_time: parseInt(formData.session_time, 10),
      remarks: formData.remarks,
    };
    try {
      if (editingSessionId) {
        await updateSession(editingSessionId, payload);
      } else {
        await addSession(payload);
      }
      resetForm();
      setShowAddSessionModal(false);
      loadRange();
    } catch {
      // Error already set in store
    }
  };

  const handleCloseModal = () => {
    setShowAddSessionModal(false);
    resetForm();
  };

  const handleDeleteSession = async () => {
    const sessionId = editingSessionId ?? selectedSessionId;
    if (!sessionId) return;
    try {
      await deleteSession(sessionId);
      resetForm();
      setShowAddSessionModal(false);
      setShowSessionDetailsModal(false);
      setSelectedSessionId(null);
      loadRange();
    } catch {
      // Error already set in store
    }
  };

  const selectedSession: ScheduleSession | undefined = selectedSessionId
    ? sessions.find((session) => session.id === selectedSessionId)
    : undefined;

  const selectedServiceName = selectedSession
    ? services.find((service) => service.id === selectedSession.service_id)?.name ??
      "—"
    : "—";

  const selectedTherapistName = selectedSession
    ? getTherapist(selectedSession.therapist_id)?.name ?? "—"
    : "—";

  const selectedPatientName = selectedSession
    ? getPatientName(selectedSession.patient_id)
    : "—";

  const selectedScheduleDate = selectedSession
    ? new Date(`${selectedSession.session_date}T00:00:00`).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : "—";

  const selectedScheduleTime = selectedSession
    ? `${String(selectedSession.session_time).padStart(2, "0")}:00`
    : "—";

  return (
    <div className="space-y-6">
      <ScheduleGrid
        sessions={sessions}
        therapists={therapists}
        selectedTherapistIds={selectedTherapistIds}
        onTherapistFilterChange={setSelectedTherapistIds}
        getPatientName={getPatientName}
        getTherapist={getTherapist}
        updateSession={(id, payload) =>
          updateSession(id, {
            session_date: payload.session_date,
            session_time: payload.session_time,
          })
        }
        onEditSession={handleOpenDetailsModal}
        onAddSession={() => {
          resetForm();
          setFormData({
            ...initialFormData,
            session_date: `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, "0")}-${String(selectedDateObj.getDate()).padStart(2, "0")}`,
          });
          setShowAddSessionModal(true);
        }}
        currentDate={currentDate}
        viewMode={viewMode}
        selectedDateObj={selectedDateObj}
        onCurrentDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onSelectedDateChange={setSelectedDateObj}
        isLoading={isLoading}
        error={error}
      />

      {showAddSessionModal && (
        <SessionModal
          isEdit={!!editingSessionId}
          formData={formData}
          onFormChange={setFormData}
          onSave={handleSaveSession}
          onClose={handleCloseModal}
          patients={patients}
          therapists={therapists}
          services={services}
        />
      )}

      {showSessionDetailsModal && selectedSession ? (
        <ViewSessionDetailsPopup
          patientName={selectedPatientName}
          scheduleDate={selectedScheduleDate}
          scheduleTime={selectedScheduleTime}
          therapistName={selectedTherapistName}
          serviceName={selectedServiceName}
          remarks={selectedSession.remarks}
          popoverPos={popoverPos}
          popoverRef={popoverRef}
          onEdit={() => {
            setShowSessionDetailsModal(false);
            handleOpenEditModal(selectedSession.id);
          }}
          onDelete={handleDeleteSession}
          onClose={() => {
            setShowSessionDetailsModal(false);
            setSelectedSessionId(null);
          }}
        />
      ) : null}
    </div>
  );
}

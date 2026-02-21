"use client";

import { create } from "zustand";
import type {
  ScheduleSession,
  PatientOption,
  TherapistOption,
  ServiceOption,
} from "../types";
import * as schedulingService from "../services/scheduling.service";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

interface SchedulingState {
  sessions: ScheduleSession[];
  patients: PatientOption[];
  therapists: TherapistOption[];
  services: ServiceOption[];
  weekStart: Date;
  isLoading: boolean;
  error: string | null;

  setWeekStart: (date: Date) => void;
  fetchForWeek: (weekStart: Date) => Promise<void>;
  fetchForDateRange: (start: Date, end: Date) => Promise<void>;
  fetchOptions: () => Promise<void>;
  addSession: (payload: {
    patient_id: string;
    therapist_id: string;
    service_id: string;
    session_date: string;
    session_time: number;
    remarks?: string;
  }) => Promise<void>;
  updateSession: (
    id: string,
    payload: {
      patient_id?: string;
      therapist_id?: string;
      service_id?: string;
      session_date?: string;
      session_time?: number;
      remarks?: string;
    }
  ) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

  getPatientName: (patientId: string) => string;
  getTherapist: (therapistId: string) => TherapistOption | undefined;
}

export const useSchedulingStore = create<SchedulingState>((set, get) => ({
  sessions: [],
  patients: [],
  therapists: [],
  services: [],
  weekStart: getWeekStart(new Date()),
  isLoading: false,
  error: null,

  setWeekStart: (date: Date) => {
    set({ weekStart: getWeekStart(date) });
    void get().fetchForWeek(getWeekStart(date));
  },

  fetchForWeek: async (weekStart: Date) => {
    const weekEnd = getWeekEnd(weekStart);
    return get().fetchForDateRange(weekStart, weekEnd);
  },

  fetchForDateRange: async (start: Date, end: Date) => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await schedulingService.fetchAppointmentsForDateRange(
        start,
        end
      );
      set({ sessions, isLoading: false, error: null });
    } catch (err) {
      set({
        sessions: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load schedule",
      });
    }
  },

  fetchOptions: async () => {
    try {
      const [patients, therapists, services] = await Promise.all([
        schedulingService.fetchPatientsOptions(),
        schedulingService.fetchTherapistsOptions(),
        schedulingService.fetchServicesOptions(),
      ]);
      set({ patients, therapists, services });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load options",
      });
    }
  },

  addSession: async (payload) => {
    set({ error: null });
    try {
      const session = await schedulingService.createAppointment({
        patient_id: payload.patient_id,
        therapist_id: payload.therapist_id,
        service_id: payload.service_id,
        appointment_date: payload.session_date,
        appointment_time: payload.session_time,
        remarks: payload.remarks,
      });
      set((s) => ({ sessions: [...s.sessions, session] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to add session",
      });
      throw err;
    }
  },

  updateSession: async (id, payload) => {
    set({ error: null });
    try {
      const session = await schedulingService.updateAppointment(id, {
        patient_id: payload.patient_id,
        therapist_id: payload.therapist_id,
        service_id: payload.service_id,
        appointment_date: payload.session_date,
        appointment_time: payload.session_time,
        remarks: payload.remarks,
      });
      set((s) => ({
        sessions: s.sessions.map((x) => (x.id === id ? session : x)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update session",
      });
      throw err;
    }
  },

  deleteSession: async (id) => {
    set({ error: null });
    try {
      await schedulingService.deleteAppointment(id);
      set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete session",
      });
      throw err;
    }
  },

  getPatientName: (patientId: string) => {
    const p = get().patients.find((x) => x.id === patientId);
    return p?.name ?? "—";
  },

  getTherapist: (therapistId: string) => {
    return get().therapists.find((x) => x.id === therapistId);
  },
}));

"use client";

import { create } from "zustand";
import type { Patient, PatientFormData, DoctorOption } from "../types";
import * as patientService from "../services/patient.service";

interface PatientState {
  patients: (Patient & { doctor_name?: string })[];
  doctors: DoctorOption[];
  isLoading: boolean;
  error: string | null;

  fetchPatients: (search?: string) => Promise<void>;
  fetchDoctors: () => Promise<void>;
  createPatient: (data: PatientFormData) => Promise<void>;
  updatePatient: (id: string, data: PatientFormData) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  doctors: [],
  isLoading: false,
  error: null,

  fetchPatients: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const list = await patientService.fetchPatientsWithDoctors(search);
      set({ patients: list, isLoading: false, error: null });
    } catch (err) {
      set({
        patients: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch patients",
      });
    }
  },

  fetchDoctors: async () => {
    try {
      const doctors = await patientService.fetchDoctors();
      set({ doctors });
    } catch {
      set({ doctors: [] });
    }
  },

  createPatient: async (data) => {
    set({ error: null });
    try {
      const patient = await patientService.createPatient(data);
      const doc = get().doctors.find((d) => d.id === patient.doctor_id);
      const withDoctor = { ...patient, doctor_name: doc?.name ?? "—" };
      set((s) => ({ patients: [...s.patients, withDoctor] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create patient",
      });
      throw err;
    }
  },

  updatePatient: async (id, data) => {
    set({ error: null });
    try {
      const patient = await patientService.updatePatient(id, data);
      const doc = get().doctors.find((d) => d.id === patient.doctor_id);
      set((s) => ({
        patients: s.patients.map((p) =>
          p.id === id ? { ...patient, doctor_name: doc?.name ?? p.doctor_name ?? "—" } : p
        ),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update patient",
      });
      throw err;
    }
  },

  deletePatient: async (id) => {
    set({ error: null });
    try {
      await patientService.deletePatient(id);
      set((s) => ({ patients: s.patients.filter((p) => p.id !== id) }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete patient",
      });
      throw err;
    }
  },
}));

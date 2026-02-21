"use client";

import { create } from "zustand";
import type { Doctor, DoctorFormData } from "../types";
import * as doctorService from "../services/doctor.service";

interface DoctorState {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;

  fetchDoctors: (search?: string) => Promise<void>;
  createDoctor: (data: DoctorFormData) => Promise<void>;
  updateDoctor: (id: string, data: DoctorFormData) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
}

export const useDoctorStore = create<DoctorState>((set) => ({
  doctors: [],
  isLoading: false,
  error: null,

  fetchDoctors: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const list = await doctorService.fetchDoctors(search);
      set({ doctors: list, isLoading: false, error: null });
    } catch (err) {
      set({
        doctors: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch doctors",
      });
    }
  },

  createDoctor: async (data) => {
    set({ error: null });
    try {
      const doctor = await doctorService.createDoctor(data);
      set((s) => ({ doctors: [...s.doctors, doctor] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create doctor",
      });
      throw err;
    }
  },

  updateDoctor: async (id, data) => {
    set({ error: null });
    try {
      const doctor = await doctorService.updateDoctor(id, data);
      set((s) => ({
        doctors: s.doctors.map((d) => (d.id === id ? doctor : d)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update doctor",
      });
      throw err;
    }
  },

  deleteDoctor: async (id) => {
    set({ error: null });
    try {
      await doctorService.deleteDoctor(id);
      set((s) => ({ doctors: s.doctors.filter((d) => d.id !== id) }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete doctor",
      });
      throw err;
    }
  },
}));

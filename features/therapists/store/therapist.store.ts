"use client";

import { create } from "zustand";
import type { Therapist, TherapistFormData } from "../types";
import * as therapistService from "../services/therapist.service";

interface TherapistState {
  therapists: Therapist[];
  isLoading: boolean;
  error: string | null;

  fetchTherapists: (search?: string) => Promise<void>;
  createTherapist: (data: TherapistFormData) => Promise<void>;
  updateTherapist: (id: string, data: TherapistFormData) => Promise<void>;
  deleteTherapist: (id: string) => Promise<void>;
}

export const useTherapistStore = create<TherapistState>((set, get) => ({
  therapists: [],
  isLoading: false,
  error: null,

  fetchTherapists: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const list = await therapistService.fetchTherapists(search);
      set({ therapists: list, isLoading: false, error: null });
    } catch (err) {
      set({
        therapists: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch therapists",
      });
    }
  },

  createTherapist: async (data) => {
    set({ error: null });
    try {
      const therapist = await therapistService.createTherapist(data);
      set((s) => ({ therapists: [...s.therapists, therapist] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create therapist",
      });
      throw err;
    }
  },

  updateTherapist: async (id, data) => {
    set({ error: null });
    try {
      const therapist = await therapistService.updateTherapist(id, data);
      set((s) => ({
        therapists: s.therapists.map((t) => (t.id === id ? therapist : t)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update therapist",
      });
      throw err;
    }
  },

  deleteTherapist: async (id) => {
    set({ error: null });
    try {
      await therapistService.deleteTherapist(id);
      set((s) => ({ therapists: s.therapists.filter((t) => t.id !== id) }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete therapist",
      });
      throw err;
    }
  },
}));

"use client";

import { create } from "zustand";
import type {
  DashboardStats,
  TopPatientBySessions,
  TherapistSummary,
} from "../types";
import * as dashboardService from "../services/dashboard.service";

interface DashboardState {
  stats: DashboardStats | null;
  topPatients: TopPatientBySessions[];
  therapists: TherapistSummary[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
}

const initialStats: DashboardStats = {
  total_revenue: 0,
  total_sessions: 0,
  active_services: 0,
  total_therapists: 0,
};

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  topPatients: [],
  therapists: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const [stats, topPatients, therapists] = await Promise.all([
        dashboardService.fetchDashboardStats(),
        dashboardService.fetchTopPatientsBySessions(5),
        dashboardService.fetchTherapists(),
      ]);
      set({
        stats,
        topPatients,
        therapists,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        stats: initialStats,
        topPatients: [],
        therapists: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard",
      });
    }
  },
}));

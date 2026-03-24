"use client";

import { create } from "zustand";
import type {
  BillingStats,
  BillingBreakdown,
  BillingDatePreset,
  DateRange,
  PayrollTransaction,
} from "../types";
import type {
  ServiceCutOption,
  TherapistComputedRevenueRow,
  TherapistOption,
} from "../services/billing.service";
import * as billingService from "../services/billing.service";
import {
  getTodayRange,
  getWeekRange,
  getMonthRange,
} from "../utils/dateRange";

interface BillingState {
  stats: BillingStats | null;
  breakdown: BillingBreakdown | null;
  preset: BillingDatePreset;
  range: DateRange;
  therapists: TherapistOption[];
  serviceCuts: ServiceCutOption[];
  therapistComputedRevenue: TherapistComputedRevenueRow[];
  payroll: PayrollTransaction[];
  isLoading: boolean;
  error: string | null;

  setPreset: (preset: BillingDatePreset) => void;
  setRange: (range: DateRange) => void;
  fetchBilling: () => Promise<void>;
  fetchPayroll: () => Promise<void>;
  addPayrollTransaction: (entry: {
    therapist_id: string;
    amount: number;
  }) => Promise<PayrollTransaction | null>;
  markPayrollPaid: (id: string) => Promise<void>;
  deletePayrollTransaction: (id: string) => Promise<void>;
}

function getRangeForPreset(preset: BillingDatePreset): DateRange {
  switch (preset) {
    case "today":
      return getTodayRange();
    case "week":
      return getWeekRange();
    case "month":
      return getMonthRange();
    default:
      return getMonthRange();
  }
}

export const useBillingStore = create<BillingState>((set, get) => ({
  stats: null,
  breakdown: null,
  preset: "month",
  range: getMonthRange(),
  therapists: [],
  serviceCuts: [],
  therapistComputedRevenue: [],
  payroll: [],
  isLoading: false,
  error: null,

  setPreset: (preset) => {
    const range =
      preset === "range" ? get().range : getRangeForPreset(preset);
    set({ preset, range });
    void get().fetchBilling();
  },

  setRange: (range) => {
    set({ range });
    if (get().preset === "range") {
      void get().fetchBilling();
    }
  },

  fetchBilling: async () => {
    const { preset, range } = get();
    const { from, to } = preset === "range" ? range : getRangeForPreset(preset);
    set({ isLoading: true, error: null });
    try {
      const [stats, breakdown, therapists, serviceCuts, therapistComputedRevenue, payroll] = await Promise.all([
        billingService.fetchBillingStats(from, to),
        billingService.fetchBillingBreakdown(from, to),
        billingService.fetchTherapistsForBilling(),
        billingService.fetchServiceCutsForBilling(),
        billingService.fetchTherapistComputedRevenue(from, to),
        billingService.fetchPayroll(),
      ]);
      set({
        stats,
        breakdown,
        therapists,
        serviceCuts,
        therapistComputedRevenue,
        payroll,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        stats: null,
        breakdown: null,
        therapistComputedRevenue: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load billing",
      });
    }
  },

  fetchPayroll: async () => {
    try {
      const payroll = await billingService.fetchPayroll();
      set({ payroll });
    } catch {
      // keep existing payroll on error
    }
  },

  addPayrollTransaction: async (entry) => {
    try {
      const tx = await billingService.addPayrollTransaction(entry);
      set((s) => ({ payroll: [tx, ...s.payroll] }));
      return tx;
    } catch {
      return null;
    }
  },

  markPayrollPaid: async (id) => {
    const paid_date = new Date().toISOString().split("T")[0];
    await billingService.updatePayrollTransaction(id, {
      is_paid: true,
      paid_date,
    });
    set((s) => ({
      payroll: s.payroll.map((t) =>
        t.id === id ? { ...t, is_paid: true, paid_date } : t
      ),
    }));
  },

  deletePayrollTransaction: async (id) => {
    await billingService.deletePayrollTransaction(id);
    set((s) => ({ payroll: s.payroll.filter((t) => t.id !== id) }));
  },
}));

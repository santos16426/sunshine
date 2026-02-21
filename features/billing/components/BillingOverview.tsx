"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Wallet,
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { StatBox } from "@/features/dashboard/components/StatBox";
import { useBillingStore } from "../store/billing.store";
import {
  getTodayRange,
  getWeekRange,
  getMonthRange,
} from "../utils/dateRange";
import type { BillingDatePreset } from "../types";

const PRESETS: { key: BillingDatePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "range", label: "Date range" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyDecimals(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRangeLabel(from: string, to: string): string {
  if (from === to) return formatDate(from + "T00:00:00");
  return `${formatDate(from + "T00:00:00")} → ${formatDate(to + "T00:00:00")}`;
}

export function BillingOverview() {
  const {
    stats,
    breakdown,
    preset,
    range,
    ownerCutPercentage,
    therapists,
    payroll,
    isLoading,
    error,
    setPreset,
    setRange,
    setOwnerCutPercentage,
    fetchBilling,
    addPayrollTransaction,
    markPayrollPaid,
    deletePayrollTransaction,
  } = useBillingStore();

  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [payrollForm, setPayrollForm] = useState({ therapistId: "", amount: "" });

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const rangeLabel =
    preset === "range"
      ? formatRangeLabel(range.from, range.to)
      : preset === "today"
        ? formatRangeLabel(getTodayRange().from, getTodayRange().to)
        : preset === "week"
          ? formatRangeLabel(getWeekRange().from, getWeekRange().to)
          : formatRangeLabel(getMonthRange().from, getMonthRange().to);

  const totalGrossRevenue = stats?.total_revenue ?? 0;
  const totalOwnerCut = (totalGrossRevenue * ownerCutPercentage) / 100;
  const totalTherapistCut = totalGrossRevenue - totalOwnerCut;

  const getTherapistName = (id: string) =>
    therapists.find((t) => t.id === id)?.name ?? "—";

  const handleAddPayroll = () => {
    if (!payrollForm.therapistId || !payrollForm.amount) return;
    const amount = parseFloat(payrollForm.amount);
    if (Number.isNaN(amount) || amount <= 0) return;
    addPayrollTransaction({
      therapist_id: payrollForm.therapistId,
      amount,
    }).then(() => {
      setPayrollForm({ therapistId: "", amount: "" });
      setShowPayrollModal(false);
    });
  };

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="font-semibold text-destructive">{error}</p>
          <button
            type="button"
            onClick={() => fetchBilling()}
            className="mt-3 rounded-xl bg-destructive/20 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Track revenue by therapist and manage payments.
        </p>
      </div>

      {/* Settings and date range */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Billing Settings
          </h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-muted-foreground">
              Owner cut (%):
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={ownerCutPercentage}
              onChange={(e) =>
                setOwnerCutPercentage(Number(e.target.value) || 0)
              }
              className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Date range
          </h2>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset(key)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    preset === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {preset === "range" && (
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <input
                  type="date"
                  value={range.from}
                  onChange={(e) =>
                    setRange({ ...range, from: e.target.value || range.from })
                  }
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="date"
                  value={range.to}
                  onChange={(e) =>
                    setRange({ ...range, to: e.target.value || range.to })
                  }
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">{rangeLabel}</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 animate-pulse"
            >
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total gross revenue
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalGrossRevenue)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.total_sessions ?? 0} sessions
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Your earnings ({ownerCutPercentage}%)
              </h3>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(totalOwnerCut)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Therapists to pay
              </h3>
              <p className="text-2xl font-bold text-chart-1">
                {formatCurrency(totalTherapistCut)}
              </p>
            </div>
          </div>

          {/* Revenue by therapist */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Revenue by therapist
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Therapist
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Avg rate/hr
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Gross revenue
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Your cut
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Therapist pay
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(breakdown?.by_therapist ?? []).map((row) => {
                    const ownerCut = (row.gross_revenue * ownerCutPercentage) / 100;
                    const therapistPay = row.gross_revenue - ownerCut;
                    const avgRate =
                      row.sessions_count > 0
                        ? row.gross_revenue / row.sessions_count
                        : 0;
                    return (
                      <tr key={row.therapist_id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {row.name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-chart-1/20 text-chart-1">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-foreground">
                          {formatCurrencyDecimals(avgRate)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                          {row.sessions_count}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          {formatCurrencyDecimals(row.gross_revenue)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-primary">
                          {formatCurrencyDecimals(ownerCut)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-chart-1">
                          {formatCurrencyDecimals(therapistPay)}
                        </td>
                      </tr>
                    );
                  })}
                  {(breakdown?.by_therapist?.length ?? 0) > 0 && (
                    <tr className="bg-muted/50 font-semibold border-t-2 border-border">
                      <td colSpan={3} className="px-6 py-4 text-sm text-foreground">
                        Total
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-foreground">
                        {stats?.total_sessions ?? 0}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-foreground">
                        {formatCurrencyDecimals(totalGrossRevenue)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-primary">
                        {formatCurrencyDecimals(totalOwnerCut)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-chart-1">
                        {formatCurrencyDecimals(totalTherapistCut)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {(breakdown?.by_therapist?.length ?? 0) === 0 && !isLoading && (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  No sessions in this period.
                </div>
              )}
            </div>
          </div>

          {/* Revenue by service */}
          {(breakdown?.by_service?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Revenue by service
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on service rates for each session in the period.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Service
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Rate/hr
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Sessions
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Total revenue
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Your cut ({ownerCutPercentage}%)
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Therapist pay
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(breakdown?.by_service ?? []).map((row) => {
                      const ownerCut =
                        (row.total_revenue * ownerCutPercentage) / 100;
                      const therapistPay = row.total_revenue - ownerCut;
                      return (
                        <tr key={row.service_id} className="hover:bg-muted/30">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {row.name}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                            {formatCurrencyDecimals(row.rate_per_hour)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                            {row.sessions_count}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                            {formatCurrencyDecimals(row.total_revenue)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-primary">
                            {formatCurrencyDecimals(ownerCut)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-chart-1">
                            {formatCurrencyDecimals(therapistPay)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-muted/50 font-semibold border-t-2 border-border">
                      <td colSpan={2} className="px-6 py-4 text-sm text-foreground">
                        Total
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-foreground">
                        {breakdown?.by_service?.reduce(
                          (s, r) => s + r.sessions_count,
                          0
                        ) ?? 0}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-foreground">
                        {formatCurrencyDecimals(
                          breakdown?.by_service?.reduce(
                            (s, r) => s + r.total_revenue,
                            0
                          ) ?? 0
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-primary">
                        {formatCurrencyDecimals(
                          (breakdown?.by_service ?? []).reduce(
                            (s, r) =>
                              s + (r.total_revenue * ownerCutPercentage) / 100,
                            0
                          )
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-chart-1">
                        {formatCurrencyDecimals(
                          (breakdown?.by_service ?? []).reduce(
                            (s, r) =>
                              s +
                              r.total_revenue -
                              (r.total_revenue * ownerCutPercentage) / 100,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payroll */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Therapist payroll
              </h2>
              <button
                type="button"
                onClick={() => setShowPayrollModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add payment
              </button>
            </div>
            <div className="overflow-x-auto">
              {payroll.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  No payroll transactions yet.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Therapist
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payroll.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {getTherapistName(tx.therapist_id)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          {formatCurrencyDecimals(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {tx.is_paid ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-chart-3" />
                                <span className="text-chart-3 font-medium">
                                  Paid
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-destructive" />
                                <span className="text-destructive font-medium">
                                  Unpaid
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!tx.is_paid && (
                              <button
                                type="button"
                                onClick={() => markPayrollPaid(tx.id)}
                                className="px-3 py-1.5 rounded-lg bg-chart-3/20 text-chart-3 hover:bg-chart-3/30 text-sm font-medium"
                              >
                                Mark paid
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deletePayrollTransaction(tx.id)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add payroll modal */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-2xl border border-border bg-card shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Add payroll transaction
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Therapist *
                </label>
                <select
                  value={payrollForm.therapistId}
                  onChange={(e) =>
                    setPayrollForm({
                      ...payrollForm,
                      therapistId: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a therapist...</option>
                  {therapists.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount (₱) *
                </label>
                <input
                  type="number"
                  value={payrollForm.amount}
                  onChange={(e) =>
                    setPayrollForm({ ...payrollForm, amount: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPayrollModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPayroll}
                className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-semibold"
              >
                Add transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/client";
import type {
  BillingStats,
  BillingBreakdown,
  PayrollTransaction,
} from "../types";

export async function fetchBillingStats(
  dateFrom: string,
  dateTo: string
): Promise<BillingStats> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_billing_stats", {
    p_date_from: dateFrom,
    p_date_to: dateTo,
  });

  if (error) throw error;

  const raw = data as {
    total_revenue: number;
    total_therapist_pay: number;
    total_sessions: number;
  };
  return {
    total_revenue: Number(raw?.total_revenue ?? 0),
    total_therapist_pay: Number(raw?.total_therapist_pay ?? 0),
    total_sessions: Number(raw?.total_sessions ?? 0),
  };
}

export async function fetchBillingBreakdown(
  dateFrom: string,
  dateTo: string
): Promise<BillingBreakdown> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_billing_breakdown", {
    p_date_from: dateFrom,
    p_date_to: dateTo,
  });

  if (error) throw error;

  const raw = data as {
    by_therapist: Array<{
      therapist_id: string;
      name: string;
      type: string;
      sessions_count: number;
      gross_revenue: number;
    }>;
    by_service: Array<{
      service_id: string;
      name: string;
      rate_per_hour: number;
      sessions_count: number;
      total_revenue: number;
    }>;
  };
  return {
    by_therapist: (raw?.by_therapist ?? []).map((r) => ({
      therapist_id: r.therapist_id,
      name: r.name,
      type: r.type,
      sessions_count: Number(r.sessions_count ?? 0),
      gross_revenue: Number(r.gross_revenue ?? 0),
    })),
    by_service: (raw?.by_service ?? []).map((r) => ({
      service_id: r.service_id,
      name: r.name,
      rate_per_hour: Number(r.rate_per_hour ?? 0),
      sessions_count: Number(r.sessions_count ?? 0),
      total_revenue: Number(r.total_revenue ?? 0),
    })),
  };
}

export interface TherapistOption {
  id: string;
  name: string;
}

export interface ServiceCutOption {
  id: string;
  clinic_cut: number;
}

export interface TherapistComputedRevenueRow {
  therapist_id: string;
  name: string;
  type: string;
  sessions_count: number;
  gross_revenue: number;
  clinic_share: number;
  therapist_pay: number;
}

export async function fetchTherapistsForBilling(): Promise<TherapistOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("therapists")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.id, name: r.name }));
}

export async function fetchServiceCutsForBilling(): Promise<ServiceCutOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("services").select("id, clinic_cut");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    clinic_cut: Number(r.clinic_cut ?? 0),
  }));
}

export async function fetchTherapistComputedRevenue(
  dateFrom: string,
  dateTo: string
): Promise<TherapistComputedRevenueRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "therapist_id, service_id, therapists!inner(name, therapist_type), services!inner(rate_per_hour, clinic_cut)"
    )
    .gte("appointment_date", dateFrom)
    .lte("appointment_date", dateTo);
  if (error) throw error;

  const grouped = new Map<string, TherapistComputedRevenueRow>();
  for (const row of data ?? []) {
    const serviceRow = Array.isArray(row.services) ? row.services[0] : row.services;
    const therapistRow = Array.isArray(row.therapists) ? row.therapists[0] : row.therapists;
    if (!serviceRow || !therapistRow) continue;

    const grossRevenue = Number(serviceRow.rate_per_hour ?? 0);
    const clinicCut = Number(serviceRow.clinic_cut ?? 0);
    const clinicShare = (grossRevenue * clinicCut) / 100;
    const therapistPay = grossRevenue - clinicShare;
    const therapistId = row.therapist_id as string;

    const existing = grouped.get(therapistId);
    if (existing) {
      existing.sessions_count += 1;
      existing.gross_revenue += grossRevenue;
      existing.clinic_share += clinicShare;
      existing.therapist_pay += therapistPay;
      continue;
    }

    grouped.set(therapistId, {
      therapist_id: therapistId,
      name: String(therapistRow.name ?? "—"),
      type: String(therapistRow.therapist_type ?? "—"),
      sessions_count: 1,
      gross_revenue: grossRevenue,
      clinic_share: clinicShare,
      therapist_pay: therapistPay,
    });
  }

  return Array.from(grouped.values()).sort((a, b) => b.gross_revenue - a.gross_revenue);
}

export async function fetchPayroll(): Promise<PayrollTransaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payroll_transactions")
    .select("id, therapist_id, amount, is_paid, paid_date, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    therapist_id: r.therapist_id,
    amount: Number(r.amount),
    is_paid: Boolean(r.is_paid),
    paid_date: r.paid_date ?? null,
    created_at: r.created_at,
  }));
}

export async function addPayrollTransaction(entry: {
  therapist_id: string;
  amount: number;
}): Promise<PayrollTransaction> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payroll_transactions")
    .insert({
      therapist_id: entry.therapist_id,
      amount: entry.amount,
      is_paid: false,
    })
    .select("id, therapist_id, amount, is_paid, paid_date, created_at")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    therapist_id: data.therapist_id,
    amount: Number(data.amount),
    is_paid: Boolean(data.is_paid),
    paid_date: data.paid_date ?? null,
    created_at: data.created_at,
  };
}

export async function updatePayrollTransaction(
  id: string,
  updates: { is_paid: boolean; paid_date: string }
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("payroll_transactions")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deletePayrollTransaction(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("payroll_transactions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

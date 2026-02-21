export interface BillingStats {
  total_revenue: number;
  total_therapist_pay: number;
  total_sessions: number;
}

export type BillingDatePreset = "today" | "week" | "month" | "range";

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;
}

export interface TherapistBreakdownRow {
  therapist_id: string;
  name: string;
  type: string;
  sessions_count: number;
  gross_revenue: number;
}

export interface ServiceBreakdownRow {
  service_id: string;
  name: string;
  rate_per_hour: number;
  sessions_count: number;
  total_revenue: number;
}

export interface BillingBreakdown {
  by_therapist: TherapistBreakdownRow[];
  by_service: ServiceBreakdownRow[];
}

export interface PayrollTransaction {
  id: string;
  therapist_id: string;
  amount: number;
  is_paid: boolean;
  paid_date: string | null;
  created_at: string;
}

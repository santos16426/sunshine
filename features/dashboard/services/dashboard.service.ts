import { createClient } from "@/lib/supabase/client";
import type {
  DashboardStats,
  TopPatientBySessions,
  TherapistSummary,
} from "../types";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_dashboard_stats");

  if (error) throw error;

  const raw = data as {
    total_revenue: number;
    total_sessions: number;
    active_services: number;
    total_therapists: number;
  };
  return {
    total_revenue: Number(raw?.total_revenue ?? 0),
    total_sessions: Number(raw?.total_sessions ?? 0),
    active_services: Number(raw?.active_services ?? 0),
    total_therapists: Number(raw?.total_therapists ?? 0),
  };
}

export async function fetchTopPatientsBySessions(
  limit: number = 5
): Promise<TopPatientBySessions[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_top_patients_by_sessions", {
    lim: limit,
  });

  if (error) throw error;

  const rows = (data ?? []) as Array<{
    id: string;
    name: string;
    age: number;
    guardian_name: string;
    medical_diagnosis: string;
  }>;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    age: r.age,
    guardian_name: r.guardian_name,
    medical_diagnosis: r.medical_diagnosis,
  }));
}

export async function fetchTherapists(): Promise<TherapistSummary[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("therapists")
    .select("id, name, therapist_type, calendar_color")
    .order("name", { ascending: true });
  return (data ?? []) as TherapistSummary[];
}

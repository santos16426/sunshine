import { createClient } from "@/lib/supabase/client";
import { toLocalDateString } from "../utils/date";
import type {
  ScheduleSession,
  PatientOption,
  TherapistOption,
  ServiceOption,
} from "../types";

function toSession(row: {
  id: string;
  patient_id: string;
  therapist_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: number;
  remarks: string | null;
}): ScheduleSession {
  return {
    id: row.id,
    patient_id: row.patient_id,
    therapist_id: row.therapist_id,
    service_id: row.service_id,
    session_date: row.appointment_date,
    session_time: row.appointment_time,
    remarks: row.remarks ?? "",
  };
}

/** Fetch appointments whose date falls within [start, end] (inclusive). Uses local date to avoid timezone shift. */
export async function fetchAppointmentsForDateRange(
  start: Date,
  end: Date
): Promise<ScheduleSession[]> {
  const supabase = createClient();
  const startStr = toLocalDateString(start);
  const endStr = toLocalDateString(end);

  const { data, error } = await supabase
    .from("appointments")
    .select("id, patient_id, therapist_id, service_id, appointment_date, appointment_time, remarks")
    .gte("appointment_date", startStr)
    .lte("appointment_date", endStr)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toSession);
}

/** Alias for date range (e.g. week). */
export const fetchAppointmentsForWeek = fetchAppointmentsForDateRange;

export async function createAppointment(payload: {
  patient_id: string;
  therapist_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: number;
  remarks?: string;
}): Promise<ScheduleSession> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_id: payload.patient_id,
      therapist_id: payload.therapist_id,
      service_id: payload.service_id,
      appointment_date: payload.appointment_date,
      appointment_time: payload.appointment_time,
      remarks: payload.remarks ?? null,
    })
    .select("id, patient_id, therapist_id, service_id, appointment_date, appointment_time, remarks")
    .single();

  if (error) throw error;
  return toSession(data);
}

export async function updateAppointment(
  id: string,
  payload: {
    patient_id?: string;
    therapist_id?: string;
    service_id?: string;
    appointment_date?: string;
    appointment_time?: number;
    remarks?: string;
  }
): Promise<ScheduleSession> {
  const supabase = createClient();
  const row: Record<string, unknown> = {};
  if (payload.patient_id != null) row.patient_id = payload.patient_id;
  if (payload.therapist_id != null) row.therapist_id = payload.therapist_id;
  if (payload.service_id != null) row.service_id = payload.service_id;
  if (payload.appointment_date != null) row.appointment_date = payload.appointment_date;
  if (payload.appointment_time != null) row.appointment_time = payload.appointment_time;
  if (payload.remarks != null) row.remarks = payload.remarks;

  const { data, error } = await supabase
    .from("appointments")
    .update(row)
    .eq("id", id)
    .select("id, patient_id, therapist_id, service_id, appointment_date, appointment_time, remarks")
    .single();

  if (error) throw error;
  return toSession(data);
}

export async function deleteAppointment(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchPatientsOptions(): Promise<PatientOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PatientOption[];
}

export async function fetchTherapistsOptions(): Promise<TherapistOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("therapists")
    .select("id, name, therapist_type, calendar_color")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as TherapistOption[];
}

export async function fetchServicesOptions(): Promise<ServiceOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, rate_per_hour")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ServiceOption[];
}

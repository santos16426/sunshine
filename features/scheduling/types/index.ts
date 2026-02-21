/** Single appointment/session for the schedule grid (maps to public.appointments). */
export interface ScheduleSession {
  id: string;
  patient_id: string;
  therapist_id: string;
  service_id: string;
  session_date: string;
  session_time: number;
  remarks: string;
}

export interface PatientOption {
  id: string;
  name: string;
}

export interface TherapistOption {
  id: string;
  name: string;
  therapist_type: string;
  calendar_color: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  rate_per_hour: number;
}

export interface SessionFormData {
  patient_id: string;
  therapist_id: string;
  service_id: string;
  remarks: string;
  session_date: string;
  session_time: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_sessions: number;
  active_services: number;
  total_therapists: number;
}

/** Top patient by session count (from RPC get_top_patients_by_sessions). */
export interface TopPatientBySessions {
  id: string;
  name: string;
  age: number;
  guardian_name: string;
  medical_diagnosis: string;
}

/** Minimal patient summary for list UIs (e.g. ActivePatients). */
export interface PatientSummary {
  id: string;
  name: string;
  guardian_name: string;
  medical_diagnosis: string;
}

export interface TherapistSummary {
  id: string;
  name: string;
  therapist_type: string;
  calendar_color: string;
}

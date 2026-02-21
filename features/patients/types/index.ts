/** Patient row from Supabase (public.patients). */
export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  age: number;
  guardian_name: string;
  guardian_relationship: string;
  guardian_contact_number: string;
  medical_diagnosis: string;
  doctor_id: string;
  remarks: string | null;
}

/** For list display when joined with doctors. */
export interface PatientWithDoctor extends Patient {
  doctor_name?: string;
}

/** Form payload for create/update (matches DB columns). */
export interface PatientFormData {
  name: string;
  date_of_birth: string;
  age: number;
  guardian_name: string;
  guardian_relationship: string;
  guardian_contact_number: string;
  medical_diagnosis: string;
  doctor_id: string;
  remarks: string;
}

export interface DoctorOption {
  id: string;
  name: string;
}

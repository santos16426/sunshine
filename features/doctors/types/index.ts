/** Doctor row from Supabase (public.doctors). */
export interface Doctor {
  id: string;
  name: string;
  contact_information: string;
  hospital_affiliation: string;
  remarks: string | null;
}

/** Form payload for create/update (matches DB columns). */
export interface DoctorFormData {
  name: string;
  contact_information: string;
  hospital_affiliation: string;
  remarks: string;
}

/** Therapist row from Supabase (public.therapists). */
export interface Therapist {
  id: string;
  name: string;
  therapist_type: string;
  contact_number: string;
  calendar_color: string;
}

/** Form payload for create/update (matches DB columns). */
export interface TherapistFormData {
  name: string;
  therapist_type: string;
  contact_number: string;
  calendar_color: string;
}

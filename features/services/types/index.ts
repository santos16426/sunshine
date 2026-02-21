/** Service row from Supabase (public.services). */
export interface Service {
  id: string;
  name: string;
  description: string | null;
  rate_per_hour: number;
  clinic_cut: number;
}

/** Form payload for create/update (matches DB columns). */
export interface ServiceFormData {
  name: string;
  description: string;
  rate_per_hour: number;
  clinic_cut: number;
}

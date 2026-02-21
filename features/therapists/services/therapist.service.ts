import { createClient } from "@/lib/supabase/client";
import type { Therapist, TherapistFormData } from "../types";

function toTherapist(row: {
  id: string;
  name: string;
  therapist_type: string;
  contact_number: string;
  calendar_color: string;
}): Therapist {
  return {
    id: row.id,
    name: row.name,
    therapist_type: row.therapist_type,
    contact_number: row.contact_number,
    calendar_color: row.calendar_color,
  };
}

export async function fetchTherapists(search?: string): Promise<Therapist[]> {
  const supabase = createClient();
  let query = supabase
    .from("therapists")
    .select("id, name, therapist_type, contact_number, calendar_color")
    .order("name", { ascending: true });

  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toTherapist);
}

export async function createTherapist(payload: TherapistFormData): Promise<Therapist> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("therapists")
    .insert({
      name: payload.name,
      therapist_type: payload.therapist_type,
      contact_number: payload.contact_number,
      calendar_color: payload.calendar_color,
    })
    .select("id, name, therapist_type, contact_number, calendar_color")
    .single();

  if (error) throw error;
  return toTherapist(data);
}

export async function updateTherapist(
  id: string,
  payload: TherapistFormData
): Promise<Therapist> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("therapists")
    .update({
      name: payload.name,
      therapist_type: payload.therapist_type,
      contact_number: payload.contact_number,
      calendar_color: payload.calendar_color,
    })
    .eq("id", id)
    .select("id, name, therapist_type, contact_number, calendar_color")
    .single();

  if (error) throw error;
  return toTherapist(data);
}

export async function deleteTherapist(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("therapists").delete().eq("id", id);
  if (error) throw error;
}

export interface TherapyTypeOption {
  code: string;
  label: string;
}

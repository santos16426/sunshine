import { createClient } from "@/lib/supabase/client";
import type { Doctor, DoctorFormData } from "../types";

function toDoctor(row: {
  id: string;
  name: string;
  contact_information: string;
  hospital_affiliation: string;
  remarks: string | null;
}): Doctor {
  return {
    id: row.id,
    name: row.name,
    contact_information: row.contact_information,
    hospital_affiliation: row.hospital_affiliation,
    remarks: row.remarks,
  };
}

export async function fetchDoctors(search?: string): Promise<Doctor[]> {
  const supabase = createClient();
  let query = supabase
    .from("doctors")
    .select("id, name, contact_information, hospital_affiliation, remarks")
    .order("name", { ascending: true });

  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toDoctor);
}

export async function createDoctor(payload: DoctorFormData): Promise<Doctor> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctors")
    .insert({
      name: payload.name,
      contact_information: payload.contact_information,
      hospital_affiliation: payload.hospital_affiliation,
      remarks: payload.remarks || null,
    })
    .select("id, name, contact_information, hospital_affiliation, remarks")
    .single();

  if (error) throw error;
  return toDoctor(data);
}

export async function updateDoctor(
  id: string,
  payload: DoctorFormData
): Promise<Doctor> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctors")
    .update({
      name: payload.name,
      contact_information: payload.contact_information,
      hospital_affiliation: payload.hospital_affiliation,
      remarks: payload.remarks || null,
    })
    .eq("id", id)
    .select("id, name, contact_information, hospital_affiliation, remarks")
    .single();

  if (error) throw error;
  return toDoctor(data);
}

export async function deleteDoctor(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("doctors").delete().eq("id", id);
  if (error) throw error;
}

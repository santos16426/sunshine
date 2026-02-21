import { createClient } from "@/lib/supabase/client";
import type { Patient, PatientFormData, DoctorOption } from "../types";

function toPatient(row: {
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
}): Patient {
  return {
    id: row.id,
    name: row.name,
    date_of_birth: row.date_of_birth,
    age: row.age,
    guardian_name: row.guardian_name,
    guardian_relationship: row.guardian_relationship,
    guardian_contact_number: row.guardian_contact_number,
    medical_diagnosis: row.medical_diagnosis,
    doctor_id: row.doctor_id,
    remarks: row.remarks,
  };
}

export async function fetchPatients(search?: string): Promise<Patient[]> {
  const supabase = createClient();
  let query = supabase
    .from("patients")
    .select("id, name, date_of_birth, age, guardian_name, guardian_relationship, guardian_contact_number, medical_diagnosis, doctor_id, remarks")
    .order("name", { ascending: true });

  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toPatient);
}

export async function fetchPatientsWithDoctors(search?: string): Promise<(Patient & { doctor_name: string })[]> {
  const supabase = createClient();
  let query = supabase
    .from("patients")
    .select(`
      id, name, date_of_birth, age, guardian_name, guardian_relationship, guardian_contact_number, medical_diagnosis, doctor_id, remarks,
      doctors ( name )
    `)
    .order("name", { ascending: true });

  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const { doctors, ...rest } = row;
    const doctorName = doctors && typeof doctors === "object" && "name" in doctors
      ? String((doctors as { name: string }).name)
      : "—";
    const patient = toPatient(rest as Parameters<typeof toPatient>[0]);
    return { ...patient, doctor_name: doctorName };
  });
}

export async function createPatient(payload: PatientFormData): Promise<Patient> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .insert({
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      age: payload.age,
      guardian_name: payload.guardian_name,
      guardian_relationship: payload.guardian_relationship,
      guardian_contact_number: payload.guardian_contact_number,
      medical_diagnosis: payload.medical_diagnosis,
      doctor_id: payload.doctor_id,
      remarks: payload.remarks || null,
    })
    .select("id, name, date_of_birth, age, guardian_name, guardian_relationship, guardian_contact_number, medical_diagnosis, doctor_id, remarks")
    .single();

  if (error) throw error;
  return toPatient(data);
}

export async function updatePatient(id: string, payload: PatientFormData): Promise<Patient> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .update({
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      age: payload.age,
      guardian_name: payload.guardian_name,
      guardian_relationship: payload.guardian_relationship,
      guardian_contact_number: payload.guardian_contact_number,
      medical_diagnosis: payload.medical_diagnosis,
      doctor_id: payload.doctor_id,
      remarks: payload.remarks || null,
    })
    .eq("id", id)
    .select("id, name, date_of_birth, age, guardian_name, guardian_relationship, guardian_contact_number, medical_diagnosis, doctor_id, remarks")
    .single();

  if (error) throw error;
  return toPatient(data);
}

export async function deletePatient(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchDoctors(): Promise<DoctorOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as DoctorOption[];
}

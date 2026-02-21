import { createClient } from "@/lib/supabase/client";
import type { Service, ServiceFormData } from "../types";

function toService(row: {
  id: string;
  name: string;
  description: string | null;
  rate_per_hour: number;
  clinic_cut: number;
}): Service {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    rate_per_hour: Number(row.rate_per_hour),
    clinic_cut: Number(row.clinic_cut),
  };
}

export async function fetchServices(search?: string): Promise<Service[]> {
  const supabase = createClient();
  let query = supabase
    .from("services")
    .select("id, name, description, rate_per_hour, clinic_cut")
    .order("name", { ascending: true });

  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toService);
}

export async function createService(payload: ServiceFormData): Promise<Service> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .insert({
      name: payload.name,
      description: payload.description || null,
      rate_per_hour: payload.rate_per_hour,
      clinic_cut: payload.clinic_cut,
    })
    .select("id, name, description, rate_per_hour, clinic_cut")
    .single();

  if (error) throw error;
  return toService(data);
}

export async function updateService(
  id: string,
  payload: ServiceFormData
): Promise<Service> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .update({
      name: payload.name,
      description: payload.description || null,
      rate_per_hour: payload.rate_per_hour,
      clinic_cut: payload.clinic_cut,
    })
    .eq("id", id)
    .select("id, name, description, rate_per_hour, clinic_cut")
    .single();

  if (error) throw error;
  return toService(data);
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

import { createClient } from "@/lib/supabase/client";
import type { PublicUser } from "../types";

export async function fetchCurrentUser(userId: string): Promise<PublicUser | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name ?? null,
    avatar_url: data.avatar_url ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

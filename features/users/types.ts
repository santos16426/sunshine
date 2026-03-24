import type { AuthRole } from "@/features/auth/types";
export interface PublicUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  role: AuthRole;
}

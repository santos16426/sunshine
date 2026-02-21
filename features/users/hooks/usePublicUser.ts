"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth";
import { fetchCurrentUser } from "../services/user.service";
import type { PublicUser } from "../types";

export function usePublicUser(): {
  profile: PublicUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const authUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!authUser?.id) {
      setProfile(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentUser(authUser.id);
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [authUser?.id]);

  return { profile, isLoading, error, refetch: load };
}

"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "../store/auth.store";

export function AuthSync() {
  const setUser = useAuthStore((s) => s.setUser);
  const initFromSession = useAuthStore((s) => s.initFromSession);

  useEffect(() => {
    initFromSession();
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [initFromSession, setUser]);

  return null;
}

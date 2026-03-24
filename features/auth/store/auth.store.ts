import { create } from 'zustand'
import type { AuthUser, AuthError } from '../types'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: AuthUser | null
  initialized: boolean
  isLoading: boolean
  error: AuthError | null

  setUser: (user: AuthUser | null) => void
  setError: (error: AuthError | null) => void

  logout: () => Promise<void>
  initFromSession: () => Promise<void>
}

function mapSupabaseUserToAuthUser(user: {
  id: string
  email?: string | null
  app_metadata?: Record<string, unknown> | null
  user_metadata?: Record<string, unknown> | null
} | null): AuthUser | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? null,
    app_metadata: user.app_metadata ?? null,
    user_metadata: user.user_metadata ?? null,
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  initialized: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),

  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({
      user: null,
      error: null,
      initialized: true,
    })
  },

  initFromSession: async () => {
    if (get().initialized) return
    set({ isLoading: true })
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    set({
      user: mapSupabaseUserToAuthUser(user),
      initialized: true,
      isLoading: false,
    })
  },
}))

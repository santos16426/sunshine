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
      user: user ?? null,
      initialized: true,
      isLoading: false,
    })
  },
}))

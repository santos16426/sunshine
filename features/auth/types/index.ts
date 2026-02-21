import type { User } from '@supabase/supabase-js'

/** Use Supabase User exactly. */
export type AuthUser = User

/** App roles only. */
export type AuthRole = 'admin' | 'secretary'

export interface AuthError {
  message: string
  field?: string
  status?: number
}

export interface ApiErrorResponse {
  status?: number
  message: string
  field?: string
  raw?: unknown
}

export function isApiError(err: unknown): err is ApiErrorResponse {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as ApiErrorResponse).message === 'string'
  )
}

export function toAuthError(err: unknown, fallbackMessage: string): AuthError {
  if (isApiError(err)) {
    return {
      message: err.message,
      status: err.status,
      field: err.field,
    }
  }
  if (err instanceof Error) {
    return { message: err.message }
  }
  return { message: fallbackMessage }
}

/** Read role from Supabase user (app_metadata or user_metadata). */
export function getAuthRole(user: AuthUser | null): AuthRole | undefined {
  if (!user) return undefined
  const role = (user.app_metadata?.role as string) ?? (user.user_metadata?.role as string)
  if (role === 'admin' || role === 'secretary') return role
  return undefined
}

export type LoginCredentials = { email: string; password: string }

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface AuthMeResponse {
  user: AuthUser
}

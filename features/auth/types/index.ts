export interface AuthUser {
  id: string
  email?: string | null
  app_metadata?: Record<string, unknown> | null
  user_metadata?: Record<string, unknown> | null
}

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

function isAuthRole(value: unknown): value is AuthRole {
  return value === 'admin' || value === 'secretary'
}

/** Read role, preferring value from public.users when provided. */
export function getAuthRole(
  user: AuthUser | null,
  publicUserRole?: unknown
): AuthRole | undefined {
  if (isAuthRole(publicUserRole)) return publicUserRole
  if (!user) return undefined
  const metadataRole = user.app_metadata?.role ?? user.user_metadata?.role
  if (isAuthRole(metadataRole)) return metadataRole
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

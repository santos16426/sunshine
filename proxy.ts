import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_ALLOWED_PREFIXES = [
  '/dashboard',
  '/patients',
  '/therapists',
  '/doctors',
  '/services',
  '/settings',
  '/billing',
  '/scheduling',
] as const

const SECRETARY_ALLOWED_PREFIXES = ['/patients', '/therapists', '/scheduling', '/schedule'] as const

function isAllowedPath(pathname: string, allowedPrefixes: readonly string[]) {
  return allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

async function getPublicUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  const { data } = await supabase.from('users').select('role').eq('id', userId).maybeSingle()
  return data?.role
}

function normalizeRole(value: unknown): 'admin' | 'secretary' {
  if (value === 'secretary') return 'secretary'
  return 'admin'
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/login')

  /** Routes accessible without login. Add more path prefixes here as needed. */
  const UNAUTH_ROUTE_PREFIXES = [
    '/support/help',
    '/support/contact',
    '/legal',
  ] as const
  const isUnauthRoute =
    UNAUTH_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
    )
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    isUnauthRoute

  const isProtectedRoute = !isAuthRoute && !isPublicRoute

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    supabaseResponse.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie.name, cookie.value, { path: '/' })
    )
    return redirectResponse
  }

  if (isAuthRoute && user) {
    const publicUserRole = await getPublicUserRole(supabase, user.id)
    const role = normalizeRole(publicUserRole)
    const defaultPath = role === 'secretary' ? '/scheduling' : '/dashboard'
    const redirectResponse = NextResponse.redirect(new URL(defaultPath, request.url))
    supabaseResponse.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie.name, cookie.value, { path: '/' })
    )
    return redirectResponse
  }

  if (isProtectedRoute && user) {
    const publicUserRole = await getPublicUserRole(supabase, user.id)
    const role = normalizeRole(publicUserRole)
    const allowedPrefixes = role === 'secretary' ? SECRETARY_ALLOWED_PREFIXES : ADMIN_ALLOWED_PREFIXES
    if (!isAllowedPath(pathname, allowedPrefixes)) {
      const fallbackPath = role === 'secretary' ? '/scheduling' : '/dashboard'
      const redirectResponse = NextResponse.redirect(new URL(fallbackPath, request.url))
      supabaseResponse.cookies.getAll().forEach((cookie) =>
        redirectResponse.cookies.set(cookie.name, cookie.value, { path: '/' })
      )
      return redirectResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

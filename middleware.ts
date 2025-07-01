import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { rateLimiters } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  // Rate limiting para APIs
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Rate limit mais restritivo para autenticação
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      const rateLimitResult = rateLimiters.auth(request)
      if (rateLimitResult) return rateLimitResult
    }
    
    // Rate limit para outras APIs
    const rateLimitResult = rateLimiters.api(request)
    if (rateLimitResult) return rateLimitResult
  }

  // Rate limiting para rotas admin (proteção adicional)
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    const rateLimitResult = rateLimiters.api(request)
    if (rateLimitResult) return rateLimitResult
  }

  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    // Redireciona para login se não estiver autenticado
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
} 
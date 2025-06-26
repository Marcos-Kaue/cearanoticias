import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from './lib/supabase-ssr'

// Rotas protegidas
const protectedPaths = ['/admin']

export async function middleware(request: NextRequest) {
  // Verifica se a rota é protegida
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  if (!isProtected) return NextResponse.next()

  // Cria o client SSR do Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return request.cookies
            ? Object.entries(request.cookies).map(([name, cookie]) => ({
                name,
                value: cookie.value,
              }))
            : []
        },
        setAll: () => {}, // No middleware, não precisa setar cookies
      },
    }
  )

  // Tenta obter o usuário autenticado
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redireciona para login se não autenticado
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado, permite acesso
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
} 
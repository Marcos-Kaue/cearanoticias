import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas protegidas
const protectedPaths = ['/admin']

export function middleware(request: NextRequest) {
  // Verifica se a rota é protegida
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  if (!isProtected) return NextResponse.next()

  // Verifica se existe o cookie de autenticação do Supabase
  const supabaseAuthToken = request.cookies.get('sb-access-token')

  if (!supabaseAuthToken) {
    // Redireciona para /login se não estiver autenticado
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
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-ssr'

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Tokens não fornecidos' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })

    const supabase = createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              response.cookies.set({ name, value, ...options })
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (error) {
      console.error("Erro ao setar sessão Supabase:", error)
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }

    return response
  } catch (e) {
    console.error("Erro no /api/auth/callback:", e)
    return NextResponse.json({ error: (e && typeof e === 'object' && 'message' in e) ? e.message : String(e) || 'Erro interno no servidor' }, { status: 500 })
  }
} 
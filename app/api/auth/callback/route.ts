import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase-ssr'

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Tokens não fornecidos' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          set: (name, value, options) => {
            response.cookies.set({ name, value, ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return response
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
} 
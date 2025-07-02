import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-ssr'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'

// GET - Listar patrocinadores
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    const { searchParams } = new URL(request.url)
    const ativo = searchParams.get('ativo')
    
    let query = supabase
      .from('patrocinadores')
      .select('*')
      .order('ordem_exibicao', { ascending: true })
    
    if (ativo !== null) {
      query = query.eq('ativo', ativo === 'true')
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
    return response
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar patrocinadores' }, { status: 500 })
  }
}

// POST - Criar novo patrocinador
export const POST = withRateLimit(async (request: NextRequest) => {
  const supabase = await createSupabaseServerClient()
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('patrocinadores')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    
    return NextResponse.json(data[0])
  } catch {
    return NextResponse.json({ error: 'Erro ao criar patrocinador' }, { status: 500 })
  }
}, rateLimiters.create) 
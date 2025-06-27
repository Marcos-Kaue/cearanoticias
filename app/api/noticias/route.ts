import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() as any }
  )
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'publicado' // padrão: publicado
    const categoria = searchParams.get('categoria')
    
    let query = supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status && status !== 'todos') {
      query = query.eq('status', status)
    } else if (status === 'todos') {
      query = query.neq('status', 'arquivado')
    }
    
    if (categoria) {
      query = query.eq('categoria', categoria)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro detalhado ao buscar notícias:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    return NextResponse.json({ error: 'Erro ao buscar notícias', detalhe: String(error) }, { status: 500 })
  }
}

// POST - Criar nova notícia
export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() as any }
  )
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('noticias')
      .insert([{
        ...body,
        visualizacoes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
    
    if (error) throw error
    
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Erro detalhado ao criar notícia:', error)
    return NextResponse.json({ error: 'Erro ao criar notícia', detalhe: String(error) }, { status: 500 })
  }
} 
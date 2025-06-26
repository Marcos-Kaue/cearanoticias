import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const categoria = searchParams.get('categoria')
    
    let query = supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status && status !== 'todos') {
      query = query.eq('status', status)
    }
    
    if (categoria) {
      query = query.eq('categoria', categoria)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar notícias' }, { status: 500 })
  }
}

// POST - Criar nova notícia
export async function POST(request: NextRequest) {
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
    return NextResponse.json({ error: 'Erro ao criar notícia' }, { status: 500 })
  }
} 
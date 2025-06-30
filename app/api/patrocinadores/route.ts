import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Listar patrocinadores
export async function GET(request: NextRequest) {
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
    
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar patrocinadores' }, { status: 500 })
  }
}

// POST - Criar novo patrocinador
export async function POST(request: NextRequest) {
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
} 
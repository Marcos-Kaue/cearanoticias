import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Listar anúncios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ativo = searchParams.get('ativo')
    const posicao = searchParams.get('posicao')
    
    let query = supabase
      .from('anuncios')
      .select('*')
      .order('ordem_exibicao', { ascending: true })
    
    if (ativo !== null) {
      query = query.eq('ativo', ativo === 'true')
    }
    if (posicao !== null) {
      query = query.eq('posicao', posicao)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar anúncios' }, { status: 500 })
  }
}

// POST - Criar novo anúncio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('anuncios')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    
    return NextResponse.json(data[0])
  } catch (error) {
    // Melhor tratamento de erro
    let errorObj: any = {
      message: 'Erro desconhecido',
      raw: error
    };
    if (error && typeof error === 'object') {
      errorObj = {
        message: (error as any).message || 'Erro desconhecido',
        details: (error as any).details,
        code: (error as any).code,
        hint: (error as any).hint,
        raw: error
      };
    } else if (typeof error === 'string') {
      errorObj = { message: error };
    }
    console.error('Erro ao criar anúncio:', errorObj);
    return NextResponse.json({ error: errorObj }, { status: 500 });
  }
} 
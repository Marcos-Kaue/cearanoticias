import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-ssr'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'publicado' // padrão: publicado
    const categoria = searchParams.get('categoria')
    
    console.log('API Notícias - Parâmetros:', { status, categoria })
    
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
    
    if (error) {
      console.error('Erro Supabase:', error)
      throw error
    }
    
    console.log(`API Notícias - Encontradas ${data?.length || 0} notícias`)
    
    // Adicionar headers para evitar cache
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Erro detalhado ao buscar notícias:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    return NextResponse.json({ error: 'Erro ao buscar notícias', detalhe: String(error) }, { status: 500 })
  }
}

// POST - Criar nova notícia
export const POST = withRateLimit(async (request: NextRequest) => {
  const supabase = await createSupabaseServerClient()
  try {
    const body = await request.json()
    
    console.log('API Notícias - Criando nova notícia:', { titulo: body.titulo, status: body.status })
    
    const { data, error } = await supabase
      .from('noticias')
      .insert([{
        ...body,
        visualizacoes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
    
    if (error) {
      console.error('Erro Supabase ao criar notícia:', error)
      throw error
    }
    
    console.log('API Notícias - Notícia criada com sucesso:', data[0]?.id)
    
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Erro detalhado ao criar notícia:', error)
    return NextResponse.json({ error: 'Erro ao criar notícia', detalhe: String(error) }, { status: 500 })
  }
}, rateLimiters.create) 
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-ssr'

// GET - Buscar notícia por ID
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    // Extrair o id da URL
    const id = request.url.split('/').pop()
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 })
  }
}

// PUT - Atualizar notícia
export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    // Extrair o id da URL
    const id = request.url.split('/').pop()
    const body = await request.json()

    const { data, error } = await supabase
      .from('noticias')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar notícia' }, { status: 500 })
  }
}

// DELETE - Deletar notícia
export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    // Extrair o id da URL
    const id = request.url.split('/').pop() || ''
    if (!id) {
      console.error('ID não fornecido na URL:', request.url)
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }
    // Tente converter para número, se aplicável
    const idNum = Number(id)
    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', isNaN(idNum) ? id : idNum)
    
    if (error) {
      console.error('Erro ao deletar notícia:', error)
      throw error
    }
    
    return NextResponse.json({ message: 'Notícia deletada com sucesso' })
  } catch (err) {
    console.error('Erro inesperado ao deletar notícia:', err)
    return NextResponse.json({ error: 'Erro ao deletar notícia' }, { status: 500 })
  }
}

// PATCH - Incrementar visualizações
export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    // Extrair o id da URL
    const id = request.url.split('/').pop()
    
    // Buscar a notícia atual para pegar o número de visualizações
    const { data: noticia, error: fetchError } = await supabase
      .from('noticias')
      .select('visualizacoes')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Incrementar visualizações
    const novasVisualizacoes = (noticia.visualizacoes || 0) + 1
    
    const { data, error } = await supabase
      .from('noticias')
      .update({ 
        visualizacoes: novasVisualizacoes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, visualizacoes: novasVisualizacoes })
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
    return NextResponse.json({ error: 'Erro ao atualizar visualizações' }, { status: 500 })
  }
} 
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
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient()
  try {
    const { id } = await params
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient()
  try {
    const { id } = await params
    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ message: 'Notícia deletada com sucesso' })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar notícia' }, { status: 500 })
  }
} 
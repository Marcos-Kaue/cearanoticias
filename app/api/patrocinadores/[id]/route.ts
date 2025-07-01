import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-ssr'

// GET - Buscar patrocinador por ID
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    const id = request.url.split('/').pop()
    const { data, error } = await supabase
      .from('patrocinadores')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar patrocinador' }, { status: 500 })
  }
}

// PUT - Atualizar patrocinador
export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    const id = request.url.split('/').pop()
    const body = await request.json()
    const { data, error } = await supabase
      .from('patrocinadores')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    if (error) throw error
    return NextResponse.json(data[0])
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar patrocinador' }, { status: 500 })
  }
}

// DELETE - Deletar patrocinador
export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  try {
    const id = request.url.split('/').pop()
    const { error } = await supabase
      .from('patrocinadores')
      .delete()
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'Patrocinador deletado com sucesso' })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar patrocinador' }, { status: 500 })
  }
} 
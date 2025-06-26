import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const nome = formData.get('nome') as string
    const telefone = formData.get('telefone') as string
    const titulo = formData.get('titulo') as string
    const texto = formData.get('texto') as string
    // Imagem pode ser tratada depois

    const { data, error } = await supabase
      .from('noticias_enviadas')
      .insert([{ nome, telefone, titulo, texto, status: 'pendente', created_at: new Date().toISOString() }])
      .select()

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao receber notícia' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('noticias_enviadas')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar notícias enviadas' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
    const { error } = await supabase
      .from('noticias_enviadas')
      .delete()
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover notícia enviada' }, { status: 500 })
  }
} 
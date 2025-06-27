import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const nome = formData.get('nome') as string
    const telefone = formData.get('telefone') as string
    const titulo = formData.get('titulo') as string
    const texto = formData.get('texto') as string
    const imagem = formData.get('imagem') as File | null
    let imagem_url = ''

    // Upload da imagem, se existir
    if (imagem && imagem.size > 0) {
      const fileExt = imagem.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      console.log('Tentando upload:', fileName, imagem?.type, imagem?.size)
      // @ts-ignore
      const { data: uploadData, error: uploadError } = await supabase.storage.from('imagenspublicas').upload(fileName, imagem)
      if (uploadError) {
        console.error('Erro detalhado do upload:', uploadError)
        return NextResponse.json({ error: 'Erro ao fazer upload da imagem', detalhe: uploadError.message }, { status: 500 })
      }
      // Gerar URL pública
      // @ts-ignore
      const { data: publicUrlData } = supabase.storage.from('imagenspublicas').getPublicUrl(fileName)
      imagem_url = publicUrlData?.publicUrl || ''
    }

    const { data, error } = await supabase
      .from('noticias_enviadas')
      .insert([{ nome, telefone, titulo, texto, imagem_url, status: 'pendente', created_at: new Date().toISOString() }])
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
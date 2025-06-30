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

    console.log('Recebendo notícia:', { nome, telefone, titulo, texto: texto.substring(0, 50) + '...' })

    // Upload da imagem, se existir
    if (imagem && imagem.size > 0) {
      try {
        const fileExt = imagem.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        console.log('Tentando upload:', fileName, imagem?.type, imagem?.size)
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('imagenspublicas')
          .upload(fileName, imagem)
        
        if (uploadError) {
          console.error('Erro detalhado do upload:', uploadError)
          return NextResponse.json({ 
            error: 'Erro ao fazer upload da imagem', 
            detalhe: uploadError.message
          }, { status: 500 })
        }
        
        // Gerar URL pública
        const { data: publicUrlData } = supabase.storage
          .from('imagenspublicas')
          .getPublicUrl(fileName)
        
        imagem_url = publicUrlData?.publicUrl || ''
        console.log('Upload bem-sucedido:', imagem_url)
      } catch (uploadErr) {
        console.error('Erro inesperado no upload:', uploadErr)
        return NextResponse.json({ 
          error: 'Erro inesperado no upload da imagem',
          detalhe: uploadErr instanceof Error ? uploadErr.message : 'Erro desconhecido'
        }, { status: 500 })
      }
    }

    // Inserir na tabela
    console.log('Inserindo na tabela noticias_enviadas...')
    const { data, error } = await supabase
      .from('noticias_enviadas')
      .insert([{ 
        nome, 
        telefone, 
        titulo, 
        texto, 
        imagem_url, 
        status: 'pendente', 
        created_at: new Date().toISOString() 
      }])
      .select()

    if (error) {
      console.error('Erro ao inserir na tabela:', error)
      return NextResponse.json({ 
        error: 'Erro ao salvar notícia no banco', 
        detalhe: error.message
      }, { status: 500 })
    }

    console.log('Notícia enviada com sucesso:', data)
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    console.error('Erro geral na API:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      detalhe: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
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
  } catch {
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
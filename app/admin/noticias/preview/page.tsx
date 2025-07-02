"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

interface NoticiaPreview {
  titulo?: string;
  resumo?: string;
  conteudo?: string;
  categoria?: string;
  imagem_url?: string;
  status?: string;
  autor?: string;
}

export default function PreviewNoticiaAdmin() {
  const [noticia, setNoticia] = useState<NoticiaPreview | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPreview = () => {
    setLoading(true)
    try {
      // Lê os dados do formulário do localStorage
      const data = typeof window !== 'undefined' ? localStorage.getItem("noticia-preview") : null
      if (data) {
        const parsedData = JSON.parse(data)
        console.log('Dados da prévia carregados:', parsedData)
        setNoticia(parsedData)
      } else {
        console.log('Nenhum dado de prévia encontrado no localStorage')
        setNoticia(null)
      }
    } catch (error) {
      console.error('Erro ao carregar prévia:', error)
      setNoticia(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPreview()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-lg">Carregando prévia...</span>
        </div>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Prévia da Notícia</h1>
        <p className="mb-4">Clique em <b>Visualizar</b> no formulário de edição/criação para atualizar esta prévia.</p>
        <p className="text-gray-500 mb-6">Nenhuma notícia carregada ainda.</p>
        
        <div className="space-y-4">
          <Button onClick={loadPreview} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/admin/noticias/nova">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Formulário
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header com botões */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Prévia da Notícia</h1>
          <div className="flex gap-2">
            <Button onClick={loadPreview} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/noticias/nova">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>

        {/* Conteúdo da prévia */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <header className="p-6 border-b">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">
                {noticia.categoria || 'Sem categoria'}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-semibold rounded">
                Prévia
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              {noticia.titulo || 'Título não definido'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {noticia.resumo || 'Resumo não definido'}
            </p>
          </header>

          {noticia.imagem_url && (
            <div className="p-6 pt-0">
              <Image
                src={noticia.imagem_url || "/placeholder.svg"}
                alt={noticia.titulo || "Imagem da notícia"}
                width={800}
                height={400}
                style={{ width: 800, height: 'auto' }}
                className="w-full h-auto object-cover rounded-lg"
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </div>
          )}

          <article className="p-6 pt-0">
            <div className="prose prose-lg max-w-none">
              {noticia.conteudo ? (
                noticia.conteudo.split("\n\n").map((paragrafo: string, idx: number) => (
                  <p key={idx} className="text-gray-800 leading-relaxed mb-6 text-justify">
                    {paragrafo}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">Conteúdo não definido</p>
              )}
            </div>
          </article>

          {/* Informações da prévia */}
          <div className="p-6 pt-0 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              <p><strong>Status:</strong> {noticia.status || 'Não definido'}</p>
              <p><strong>Autor:</strong> {noticia.autor || 'Não definido'}</p>
              <p><strong>Data de criação:</strong> {new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
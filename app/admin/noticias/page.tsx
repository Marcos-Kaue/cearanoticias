"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Noticia } from "@/lib/supabase"

// Componente separado para formatar data
function DataFormatada({ dateStr }: { dateStr: string | null | undefined }) {
  const [data, setData] = useState('')
  
  useEffect(() => {
    if (dateStr) {
      setData(new Date(dateStr).toLocaleDateString('pt-BR'))
    }
  }, [dateStr])
  
  return <span>{data || 'Data não disponível'}</span>
}

export default function AdminNoticias() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar notícias
  const loadNoticias = async (status = filterStatus) => {
    setLoading(true)
    try {
      let statusParam = ''
      if (status === 'Todos') statusParam = 'todos'
      else if (status === 'Publicado') statusParam = 'publicado'
      else if (status === 'Rascunho') statusParam = 'rascunho'
      else if (status === 'Arquivado') statusParam = 'arquivado'
      const response = await fetch(`/api/noticias?status=${statusParam}`)
      if (response.ok) {
        const data = await response.json()
        setNoticias(data)
      }
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNoticias(filterStatus)
  }, [filterStatus])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) return
    
    try {
      const response = await fetch(`/api/noticias/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar notícia')
      }

      await loadNoticias() // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar notícia:', error)
      alert('Erro ao deletar notícia. Tente novamente.')
    }
  }

  const filteredNoticias = noticias.filter((noticia) => {
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "Todos" || 
      (filterStatus === "Publicado" && noticia.status === "publicado") ||
      (filterStatus === "Rascunho" && noticia.status === "rascunho") ||
      (filterStatus === "Arquivado" && noticia.status === "arquivado")
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 px-4 md:px-6 w-full max-w-full overflow-x-auto md:overflow-x-visible">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gerenciar Notícias</h1>
          <p className="text-gray-600">Crie, edite e publique suas notícias</p>
        </div>
      </div>
      <div className="flex justify-center my-6">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/noticias/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Notícia
          </Link>
        </Button>
      </div>
      {/* Filtros */}
      <Card className="px-2 md:px-4">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[
                "Todos",
                "Publicado",
                "Rascunho",
                "Arquivado"
              ].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Lista de notícias */}
      <Card className="px-2 md:px-4">
        <CardHeader>
          <CardTitle>Suas Notícias ({filteredNoticias.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando notícias...</p>
            </div>
          ) : noticias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma notícia cadastrada ainda.</p>
              <Button asChild className="mt-4 w-full sm:w-auto">
                <Link href="/admin/noticias/nova">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Notícia
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNoticias.map((noticia) => (
                <div key={noticia.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 w-full max-w-full text-center sm:text-left">
                  <div style={{ minWidth: 80, minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    src={noticia.imagem_url || "/placeholder.svg"}
                    alt={noticia.titulo}
                      width={80}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                      className="flex-shrink-0"
                  />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{noticia.categoria}</Badge>
                      <Badge variant={noticia.status === "publicado" ? "default" : "secondary"}>{noticia.status}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{noticia.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2 break-words">{noticia.resumo}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Por {noticia.autor}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <DataFormatada dateStr={noticia.created_at} />
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {noticia.visualizacoes} visualizações
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 justify-center sm:justify-start">
                    <Button variant="outline" size="sm" asChild aria-label="Visualizar notícia">
                      <Link href={`/noticia/${noticia.id}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild aria-label="Editar notícia">
                      <Link href={`/admin/noticias/editar/${noticia.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(noticia.id || 0)} aria-label="Deletar notícia">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

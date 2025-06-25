"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Eye, TrendingUp, Calendar } from "lucide-react"
import DebugPanel from "@/components/debug-panel"
import { Noticia, Patrocinador } from "@/lib/supabase"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNoticias: 0,
    noticiasHoje: 0,
    visualizacoes: 0,
    patrocinadores: 0,
    crescimentoMensal: 0,
    noticiasPublicadas: 0,
  })
  const [recentNews, setRecentNews] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Buscar todas as notícias
        const noticiasRes = await fetch("/api/noticias")
        const noticias: Noticia[] = noticiasRes.ok ? await noticiasRes.json() : []

        // Buscar patrocinadores
        const patrocinadoresRes = await fetch("/api/patrocinadores")
        const patrocinadores: Patrocinador[] = patrocinadoresRes.ok ? await patrocinadoresRes.json() : []

        // Estatísticas
        const hoje = new Date().toISOString().slice(0, 10)
        const totalNoticias = noticias.length
        const noticiasHoje = noticias.filter(n => n.created_at && n.created_at.slice(0, 10) === hoje).length
        const noticiasPublicadas = noticias.filter(n => n.status === "publicado").length
        const visualizacoes = noticias.reduce((acc, n) => acc + (n.visualizacoes || 0), 0)
        // Crescimento mensal fictício (poderia ser calculado de verdade)
        const crescimentoMensal = 0
        const totalPatrocinadores = patrocinadores.length

        // Últimas 3 notícias
        const recent = noticias.slice(0, 3)

        setStats({
          totalNoticias,
          noticiasHoje,
          visualizacoes,
          patrocinadores: totalPatrocinadores,
          crescimentoMensal,
          noticiasPublicadas,
        })
        setRecentNews(recent)
      } catch (e) {
        // Em caso de erro, zera tudo
        setStats({
          totalNoticias: 0,
          noticiasHoje: 0,
          visualizacoes: 0,
          patrocinadores: 0,
          crescimentoMensal: 0,
          noticiasPublicadas: 0,
        })
        setRecentNews([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu portal de notícias</p>
      </div>

      {/* Painel de Debug */}
      <DebugPanel />

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNoticias}</div>
            <p className="text-xs text-muted-foreground">+{stats.noticiasHoje} hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visualizacoes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrocinadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patrocinadores}</div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.noticiasPublicadas}</div>
            <p className="text-xs text-muted-foreground">Notícias publicadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Notícias recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Notícias Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando...</p>
            </div>
          ) : recentNews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma notícia encontrada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentNews.map((noticia) => (
                <div key={noticia.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{noticia.titulo}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {noticia.created_at ? new Date(noticia.created_at).toLocaleDateString("pt-BR") : "Data não disponível"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {noticia.visualizacoes || 0} visualizações
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        noticia.status === "publicado"
                          ? "bg-green-100 text-green-800"
                          : noticia.status === "rascunho"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {noticia.status}
                    </span>
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

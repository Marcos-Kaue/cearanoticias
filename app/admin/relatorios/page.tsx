"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { addDays, startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns"

// Função utilitária para agrupar visualizações por mês
function getVisualizacoesPorMes(noticias: any[]) {
  const meses: { [key: string]: number } = {}
  noticias.forEach(n => {
    if (!n.created_at) return
    const data = new Date(n.created_at)
    const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
    meses[mes] = (meses[mes] || 0) + (n.visualizacoes || 0)
  })
  // Ordenar por mês
  return Object.entries(meses).sort(([a], [b]) => a.localeCompare(b))
}

type Periodo = "tudo" | "dia" | "semana" | "mes"

export default function AdminRelatorios() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [patrocinadores, setPatrocinadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<Periodo>("tudo")
  const [visualizacoesPorMes, setVisualizacoesPorMes] = useState<any[]>([])
  const [rankingMaisLidas, setRankingMaisLidas] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const noticiasRes = await fetch("/api/noticias")
        const noticiasData = noticiasRes.ok ? await noticiasRes.json() : []
        const patrocinadoresRes = await fetch("/api/patrocinadores")
        const patrocinadoresData = patrocinadoresRes.ok ? await patrocinadoresRes.json() : []
        setNoticias(noticiasData)
        setPatrocinadores(patrocinadoresData)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calcular visualizações por mês e ranking no client para evitar hydration mismatch
  useEffect(() => {
    // Filtro por período
    const agora = new Date()
    let dataLimite: Date | null = null
    if (periodo === "dia") dataLimite = startOfDay(agora)
    if (periodo === "semana") dataLimite = startOfWeek(agora, { weekStartsOn: 1 })
    if (periodo === "mes") dataLimite = startOfMonth(agora)
    const noticiasFiltradas = dataLimite
      ? noticias.filter(n => n.created_at && isAfter(new Date(n.created_at), dataLimite!))
      : noticias
    setVisualizacoesPorMes(getVisualizacoesPorMes(noticiasFiltradas))
    setRankingMaisLidas(
      [...noticiasFiltradas]
        .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
        .slice(0, 5)
    )
  }, [noticias, periodo])

  // Resumos
  const totalNoticias = noticias.length
  const totalVisualizacoes = noticias.reduce((acc, n) => acc + (n.visualizacoes || 0), 0)
  const totalPatrocinadores = patrocinadores.length
  const totalNoticiasPublicadas = noticias.filter(n => n.status === "publicado").length
  const totalNoticiasRascunho = noticias.filter(n => n.status === "rascunho").length
  const totalNoticiasArquivadas = noticias.filter(n => n.status === "arquivado").length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatórios</h1>
      {loading ? (
        <p className="text-gray-600">Carregando dados...</p>
      ) : (
        <>
          {/* Filtros por período */}
          <div className="flex gap-2 mb-4">
            {[
              { label: "Tudo", value: "tudo" },
              { label: "Hoje", value: "dia" },
              { label: "Esta Semana", value: "semana" },
              { label: "Este Mês", value: "mes" },
            ].map(opt => (
              <button
                key={opt.value}
                className={`px-3 py-1 rounded font-medium border transition-colors ${periodo === opt.value ? "bg-red-600 text-white border-red-600" : "bg-white text-red-600 border-red-300 hover:bg-red-50"}`}
                onClick={() => setPeriodo(opt.value as Periodo)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total de Notícias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNoticias}</div>
                <p className="text-xs text-gray-500">Publicadas: {totalNoticiasPublicadas} | Rascunhos: {totalNoticiasRascunho} | Arquivadas: {totalNoticiasArquivadas}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Visualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVisualizacoes.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Total acumulado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patrocinadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPatrocinadores}</div>
                <p className="text-xs text-gray-500">Ativos no sistema</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de visualizações por mês */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Visualizações por Mês</h2>
            <div className="flex items-end gap-2 h-40">
              {visualizacoesPorMes.map(([mes, total]) => (
                <div key={mes} className="flex flex-col items-center justify-end h-full">
                  <div
                    className="bg-red-500 rounded-t w-8 transition-all"
                    style={{ height: `${Math.max(10, (total / (Math.max(...visualizacoesPorMes.map(([, t]) => t)) || 1)) * 100)}%` }}
                    title={`${total} visualizações`}
                  />
                  <span className="text-xs mt-1 text-gray-700">{mes}</span>
                  <span className="text-xs text-gray-500">{total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking das mais lidas */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Notícias Mais Lidas</h2>
            <ol className="space-y-3">
              {rankingMaisLidas.map((noticia, idx) => (
                <li key={noticia.id} className="flex items-center gap-3 bg-gray-50 rounded p-3 hover:bg-gray-100 transition">
                  <span className="text-lg font-bold text-red-600 w-6 text-center">{idx + 1}</span>
                  <Link href={`/noticia/${noticia.id}`} className="flex-1 font-medium text-gray-900 hover:text-red-700 transition-colors">
                    {noticia.titulo}
                  </Link>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{noticia.visualizacoes || 0} visualizações</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  )
} 
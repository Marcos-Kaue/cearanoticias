"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns"
import { Patrocinador } from "@/lib/types"

interface Noticia {
  id: number;
  titulo: string;
  resumo: string;
  imagem_url: string | null;
  created_at: string;
  categoria: string;
  visualizacoes?: number;
  status?: string;
}

type Periodo = "tudo" | "dia" | "semana" | "mes"

// Função para formatar números grandes
function NumeroFormatado({ valor }: { valor: number }) {
  if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1)}M`
  } else if (valor >= 1000) {
    return `${(valor / 1000).toFixed(1)}K`
  }
  return valor.toString()
}

function getVisualizacoesPorMes(noticias: Noticia[]): [string, number][] {
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

export default function AdminRelatorios() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<Periodo>("tudo")
  const [visualizacoesPorMes, setVisualizacoesPorMes] = useState<[string, number][]>([])
  const [rankingMaisLidas, setRankingMaisLidas] = useState<Noticia[]>([])

  // Mapear label do período
  const labelPeriodo = {
    tudo: '',
    dia: ' (Hoje)',
    semana: ' (Esta Semana)',
    mes: ' (Este Mês)'
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="text-2xl font-bold"><NumeroFormatado valor={totalVisualizacoes} /></div>
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
            <h2 className="text-xl font-bold mb-4 text-gray-900">Visualizações por Mês{labelPeriodo[periodo]}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[340px] w-full border rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-gray-700">Mês</th>
                    <th className="px-4 py-2 text-right font-bold text-gray-700">Visualizações</th>
                  </tr>
                </thead>
                <tbody>
                  {visualizacoesPorMes.map(([mes, total], idx) => (
                    <tr key={mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-gray-800">{mes}</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-gray-900">{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ranking das mais lidas */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Notícias Mais Lidas{labelPeriodo[periodo]}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[340px] w-full border rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-gray-700">#</th>
                    <th className="px-4 py-2 text-left font-bold text-gray-700">Título</th>
                    <th className="px-4 py-2 text-right font-bold text-gray-700">Visualizações</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingMaisLidas.slice(0, 3).map((noticia, idx) => (
                    <tr key={noticia.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-red-600 font-bold text-center">{idx + 1}</td>
                      <td className="px-4 py-2">
                        <Link href={`/noticia/${noticia.id}`} className="font-medium text-gray-900 hover:text-red-700 transition-colors">
                          {noticia.titulo}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-gray-900">{noticia.visualizacoes || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 
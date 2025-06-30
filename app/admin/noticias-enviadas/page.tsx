"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface NoticiaEnviada {
  id: number
  nome: string
  telefone: string
  titulo: string
  texto: string
  status: string
  created_at: string
  imagem_url?: string
}

export default function AdminNoticiasEnviadas() {
  const [noticias, setNoticias] = useState<NoticiaEnviada[]>([])
  const [loading, setLoading] = useState(true)
  const [enviandoId, setEnviandoId] = useState<number | null>(null)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await fetch("/api/noticias-enviadas")
        if (!res.ok) throw new Error("Erro ao buscar notícias enviadas")
        const data = await res.json()
        setNoticias(data)
      } catch {
        setNoticias([])
      } finally {
        setLoading(false)
      }
    }
    fetchNoticias()
  }, [])

  async function salvarComoRascunho(n: NoticiaEnviada) {
    setEnviandoId(n.id)
    setMsg("")
    try {
      const res = await fetch("/api/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: n.titulo,
          resumo: n.texto.slice(0, 200),
          conteudo: n.texto,
          categoria: "Geral",
          imagem_url: n.imagem_url || "",
          status: "rascunho",
          autor: n.nome,
        })
      })
      if (!res.ok) throw new Error("Erro ao salvar como rascunho")
      await fetch(`/api/noticias-enviadas?id=${n.id}`, { method: "DELETE" })
      setNoticias((prev) => prev.filter((item) => item.id !== n.id))
      setMsg("Notícia salva como rascunho! Edite e publique em 'Notícias'.")
      // router.push("/admin/noticias") // opcional: redirecionar
    } catch {
      setMsg("Erro ao salvar como rascunho.")
    } finally {
      setEnviandoId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Notícias Enviadas pelo Público</h1>
      {msg && <div className="mb-4 text-center font-medium text-green-700">{msg}</div>}
      {loading ? (
        <div>Carregando...</div>
      ) : noticias.length === 0 ? (
        <div className="text-gray-500">Nenhuma notícia enviada ainda.</div>
      ) : (
        <div className="space-y-6">
          {noticias.map((n) => (
            <div key={n.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="font-bold text-lg text-gray-900">{n.titulo}</span>
                <span className="text-xs text-gray-500">Enviada em {new Date(n.created_at).toLocaleString("pt-BR")}</span>
              </div>
              {n.imagem_url && (
                <Image
                  src={n.imagem_url}
                  alt={n.titulo}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg border mb-2"
                />
              )}
              <div className="mb-2 text-gray-700 whitespace-pre-line">{n.texto}</div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 gap-2">
                <span>Por: {n.nome} ({n.telefone})</span>
                <span>Status: <span className="font-semibold text-red-600">{n.status}</span></span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1 rounded disabled:opacity-60"
                  onClick={() => salvarComoRascunho(n)}
                  disabled={enviandoId === n.id}
                >
                  {enviandoId === n.id ? "Salvando..." : "Salvar como rascunho"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
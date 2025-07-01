import { useState, useEffect, useCallback } from "react"
import { Noticia } from "@/lib/types"

export function useNoticias(status: string = "Todos") {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNoticias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const statusParam = status === "Todos" ? "todos" : status.toLowerCase();
      const res = await fetch(`/api/noticias?status=${statusParam}`)
      if (!res.ok) throw new Error("Erro ao buscar notícias")
      const data = await res.json()
      setNoticias(data)
    } catch (err: any) {
      setNoticias([])
      setError(err?.message || "Erro ao buscar notícias")
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    loadNoticias()
  }, [loadNoticias])

  return { noticias, loading, error, reloadNoticias: loadNoticias }
} 
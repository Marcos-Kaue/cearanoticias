import { useState, useEffect, useCallback } from "react"

export interface Categoria {
  id: number
  nome: string
  slug: string
  descricao?: string
  cor?: string
  ativo: boolean
  created_at?: string
}

export function useCategorias(ativo: boolean = true) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategorias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/categorias?ativo=${ativo}`)
      if (!res.ok) throw new Error("Erro ao buscar categorias")
      const data = await res.json()
      setCategorias(data)
    } catch (err: any) {
      setCategorias([])
      setError(err?.message || "Erro ao buscar categorias")
    } finally {
      setLoading(false)
    }
  }, [ativo])

  useEffect(() => {
    loadCategorias()
  }, [loadCategorias])

  return { categorias, loading, error, reloadCategorias: loadCategorias }
} 
import { useState, useEffect, useCallback } from "react"
import { Patrocinador } from "@/lib/types"

export function usePatrocinadores(ativo: boolean = true) {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPatrocinadores = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/patrocinadores?ativo=${ativo}`)
      if (!res.ok) throw new Error("Erro ao buscar patrocinadores")
      const data = await res.json()
      setPatrocinadores(data)
    } catch (err: any) {
      setPatrocinadores([])
      setError(err?.message || "Erro ao buscar patrocinadores")
    } finally {
      setLoading(false)
    }
  }, [ativo])

  useEffect(() => {
    loadPatrocinadores()
  }, [loadPatrocinadores])

  return { patrocinadores, loading, error, reloadPatrocinadores: loadPatrocinadores }
} 
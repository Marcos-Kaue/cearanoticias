"use client"

import { useEffect, useRef } from 'react'

interface VisualizacaoTrackerProps {
  noticiaId: string
}

export default function VisualizacaoTracker({ noticiaId }: VisualizacaoTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Evitar contagem duplicada em desenvolvimento
    if (hasTracked.current) return
    
    // Aguardar um pouco para garantir que a página carregou
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/noticias/${noticiaId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          hasTracked.current = true
          console.log('Visualização registrada para notícia:', noticiaId)
        }
      } catch (error) {
        console.error('Erro ao registrar visualização:', error)
      }
    }, 2000) // Aguardar 2 segundos

    return () => clearTimeout(timer)
  }, [noticiaId])

  // Componente invisível - não renderiza nada
  return null
} 
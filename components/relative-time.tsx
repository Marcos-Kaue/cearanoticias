"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface RelativeTimeProps {
  dateString: string
  className?: string
}

export function RelativeTime({ dateString, className }: RelativeTimeProps) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    // Retorna null na primeira renderização para garantir que o servidor e o cliente correspondam
    return null
  }

  const relativeTime = formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ptBR,
  })

  return <span className={className}>{relativeTime}</span>
} 
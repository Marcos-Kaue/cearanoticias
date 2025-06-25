"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Patrocinador } from "@/lib/supabase"

export default function Footer() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Carregar patrocinadores ativos
  const loadPatrocinadores = async () => {
    try {
      const response = await fetch('/api/patrocinadores?ativo=true')
      if (response.ok) {
        const data = await response.json()
        setPatrocinadores(data)
      }
    } catch (error) {
      console.error('Erro ao carregar patrocinadores:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatrocinadores()
  }, [])

  useEffect(() => {
    if (patrocinadores.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 3 >= patrocinadores.length ? 0 : prevIndex + 3))
    }, 4000)

    return () => clearInterval(interval)
  }, [patrocinadores.length])

  const visibleSponsors = patrocinadores.slice(currentIndex, currentIndex + 3)
  if (visibleSponsors.length < 3 && patrocinadores.length > 0) {
    visibleSponsors.push(...patrocinadores.slice(0, 3 - visibleSponsors.length))
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white text-gray-900 shadow-lg z-40 border-t border-gray-200">
      <div className="container mx-auto px-2 py-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          {/* Informações do site */}
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm font-medium text-gray-900">Ceará No Grau</p>
            <p className="text-xs text-gray-600 hidden md:block">Portal de notícias do Ceará</p>
          </div>

          {/* Carrossel de patrocinadores */}
          <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
            {visibleSponsors.map((patrocinador) => (
              <Link
                key={patrocinador.id}
                href={patrocinador.link_site}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={patrocinador.logo_url || "/placeholder.svg"}
                  alt={patrocinador.nome}
                  width={100}
                  height={50}
                  className="h-6 md:h-8 w-auto object-contain"
                />
              </Link>
            ))}
          </div>

          {/* Links úteis */}
          <div className="flex gap-2 md:gap-4 text-xs">
            <Link href="/sobre" className="text-gray-700 hover:text-red-600 transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-700 hover:text-red-600 transition-colors">
              Contato
            </Link>
            <Link href="/privacidade" className="text-gray-700 hover:text-red-600 transition-colors hidden md:block">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

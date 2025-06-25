"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Patrocinador } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function Footer() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

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
    setHydrated(true)
  }, [])

  const scrollerContent =
    patrocinadores.length > 0
      ? [...patrocinadores, ...patrocinadores]
      : []

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white text-gray-900 shadow-lg z-40 border-t border-gray-200">
      <div className="container mx-auto px-2 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          {/* Informações do site */}
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm font-bold text-gray-900 tracking-wide">
              Ceará No Grau
            </p>
            <p className="text-xs text-gray-500 hidden md:block">
              Portal de notícias do Ceará
            </p>
          </div>

          {/* Carrossel de patrocinadores */}
          {hydrated && patrocinadores.length > 0 && (
            <div
              className="scroller w-[300px] md:w-[450px] max-w-full"
              data-speed="slow"
            >
              <div className="scroller__inner flex items-center gap-4">
                {scrollerContent.map((patrocinador, index) => (
                  <Link
                    key={`${patrocinador.id}-${index}`}
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
                      className="h-8 md:h-10 w-auto object-contain bg-white rounded shadow"
                      aria-hidden={index >= patrocinadores.length}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Links úteis */}
          <div className="flex gap-2 md:gap-4 text-xs">
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              Contato
            </Link>
            <Link
              href="/privacidade"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors hidden md:block"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

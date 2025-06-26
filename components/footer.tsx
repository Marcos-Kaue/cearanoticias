"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Patrocinador } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function Footer() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
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

  const scrollerContent =
    patrocinadores.length > 0
      ? [...patrocinadores, ...patrocinadores]
      : []

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white text-gray-900 shadow-lg z-40 border-t border-gray-200">
      <div className="container mx-auto px-2 py-4">
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
          <div className="scroller w-[300px] md:w-[450px] max-w-full">
            {patrocinadores.length > 0 ? (
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
                      width={120}
                      height={60}
                      className="h-10 md:h-14 w-auto object-contain bg-white rounded shadow"
                      aria-hidden={index >= patrocinadores.length}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-14 flex items-center justify-center text-gray-400">
                Sem patrocinadores
            </div>
          )}
          </div>

          {/* Links úteis + Instagram */}
          <div className="flex gap-2 md:gap-4 text-xs items-center">
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/privacidade"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors hidden md:block"
            >
              Privacidade
            </Link>
            <Link
              href="http://wa.me/5588996794900"
              className="text-gray-700 hover:text-green-600 font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contato
            </Link>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/cearanograuce?igsh=NDJ0NGJiZ3pxOW1h"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.13.62a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

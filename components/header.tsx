"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAnim, setShowAnim] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Política", href: "/categoria/politica" },
    { label: "Economia", href: "/categoria/economia" },
    { label: "Esportes", href: "/categoria/esportes" },
    { label: "Envie sua notícia", href: "/envie-sua-noticia" },
  ]

  useEffect(() => {
    setShowAnim(true)
  }, [])

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <header className={`bg-red-600 shadow-md sticky top-0 z-50 transition-all duration-700 ${showAnim ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`} style={{willChange: 'opacity, transform'}}>
      <div className="w-full pl-2 pr-2">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-1">
            <span className={`inline-block transition-all duration-700 ${showAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{willChange: 'opacity, transform'}}>
              <Image
                src="/logo.png"
                alt="Ceará No Grau Logo"
                width={50}
                height={50}
                className="w-20 h-20 md:w-20 md:h-20 rounded-lg object-cover"
              />
            </span>
            <div className={`flex flex-col transition-all duration-700 delay-150 ${showAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{willChange: 'opacity, transform'}}>
              <span className="text-lg md:text-2xl font-bold text-white">CEARÁ NO GRAU</span>
              <span className="text-xs text-red-100">Portal de Notícias</span>
            </div>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex items-center gap-4">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar notícias..."
                className="pl-10 pr-4 py-2 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-900"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-red-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? "block" : "hidden"} md:block border-t border-red-500 md:border-t-0 pt-2 md:pt-0 pb-2`}>
          <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white hover:text-red-100 font-medium transition-colors block py-1 md:py-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile search */}
          <div className="md:hidden mt-2">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar notícias..."
                className="w-full pl-10 pr-4 py-2 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-900"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>
        </nav>
      </div>
    </header>
  )
}

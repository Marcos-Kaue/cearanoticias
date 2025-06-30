"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, Settings, BarChart3, ImageIcon, Tag, Menu, X, Shield } from "lucide-react"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Notícias",
    href: "/admin/noticias",
    icon: FileText,
  },
  {
    title: "Notícias Enviadas",
    href: "/admin/noticias-enviadas",
    icon: FileText,
  },
  {
    title: "Patrocinadores",
    href: "/admin/patrocinadores",
    icon: Users,
  },

  {
    title: "Categorias",
    href: "/admin/categorias",
    icon: Tag,
  },
  {
    title: "Relatórios",
    href: "/admin/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botão hambúrguer para mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-200 rounded-lg p-2 shadow"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-red-600" />
      </button>

      {/* Sidebar para desktop e drawer para mobile */}
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300",
          "md:translate-x-0 md:block",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Botão de fechar no mobile */}
        <div className="flex justify-end md:hidden p-2">
          <button
            className="bg-gray-100 rounded p-1"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-red-50 text-red-700 border border-red-200" : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      {/* Overlay para fechar o menu no mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
    </>
  )
}

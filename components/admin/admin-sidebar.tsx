"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, Settings, BarChart3, ImageIcon, Tag } from "lucide-react"

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
    title: "Patrocinadores",
    href: "/admin/patrocinadores",
    icon: Users,
  },
  {
    title: "Anúncios",
    href: "/admin/anuncios",
    icon: ImageIcon,
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

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
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
            >
              <Icon className="w-4 h-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExternalLink, User, LogOut } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

// Função para extrair o nome do usuário de forma inteligente
function extractUserName(user: unknown): string {
  if (
    user &&
    typeof user === 'object' &&
    'user_metadata' in user &&
    user.user_metadata &&
    typeof user.user_metadata === 'object'
  ) {
    const meta = user.user_metadata as Record<string, unknown>;
    if (typeof meta.full_name === 'string' && meta.full_name) {
      return meta.full_name;
    }
    if (typeof meta.name === 'string' && meta.name) {
      return meta.name;
    }
    if (typeof meta.user_name === 'string' && meta.user_name) {
      return meta.user_name;
    }
  }

  if (
    user &&
    typeof user === 'object' &&
    'email' in user &&
    typeof user.email === 'string'
  ) {
    const emailName = user.email.split('@')[0];
    return emailName
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  return "Usuário";
}

export default function AdminHeader() {
  const router = useRouter()
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = extractUserName(user)
        setUserName(name)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-red-600 border-b border-red-700 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center">
            <Image src="/logo.png" alt="Logo" height={32} width={120} className="h-8 w-auto" sizes="120px" />
          </Link>
          <div className="h-6 w-px bg-red-400" />
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-gray-200">
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2 text-white" />
              Ver Site
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-white">
            <User className="w-4 h-4 text-white" />
            <span>{userName || "Usuário"}</span>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-gray-200">
            <LogOut className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </header>
  )
}

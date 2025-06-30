"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Verificar se já está logado
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace("/admin")
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      
      if (error) {
        console.error('Erro de login:', error)
        
        // Mensagens de erro mais específicas
        if (error.message.includes('Invalid login credentials')) {
          setError("E-mail ou senha incorretos. Verifique suas credenciais.")
        } else if (error.message.includes('Email not confirmed')) {
          setError("Email não confirmado. Verifique seu email ou contate o administrador.")
        } else if (error.message.includes('Too many requests')) {
          setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.")
        } else {
          setError(`Erro: ${error.message}`)
        }
      } else if (data && data.user && data.session) {
        console.log('Login bem-sucedido:', data.user.email)
        router.push("/admin")
      } else {
        setError("Não foi possível fazer login. Tente novamente.")
      }
    } catch (err) {
      console.error('Erro inesperado:', err)
      setError("Erro de conexão. Verifique sua internet.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Logo" width={200} height={60} className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Painel Administrativo</CardTitle>
          <CardDescription className="text-gray-600">Faça login para acessar o painel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@cearanoticias.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-red-600 hover:bg-red-700" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Como configurar:</h4>
            <p className="text-xs text-blue-700 mb-2">
              1. Acesse o Supabase Dashboard<br />
              2. Vá em Authentication → Users<br />
              3. Clique em &quot;Add User&quot;<br />
              4. Use seu Gmail e senha preferida
            </p>
            <p className="text-xs text-blue-700">
              <strong>Exemplo:</strong><br />
              Email: seu@gmail.com<br />
              Senha: minhasenha123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
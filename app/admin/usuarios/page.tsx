"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Trash2, Plus, Shield } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AdminUser {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      
      if (error) {
        console.error('Erro ao carregar usuários:', error)
        setError('Erro ao carregar usuários')
        return
      }

      setUsuarios(users || [])
    } catch (err) {
      console.error('Erro inesperado:', err)
      setError('Erro inesperado ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const deletarUsuario = async (userId: string, email: string) => {
    if (!confirm(`Tem certeza que deseja remover o acesso de ${email}?`)) {
      return
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      
      if (error) {
        console.error('Erro ao deletar usuário:', error)
        alert('Erro ao deletar usuário')
        return
      }

      alert('Usuário removido com sucesso!')
      await carregarUsuarios() // Recarregar lista
    } catch (err) {
      console.error('Erro inesperado:', err)
      alert('Erro inesperado ao deletar usuário')
    }
  }

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  return (
    <div className="space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usuários do Admin</h1>
          <p className="text-gray-600">Gerencie quem tem acesso ao painel administrativo</p>
        </div>
        <Button 
          onClick={() => window.open('https://supabase.com/dashboard/project/_/auth/users', '_blank')}
          className="w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Usuários com Acesso ({usuarios.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando usuários...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{usuario.email}</span>
                        {usuario.email_confirmed_at && (
                          <Badge variant="default" className="text-xs">Confirmado</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Criado: {formatarData(usuario.created_at)}
                        </span>
                        {usuario.last_sign_in_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Último acesso: {formatarData(usuario.last_sign_in_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deletarUsuario(usuario.id, usuario.email)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-900 mb-2">Como adicionar usuários:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Clique em "Adicionar Usuário" (abre o Supabase)</li>
          <li>2. Vá em Authentication → Users</li>
          <li>3. Clique em "Add User"</li>
          <li>4. Preencha email e senha</li>
          <li>5. Marque "Email Confirmed"</li>
          <li>6. Clique em "Create User"</li>
        </ol>
      </div>
    </div>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Patrocinador } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"

export default function AdminPatrocinadores() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nome: "",
    logo_url: "",
    link_site: "",
    ativo: true,
    ordem_exibicao: 0,
  })

  // Carregar patrocinadores
  const loadPatrocinadores = async () => {
    try {
      const response = await fetch('/api/patrocinadores')
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

  const handleEdit = (patrocinador: Patrocinador) => {
    setFormData(patrocinador)
    setEditingId(patrocinador.id || null)
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/patrocinadores/${editingId}` : '/api/patrocinadores'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar patrocinador')
      }

      await loadPatrocinadores() // Recarregar lista
      setShowForm(false)
      setEditingId(null)
      setFormData({ nome: "", logo_url: "", link_site: "", ativo: true, ordem_exibicao: 0 })
    } catch (error) {
      console.error('Erro ao salvar patrocinador:', error)
      alert('Erro ao salvar patrocinador. Tente novamente.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este patrocinador?')) return
    
    try {
      const response = await fetch(`/api/patrocinadores/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar patrocinador')
      }

      await loadPatrocinadores() // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar patrocinador:', error)
      alert('Erro ao deletar patrocinador. Tente novamente.')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ nome: "", logo_url: "", link_site: "", ativo: true, ordem_exibicao: 0 })
  }

  // Função para upload de imagem para o Supabase Storage (imagens)
  async function uploadImagemPatrocinador(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const { data, error } = await supabase.storage.from('imagens').upload(fileName, file)
    if (error) {
      alert('Erro ao fazer upload da imagem!')
      return null
    }
    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage.from('imagens').getPublicUrl(fileName)
    return publicUrlData?.publicUrl || null
  }

  // Handler para upload de imagem do logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImagemPatrocinador(file)
    if (url) {
      setFormData((prev) => ({ ...prev, logo_url: url }))
    }
  }

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patrocinadores</h1>
          <p className="text-gray-600">Gerencie os patrocinadores do seu portal</p>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Novo"} Patrocinador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Patrocinador</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <Label htmlFor="link_site">Site</Label>
                <Input
                  id="link_site"
                  value={formData.link_site}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link_site: e.target.value }))}
                  placeholder="https://exemplo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="logo_url">Logo do Patrocinador</Label>
              <Input
                id="logo_upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <Input
                id="logo_url"
                type="text"
                value={formData.logo_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, logo_url: e.target.value }))}
                placeholder="URL do logo (preenchido automaticamente ao fazer upload)"
                className="mt-2"
              />
              {formData.logo_url && (
                <div className="mt-2">
                  <Image
                    src={formData.logo_url}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="w-24 h-24 object-contain rounded border"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ativo: checked }))}
              />
              <Label htmlFor="ativo">Patrocinador ativo</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>{editingId ? "Atualizar" : "Salvar"}</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de patrocinadores */}
      <Card>
        <CardHeader>
          <CardTitle>Patrocinadores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando patrocinadores...</p>
            </div>
          ) : patrocinadores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum patrocinador cadastrado ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patrocinadores.map((patrocinador) => (
                <div key={patrocinador.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Image
                      src={patrocinador.logo_url || "/placeholder-logo.png"}
                      alt={patrocinador.nome}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-contain rounded border"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="font-medium">{patrocinador.nome}</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-500">
                        <ExternalLink className="w-3 h-3" />
                        <a
                          href={patrocinador.link_site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 break-all"
                        >
                          {patrocinador.link_site}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        patrocinador.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patrocinador.ativo ? "Ativo" : "Inativo"}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(patrocinador)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(patrocinador.id || 0)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão Novo Patrocinador centralizado abaixo da lista */}
      <div className="flex justify-center mt-6">
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Novo Patrocinador
        </Button>
      </div>
    </div>
  )
}

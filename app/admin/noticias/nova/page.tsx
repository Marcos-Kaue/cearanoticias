"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

const categorias = [
  "Política",
  "Economia",
  "Esportes",
  "Meio Ambiente",
  "Cultura",
  "Internacional",
]

// Função para upload de imagem para o Supabase Storage (imagens)
async function uploadImagemNoticia(file: File): Promise<string | null> {
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

export default function NovaNoticia() {
  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    categoria: "",
    imagem_url: "",
    status: "publicado",
  })

  const [imagePreview, setImagePreview] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "imagem_url") {
      setImagePreview(value)
    }
  }

  // Novo handler para upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImagemNoticia(file)
    if (url) {
      setFormData((prev) => ({ ...prev, imagem_url: url }))
      setImagePreview(url)
    }
  }

  const handleSave = async (status: string) => {
    try {
      const noticiaData = { 
        ...formData, 
        status,
        autor: "Admin", // Você pode adicionar um campo de autor depois
        visualizacoes: 0
      }
      
      const response = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticiaData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar notícia')
      }

      const savedNoticia = await response.json()
      console.log('Notícia salva com sucesso:', savedNoticia)
      
      // Redirecionar para a lista de notícias
      window.location.href = '/admin/noticias'
    } catch (error) {
      console.error('Erro ao salvar notícia:', error)
      alert('Erro ao salvar notícia. Tente novamente.')
    }
  }

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row items-start gap-4">
        <Button variant="outline" size="sm" asChild className="w-full md:w-auto mb-2 md:mb-0">
          <Link href="/admin/noticias">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Nova Notícia</h1>
          <p className="text-gray-600">Crie uma nova notícia para seu portal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título da Notícia</Label>
                <Input
                  id="titulo"
                  placeholder="Digite o título da notícia..."
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="resumo">Resumo</Label>
                <Textarea
                  id="resumo"
                  placeholder="Escreva um resumo da notícia..."
                  rows={3}
                  value={formData.resumo}
                  onChange={(e) => handleInputChange("resumo", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)} className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="imagem_url">Imagem da Notícia</Label>
                <Input
                  id="imagem_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                <Input
                  id="imagem_url"
                  type="text"
                  value={formData.imagem_url}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, imagem_url: e.target.value }))
                    setImagePreview(e.target.value)
                  }}
                  placeholder="URL da imagem (preenchido automaticamente ao fazer upload)"
                  className="mt-2 w-full"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 block mb-1">Pré-visualização:</span>
                    <Image
                      src={imagePreview}
                      alt="Pré-visualização da imagem"
                      width={180}
                      height={120}
                      style={{ objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', maxWidth: 180, maxHeight: 120 }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo da Notícia</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escreva o conteúdo completo da notícia aqui..."
                rows={15}
                value={formData.conteudo}
                onChange={(e) => handleInputChange("conteudo", e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                onClick={() => handleSave("publicado")}
                disabled={!formData.titulo || !formData.conteudo}
              >
                <Save className="w-4 h-4 mr-2" />
                Publicar Notícia
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleSave("rascunho")}>Salvar Rascunho</Button>
              
              {/* Botão Visualizar */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  localStorage.setItem('noticia-preview', JSON.stringify(formData));
                  window.open('/admin/noticias/preview', '_blank');
                }}
                disabled={!formData.titulo || !formData.conteudo}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• Use títulos claros e atrativos</p>
              <p>• O resumo deve ter entre 100-200 caracteres</p>
              <p>• Divida o conteúdo em parágrafos</p>
              <p>• Use imagens de alta qualidade</p>
              <p>• Revise antes de publicar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

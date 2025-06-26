"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, Eye, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const categorias = [
  "Política",
  "Economia",
  "Esportes",
  "Meio Ambiente",
  "Cultura",
  "Internacional",
]

export default function EditarNoticia({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    categoria: "",
    imagem_url: "",
    status: "rascunho",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    async function fetchNoticia() {
      try {
        const response = await fetch(`/api/noticias/${params.id}`)
        if (!response.ok) throw new Error("Notícia não encontrada")
        const data = await response.json()
        setFormData(data)
        if (data.imagem_url) {
          setImagePreview(data.imagem_url)
        }
      } catch (error) {
        console.error("Erro ao buscar notícia:", error)
        // Opcional: redirecionar ou mostrar mensagem de erro
      } finally {
        setLoading(false)
      }
    }
    fetchNoticia()
  }, [params.id])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (field === "imagem_url") {
      setImagePreview(value)
    }
  }

  const handleSave = async (status: string) => {
    setSaving(true)
    try {
      const noticiaData = {
        ...formData,
        status,
      }

      const response = await fetch(`/api/noticias/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticiaData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar notícia")
      }

      const savedNoticia = await response.json()
      console.log("Notícia salva com sucesso:", savedNoticia)

      // Redirecionar para a lista de notícias
      window.location.href = "/admin/noticias"
    } catch (error) {
      console.error("Erro ao salvar notícia:", error)
      alert("Erro ao salvar notícia. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="ml-2">Carregando notícia...</p>
      </div>
    )
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Editar Notícia</h1>
          <p className="text-gray-600">Altere as informações da notícia</p>
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
                  onChange={e => handleInputChange("titulo", e.target.value)}
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
                  onChange={e => handleInputChange("resumo", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={value => handleInputChange("categoria", value)}
                  className="w-full"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="imagem_url">URL da Imagem</Label>
                <Input
                  id="imagem_url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.imagem_url}
                  onChange={e =>
                    handleInputChange("imagem_url", e.target.value)
                  }
                  className="w-full"
                />
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
                onChange={e => handleInputChange("conteudo", e.target.value)}
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
                className="w-full"
                onClick={() => handleSave("publicado")}
                disabled={!formData.titulo || !formData.conteudo || saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSave("rascunho")}
                disabled={saving}
              >
                Salvar como Rascunho
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/noticia/${params.id}`} target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Preview da imagem */}
          {imagePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview da Imagem</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded"
                />
              </CardContent>
            </Card>
          )}

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

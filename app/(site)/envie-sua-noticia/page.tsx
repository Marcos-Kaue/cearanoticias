"use client"

import { useState } from "react"

export default function EnvieSuaNoticia() {
  const [form, setForm] = useState({ nome: "", telefone: "", titulo: "", texto: "", imagem: null })
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState("")
  const [erro, setErro] = useState("")

  const handleChange = (e: any) => {
    const { name, value, files } = e.target
    if (name === "imagem") {
      setForm(f => ({ ...f, imagem: files[0] }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setEnviando(true)
    setSucesso("")
    setErro("")
    
    try {
      const formData = new FormData()
      formData.append("nome", form.nome)
      formData.append("telefone", form.telefone)
      formData.append("titulo", form.titulo)
      formData.append("texto", form.texto)
      if (form.imagem) formData.append("imagem", form.imagem)

      console.log('Enviando notícia...', { 
        nome: form.nome, 
        telefone: form.telefone, 
        titulo: form.titulo,
        temImagem: !!form.imagem 
      })

      const res = await fetch("/api/noticias-enviadas", {
        method: "POST",
        body: formData
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        console.error('Erro na resposta:', data)
        throw new Error(data.detalhe || data.error || "Erro ao enviar notícia")
      }
      
      console.log('Sucesso:', data)
      setSucesso("Notícia enviada com sucesso! Obrigado pela sua colaboração.")
      setForm({ nome: "", telefone: "", titulo: "", texto: "", imagem: null })
    } catch (error) {
      console.error('Erro ao enviar:', error)
      setErro(error instanceof Error ? error.message : "Erro ao enviar notícia. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Envie sua notícia</h1>
      <p className="mb-6 text-gray-700">Preencha o formulário abaixo para enviar sua notícia para nossa equipe. Após análise, ela poderá ser publicada no portal!</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input name="nome" required value={form.nome} onChange={handleChange} className="w-full border rounded px-3 py-2" aria-label="Nome completo" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone (WhatsApp)</label>
          <input name="telefone" type="tel" required value={form.telefone} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="(DDD) 99999-9999" aria-label="Telefone WhatsApp" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Título da notícia</label>
          <input name="titulo" required value={form.titulo} onChange={handleChange} className="w-full border rounded px-3 py-2" aria-label="Título da notícia" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Texto da notícia</label>
          <textarea name="texto" required value={form.texto} onChange={handleChange} className="w-full border rounded px-3 py-2 min-h-[120px]" aria-label="Texto da notícia" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem (opcional)</label>
          <input name="imagem" type="file" accept="image/*" onChange={handleChange} className="w-full" aria-label="Selecionar imagem" />
        </div>
        <button type="submit" disabled={enviando} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition disabled:opacity-50">
          {enviando ? "Enviando..." : "Enviar notícia"}
        </button>
        {sucesso && <div className="text-green-600 font-medium mt-2 p-3 bg-green-50 border border-green-200 rounded">{sucesso}</div>}
        {erro && <div className="text-red-600 font-medium mt-2 p-3 bg-red-50 border border-red-200 rounded">{erro}</div>}
      </form>
    </div>
  )
} 
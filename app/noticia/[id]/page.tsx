import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { notFound } from "next/navigation"
import AdBanner from "@/components/ad-banner"
import { RelativeTime } from "@/components/relative-time"
import Facebook from "lucide-react/dist/esm/icons/facebook"
import Instagram from "lucide-react/dist/esm/icons/instagram"
import Whatsapp from "lucide-react/dist/esm/icons/whatsapp"
import React from "react"

async function getNoticia(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/noticias/${id}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return await res.json()
}

async function getPatrocinadores() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/patrocinadores?ativo=true`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data = await res.json()
    return data
  } catch {
    return []
  }
}

export default async function NoticiaPage({ params }: { params: { id: string } }) {
  const [noticia, patrocinadores] = await Promise.all([
    getNoticia(params.id),
    getPatrocinadores()
  ])

  if (!noticia) {
    notFound()
  }

  // Embaralhar patrocinadores para garantir aleatoriedade em cada local
  function shuffleArray(array: any[]) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
  const patrocinadoresAleatorios = shuffleArray(patrocinadores)

  // Dividir o conteúdo em parágrafos para inserir anúncios
  const paragrafos = noticia.conteudo ? noticia.conteudo.split("\n\n") : []

  // Função para pegar patrocinador aleatório para cada posição
  function getPatrocinadorAleatorio(index: number) {
    if (!patrocinadoresAleatorios.length) return null
    return patrocinadoresAleatorios[index % patrocinadoresAleatorios.length]
  }

  // Função para montar os links de compartilhamento
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://cearanoticias.com"}/noticia/${noticia.id}`
  const shareText = `${noticia.titulo} - ${shareUrl}`
  const instagramUser = "seuusuario" // Troque pelo usuário do portal

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Botão de voltar para a página inicial */}
        <div className="mb-4">
          <a href="/" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium">
            ← Voltar para a página inicial
          </a>
        </div>
        {/* Cabeçalho da notícia */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">{noticia.categoria}</span>
            <RelativeTime dateString={noticia.created_at} className="text-gray-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{noticia.titulo}</h1>
          {/* Botão de compartilhamento WhatsApp */}
          <div className="flex gap-3 mb-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(noticia.titulo + ' - ' + (typeof window !== 'undefined' ? window.location.href : (process.env.NEXT_PUBLIC_SITE_URL || 'https://cearanoticias.com') + '/noticia/' + noticia.id))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 flex items-center justify-center"
              title="Compartilhar no WhatsApp"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
            </a>
            <a
              href="https://www.instagram.com/cearanograuce?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 flex items-center justify-center"
              title="Ver nosso Instagram"
            >
              <img src="/instagram.png" alt="Instagram" className="w-8 h-8 object-contain" />
            </a>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">{noticia.resumo}</p>
        </header>

        {/* Imagem principal */}
        {noticia.imagem_url && (
          <div className="mb-8">
            <Image
              src={noticia.imagem_url || "/placeholder.svg"}
              alt={noticia.titulo}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Anúncio banner superior */}
        <div className="mb-8">
          {patrocinadoresAleatorios.length > 0 ? (
            <AdBanner
              imageUrl={getPatrocinadorAleatorio(0).logo_url || "/placeholder.svg"}
              link={getPatrocinadorAleatorio(0).link_site || "#"}
              title={getPatrocinadorAleatorio(0).nome}
              className="w-full"
            />
          ) : (
            <AdBanner
              imageUrl="/placeholder.svg?height=100&width=728"
              link="#"
              title="Patrocinador Premium"
              className="w-full"
            />
          )}
        </div>

        {/* Conteúdo da notícia */}
        <div className="flex flex-col lg:flex-row gap-8">
          <article className="lg:w-2/3">
            <div className="prose prose-lg max-w-none">
              {paragrafos.map((paragrafo: string, index: number) => (
                <div key={index}>
                  <p className="text-gray-800 leading-relaxed mb-6 text-justify">{paragrafo}</p>
                  {/* Inserir anúncio após o segundo parágrafo */}
                  {index === 1 && (
                    <div className="my-8">
                      {patrocinadoresAleatorios.length > 0 ? (
                        <AdBanner
                          imageUrl={getPatrocinadorAleatorio(1).logo_url || "/placeholder.svg"}
                          link={getPatrocinadorAleatorio(1).link_site || "#"}
                          title={getPatrocinadorAleatorio(1).nome}
                          className="w-full"
                        />
                      ) : (
                        <AdBanner
                          imageUrl="/placeholder.svg?height=150&width=728"
                          link="#"
                          title="Anúncio Integrado"
                          className="w-full"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Sidebar com anúncios */}
          <aside className="lg:w-1/3">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-gray-900">Publicidade</h3>
                  {patrocinadoresAleatorios.length > 0 ? (
                    <AdBanner
                      imageUrl={getPatrocinadorAleatorio(2).logo_url || "/placeholder.svg"}
                      link={getPatrocinadorAleatorio(2).link_site || "#"}
                      title={getPatrocinadorAleatorio(2).nome}
                      className="w-full"
                      onlyImage
                    />
                  ) : (
                    <AdBanner
                      imageUrl="/placeholder.svg?height=250&width=300"
                      link="#"
                      title="Anúncio Lateral"
                      className="w-full"
                      onlyImage
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { notFound } from "next/navigation"
import AdBanner from "@/components/ad-banner"
import { RelativeTime } from "@/components/relative-time"
import Link from "next/link"
import { getNoticia, getPatrocinadores } from "@/lib/api"
import VisualizacaoTracker from "./visualizacao-tracker"

export default async function NoticiaPage({ params }: { params: { id: string } }) {
  const { id } = params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const [noticia, patrocinadores] = await Promise.all([
    getNoticia(baseUrl, id),
    getPatrocinadores(baseUrl)
  ])

  if (!noticia) {
    notFound()
  }

  // Remover o shuffle para evitar mismatch:
  const patrocinadoresAleatorios = patrocinadores;

  // Corrigir uso de window/location:
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${noticia.id}`;

  // Dividir o conteúdo em parágrafos para inserir anúncios
  const paragrafos = noticia.conteudo ? noticia.conteudo.split("\n\n") : []

  function getPatrocinadorAleatorio(index: number) {
    if (!patrocinadoresAleatorios.length) return null
    return patrocinadoresAleatorios[index % patrocinadoresAleatorios.length]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Componente para rastrear visualizações */}
      <VisualizacaoTracker noticiaId={id} />
      
      <div className="max-w-4xl mx-auto">
        {/* Botão de voltar para a página inicial */}
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
            <Link href="/">← Voltar para a Home</Link>
          </Button>
        </div>
        {/* Cabeçalho da notícia */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">{noticia.categoria}</span>
            <RelativeTime dateString={noticia.created_at || ""} className="text-gray-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{noticia.titulo}</h1>
          {/* Botão de compartilhamento WhatsApp */}
          <div className="flex gap-3 mb-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(noticia.titulo + ' - ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 flex items-center justify-center"
              title="Compartilhar no WhatsApp"
            >
              <Image src="/whatsapp.png" alt="Ícone do WhatsApp" width={32} height={32} style={{ width: 32, height: 'auto' }} className="w-8 h-8 object-contain" sizes="32px" />
            </a>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">{noticia.resumo}</p>
        </header>

        {/* Imagem principal */}
        {noticia.imagem_url && (
          <div className="mb-8">
            <Image
              src={noticia.imagem_url || "/placeholder.svg"}
              alt={noticia.titulo || "Imagem da notícia"}
              width={800}
              height={400}
              style={{ width: 800, height: 'auto' }}
              className="w-full h-auto object-cover rounded-lg"
              sizes="(max-width: 800px) 100vw, 800px"
            />
          </div>
        )}

        {/* Anúncio banner superior */}
        <div className="mb-8">
          {patrocinadoresAleatorios.length > 0 ? (
            <AdBanner
              imageUrl={getPatrocinadorAleatorio(0)?.logo_url || "/placeholder.svg"}
              link={getPatrocinadorAleatorio(0)?.link_site || "#"}
              title={getPatrocinadorAleatorio(0)?.nome || "Patrocinador"}
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
                          imageUrl={getPatrocinadorAleatorio(1)?.logo_url || "/placeholder.svg"}
                          link={getPatrocinadorAleatorio(1)?.link_site || "#"}
                          title={getPatrocinadorAleatorio(1)?.nome || "Patrocinador"}
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
                      imageUrl={getPatrocinadorAleatorio(2)?.logo_url || "/placeholder.svg"}
                      link={getPatrocinadorAleatorio(2)?.link_site || "#"}
                      title={getPatrocinadorAleatorio(2)?.nome || "Patrocinador"}
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

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { notFound } from "next/navigation"
import AdBanner from "@/components/ad-banner"
import { RelativeTime } from "@/components/relative-time"

async function getNoticia(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/noticias/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return await res.json()
}

export default async function NoticiaPage({ params }: { params: { id: string } }) {
  const noticia = await getNoticia(params.id)

  if (!noticia) {
    notFound()
  }

  // Dividir o conteúdo em parágrafos para inserir anúncios
  const paragrafos = noticia.conteudo ? noticia.conteudo.split("\n\n") : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho da notícia */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">{noticia.categoria}</span>
            <RelativeTime dateString={noticia.created_at} className="text-gray-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{noticia.titulo}</h1>
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
          <AdBanner
            imageUrl="/placeholder.svg?height=100&width=728"
            link="#"
            title="Patrocinador Premium"
            className="w-full"
          />
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
                      <AdBanner
                        imageUrl="/placeholder.svg?height=150&width=728"
                        link="#"
                        title="Anúncio Integrado"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Sidebar com anúncios */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-gray-900">Publicidade</h3>
                  <AdBanner
                    imageUrl="/placeholder.svg?height=250&width=300"
                    link="#"
                    title="Anúncio Lateral"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

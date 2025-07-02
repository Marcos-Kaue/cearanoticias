import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { RelativeTime } from "@/components/relative-time"
import { headers } from 'next/headers'
import { getNoticiasPorCategoria } from "@/lib/api"

async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

// Função para capitalizar a primeira letra
const capitalize = (s: string) => {
  if (typeof s !== 'string' || !s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const baseUrl = await getBaseUrl()
  const noticias = await getNoticiasPorCategoria(baseUrl, slug)
  const nomeCategoria = capitalize(decodeURIComponent(slug))

  if (!noticias) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center items-center h-40">
          <span className="loader inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
        <p className="text-gray-600 mt-4">Carregando notícias...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Categoria: {nomeCategoria}
      </h1>
      <p className="text-gray-600 mb-8">
        Exibindo as notícias mais recentes sobre {nomeCategoria}.
      </p>

      {noticias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map(noticia => (
            <Link key={noticia.id} href={`/noticia/${noticia.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <Image
                  src={noticia.imagem_url || "/placeholder.svg"}
                  alt={noticia.titulo || "Imagem da notícia"}
                  width={800}
                  height={400}
                  style={{ width: 800, height: 'auto' }}
                  className="w-full h-auto object-cover rounded-lg"
                  sizes="(max-width: 800px) 100vw, 800px"
                />
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
                      {noticia.categoria}
                    </span>
                    <RelativeTime
                      dateString={noticia.created_at || ""}
                      className="text-gray-500 text-xs"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight flex-grow">
                    {noticia.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {noticia.resumo}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">
            Nenhuma notícia encontrada
          </h2>
          <p className="text-gray-500 mt-2">
            Não há notícias publicadas nesta categoria no momento.
          </p>
        </div>
      )}
    </div>
  )
} 
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { RelativeTime } from "@/components/relative-time"
import AdBanner from "@/components/ad-banner"

interface Noticia {
  id: number
  titulo: string
  resumo: string
  imagem_url: string | null
  created_at: string
  categoria: string
}

async function getNoticias(): Promise<Noticia[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/noticias`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Falha ao buscar notícias:", res.statusText)
      return []
    }

    const data = await res.json()
    // Filtra apenas notícias com data de hoje ou do passado
    return data
  } catch (error) {
    console.error("Ocorreu um erro ao buscar notícias:", error)
    return []
  }
}

// Função para buscar patrocinador ativo (mock se não houver)
async function getAd() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/patrocinadores?ativo=true`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    if (data && data.length > 0) {
      const patrocinador = data[0]
      return {
        imageUrl: patrocinador.logo_url || "/placeholder.svg",
        link: patrocinador.link_site || "#",
        title: `Patrocinado por ${patrocinador.nome}`,
      }
    }
    return null
  } catch {
    return null
  }
}

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Ceará No Grau',
  description: 'Seu portal de notícias do Ceará atualizado',
}

export default async function HomePage() {
  const noticias = await getNoticias()
  const ad = await getAd() || {
    imageUrl: "/placeholder-logo.png",
    link: "https://www.exemplo.com",
    title: "Anuncie aqui e alcance milhares de leitores!",
  }

  if (!noticias || noticias.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Nenhuma notícia publicada
        </h2>
        <p className="text-gray-600">
          Ainda não há notícias disponíveis. Volte mais tarde!
        </p>
      </div>
    )
  }

  const noticiaDestaque = noticias[0]
  const outrasNoticias = noticias.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notícia Destaque */}
      <section className="mb-12">
        <Link href={`/noticia/${noticiaDestaque.id}`}
          className="block group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={noticiaDestaque.imagem_url || "/placeholder.svg"}
              alt={noticiaDestaque.titulo}
              fill
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="inline-block bg-red-600/90 text-xs font-bold rounded px-3 py-1 mb-2 shadow">
                {noticiaDestaque.categoria}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
                {noticiaDestaque.titulo}
              </h1>
              <p className="text-base md:text-lg font-medium mb-2 drop-shadow">
                {noticiaDestaque.resumo}
              </p>
              <RelativeTime
                dateString={noticiaDestaque.created_at}
                className="text-gray-200 text-xs"
              />
            </div>
          </div>
        </Link>
      </section>

      {/* Banner de Anúncio (modelo G1) */}
      <AdBanner imageUrl={ad.imageUrl} link={ad.link} title={ad.title} />

      {/* Outras Notícias */}
      {outrasNoticias.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Últimas Notícias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {outrasNoticias.map(noticia => (
              <Link key={noticia.id} href={`/noticia/${noticia.id}`}
                className="group block rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative w-full h-48">
                  <Image
                    src={noticia.imagem_url || "/placeholder.svg"}
                    alt={noticia.titulo}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs font-bold rounded px-2 py-1 shadow">
                    {noticia.categoria}
                  </span>
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight flex-grow group-hover:text-red-700 transition-colors">
                    {noticia.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {noticia.resumo}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <RelativeTime
                      dateString={noticia.created_at}
                      className="text-gray-400 text-xs"
                    />
                    <span className="inline-block bg-red-50 text-red-700 text-xs font-semibold rounded px-3 py-1 group-hover:bg-red-600 group-hover:text-white transition-colors cursor-pointer">
                      Leia mais
                    </span>
                  </div>
                </CardContent>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
} 
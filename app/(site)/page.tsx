import { CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { RelativeTime } from "@/components/relative-time"
import AdBanner from "@/components/ad-banner"
import { headers } from 'next/headers'
import { Patrocinador } from "@/lib/types"
import { getNoticias, getPatrocinadores } from "@/lib/api"

// Função para obter a base da URL de forma assíncrona
async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Ceará No Grau',
  description: 'Seu portal de notícias do Ceará atualizado',
}

export default async function HomePage({ searchParams }: { searchParams?: { q?: string } }) {
  console.time("INICIO HomePage");
  const q = await Promise.resolve(searchParams?.q ?? "");
  console.time("getBaseUrl");
  const baseUrl = await getBaseUrl()
  console.timeEnd("getBaseUrl");

  console.time("getNoticias");
  const noticias = await getNoticias(baseUrl)
  console.timeEnd("getNoticias");

  console.time("getPatrocinadores");
  const patrocinadores = await getPatrocinadores(baseUrl)
  console.timeEnd("getPatrocinadores");
  console.timeEnd("INICIO HomePage");

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

  // Filtrar notícias pelo termo de busca, se houver
  let noticiasFiltradas = noticias
  if (q && q.trim()) {
    const termo = q.trim().toLowerCase()
    noticiasFiltradas = noticias.filter(n =>
      n.titulo.toLowerCase().includes(termo) ||
      n.resumo.toLowerCase().includes(termo) ||
      n.categoria.toLowerCase().includes(termo)
    )
  }

  if (!noticiasFiltradas.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Nenhuma notícia encontrada
        </h2>
        <p className="text-gray-600">
          Nenhuma notícia corresponde ao termo buscado.
        </p>
      </div>
    )
  }

  const noticiaDestaque = noticiasFiltradas[0]
  const outrasNoticias = noticiasFiltradas.slice(1)

  // Não embaralhe patrocinadores no SSR para evitar hydration mismatch
  const patrocinadoresAleatorios: Patrocinador[] = patrocinadores;
  const patrocinadorBanner: Patrocinador | null = patrocinadoresAleatorios[0] || null

  // Ranking de notícias mais lidas (top 3)
  const rankingMaisLidas = [...noticias]
    .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notícia Destaque */}
      <section className="mb-12">
        <Link href={`/noticia/${noticiaDestaque.id}`}
          className="block group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-150">
          <div className="relative w-full aspect-[16/9] min-h-[256px]">
            <Image
              src={noticiaDestaque.imagem_url || "/placeholder.svg"}
              alt={noticiaDestaque.titulo || "Imagem da notícia em destaque"}
              fill
              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-150"
              priority
              sizes="(max-width: 800px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="inline-block bg-red-600/90 text-xs font-bold rounded px-3 py-1 mb-2 shadow">
                {noticiaDestaque.categoria}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
                {noticiaDestaque.titulo}
              </h1>
              {noticiaDestaque.titulo.length <= 60 && (
                <p className="text-base md:text-lg font-medium mb-2 drop-shadow line-clamp-2">
                  {noticiaDestaque.resumo}
                </p>
              )}
              <RelativeTime
                dateString={noticiaDestaque.created_at || ""}
                className="text-gray-200 text-xs"
              />
            </div>
          </div>
        </Link>
      </section>

      {/* Banner de Publicidade com patrocinador aleatório */}
      <section className="mb-12">
        <div className="text-xs text-gray-400 mb-1 text-center tracking-widest">PUBLICIDADE</div>
        {patrocinadorBanner ? (
          <AdBanner
            imageUrl={patrocinadorBanner.logo_url || "/placeholder.svg"}
            link={patrocinadorBanner.link_site || "#"}
            title={patrocinadorBanner.nome}
          />
        ) : (
          <AdBanner
            imageUrl="/placeholder-logo.png"
            link="https://www.exemplo.com"
            title="Anuncie aqui e alcance milhares de leitores!"
          />
        )}
      </section>

      {/* Ranking de Notícias Mais Lidas */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Mais Lidas</h2>
        <ol className="space-y-3">
          {rankingMaisLidas.map((noticia, idx) => (
            <li key={noticia.id} className="flex items-center gap-3 bg-gray-50 rounded p-3 hover:bg-gray-100 transition">
              <span className="text-lg font-bold text-red-600 w-6 text-center">{idx + 1}</span>
              <Link href={`/noticia/${noticia.id}`} className="flex-1 font-medium text-gray-900 hover:text-red-700 transition-colors">
                {noticia.titulo}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Outras Notícias */}
      {outrasNoticias.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Últimas Notícias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {outrasNoticias.map(noticia => (
              <Link key={noticia.id} href={`/noticia/${noticia.id}`}
                className="group block rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-150 bg-white">
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={noticia.imagem_url || "/placeholder.svg"}
                    alt={noticia.titulo || "Imagem da notícia"}
                    fill
                    className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-150"
                    sizes="(max-width: 800px) 100vw, 800px"
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
                      dateString={noticia.created_at || ""}
                      className="text-gray-400 text-xs"
                    />
                    <span className="inline-block bg-red-50 text-red-700 text-xs font-semibold rounded px-3 py-1 group-hover:bg-red-600 group-hover:text-white transition-colors">
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
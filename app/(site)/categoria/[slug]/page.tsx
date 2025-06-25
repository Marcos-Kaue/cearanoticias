import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { RelativeTime } from "@/components/relative-time"

interface Noticia {
  id: number
  titulo: string
  resumo: string
  imagem_url: string | null
  created_at: string
  categoria: string
}

async function getNoticiasPorCategoria(categoria: string): Promise<Noticia[]> {
  try {
    // Decodifica o slug da categoria para lidar com acentos e caracteres especiais
    // Capitaliza a primeira letra e coloca acento se necessário
const categoriaMap: Record<string, string> = {
    politica: "Política",
    economia: "Economia",
    esportes: "Esportes",
    tecnologia: "Tecnologia",
    saude: "Saúde",
    // adicione outras categorias se necessário
  }
  const categoriaDecodificada = categoriaMap[categoria.toLowerCase()] || categoria
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const res = await fetch(
      `${baseUrl}/api/noticias?status=publicado&categoria=${categoriaDecodificada}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      console.error("Falha ao buscar notícias:", res.statusText)
      return []
    }

    const data = await res.json()
    // Filtra notícias com data de hoje ou do passado - REMOVIDO PARA EXIBIR TUDO
    return data
  } catch (error) {
    console.error("Ocorreu um erro ao buscar notícias:", error)
    return []
  }
}

// Função para capitalizar a primeira letra
const capitalize = (s: string) => {
  if (typeof s !== 'string' || !s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const noticias = await getNoticiasPorCategoria(params.slug)
  const nomeCategoria = capitalize(decodeURIComponent(params.slug))

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
                  alt={noticia.titulo}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
                      {noticia.categoria}
                    </span>
                    <RelativeTime
                      dateString={noticia.created_at}
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
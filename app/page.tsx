import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

// Mock data - em produção viria do banco de dados
const noticias = [
  {
    id: 1,
    titulo: "Economia brasileira cresce 2,5% no terceiro trimestre",
    resumo: "PIB supera expectativas dos analistas e mostra sinais de recuperação sustentável",
    imagem_url: "/placeholder.svg?height=200&width=300",
    data: new Date("2024-01-15"),
    categoria: "Economia",
  },
  {
    id: 2,
    titulo: "Nova tecnologia promete revolucionar energia solar",
    resumo: "Pesquisadores desenvolvem células fotovoltaicas com eficiência 40% maior",
    imagem_url: "/placeholder.svg?height=200&width=300",
    data: new Date("2024-01-14"),
    categoria: "Tecnologia",
  },
  {
    id: 3,
    titulo: "Copa do Mundo de 2026 terá novo formato de disputa",
    resumo: "FIFA anuncia mudanças significativas na estrutura do torneio",
    imagem_url: "/placeholder.svg?height=200&width=300",
    data: new Date("2024-01-13"),
    categoria: "Esportes",
  },
  {
    id: 4,
    titulo: "Descoberta arqueológica revela civilização perdida",
    resumo: "Escavações no interior revelam artefatos de mais de 3 mil anos",
    imagem_url: "/placeholder.svg?height=200&width=300",
    data: new Date("2024-01-12"),
    categoria: "Ciência",
  },
  {
    id: 5,
    titulo: "Mudanças climáticas afetam agricultura nacional",
    resumo: "Estudo aponta necessidade de adaptação nas técnicas de cultivo",
    imagem_url: "/placeholder.svg?height=200&width=300",
    data: new Date("2024-01-11"),
    categoria: "Meio Ambiente",
  },
  {
    id: 6,
    titulo: "Setor de saúde recebe novos investimentos",
    resumo: "Governo anuncia R$ 2 bilhões para modernização de hospitais",
    imagem_url: "/placeholder.svg?height=200&width=300",
    data: new Date("2024-01-10"),
    categoria: "Saúde",
  },
]

export default function HomePage() {
  const noticiaDestaque = noticias[0]
  const outrasNoticias = noticias.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notícia Destaque */}
      <section className="mb-12">
        <Link href={`/noticia/${noticiaDestaque.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src={noticiaDestaque.imagem_url || "/placeholder.svg"}
                  alt={noticiaDestaque.titulo}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <CardContent className="md:w-1/2 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
                    {noticiaDestaque.categoria}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDistanceToNow(noticiaDestaque.data, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">
                  {noticiaDestaque.titulo}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">{noticiaDestaque.resumo}</p>
              </CardContent>
            </div>
          </Card>
        </Link>
      </section>

      {/* Outras Notícias */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Últimas Notícias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outrasNoticias.map((noticia) => (
            <Link key={noticia.id} href={`/noticia/${noticia.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <Image
                  src={noticia.imagem_url || "/placeholder.svg"}
                  alt={noticia.titulo}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
                      {noticia.categoria}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(noticia.data, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">{noticia.titulo}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{noticia.resumo}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

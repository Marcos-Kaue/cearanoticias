import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { notFound } from "next/navigation"
import AdBanner from "@/components/ad-banner"

// Mock data - em produção viria do banco de dados
const noticias = [
  {
    id: 1,
    titulo: "Economia brasileira cresce 2,5% no terceiro trimestre",
    resumo: "PIB supera expectativas dos analistas e mostra sinais de recuperação sustentável",
    conteudo: `A economia brasileira registrou crescimento de 2,5% no terceiro trimestre de 2024, superando as expectativas dos analistas que projetavam alta de 1,8%. O resultado representa a maior expansão trimestral dos últimos dois anos e indica sinais consistentes de recuperação econômica.

O crescimento foi impulsionado principalmente pelo setor de serviços, que avançou 3,1%, seguido pela indústria com alta de 2,3%. O agronegócio também contribuiu positivamente, registrando expansão de 1,9% no período.

Segundo o Instituto Brasileiro de Geografia e Estatística (IBGE), o consumo das famílias foi o principal motor do crescimento, com alta de 2,8%. Os investimentos empresariais também mostraram recuperação, crescendo 4,2% no trimestre.

O ministro da Economia destacou que os resultados refletem a eficácia das políticas econômicas implementadas pelo governo. "Estamos vendo uma recuperação sustentável e equilibrada da economia brasileira", afirmou em coletiva de imprensa.

Os analistas do mercado financeiro revisaram suas projeções para o PIB anual, elevando a expectativa de crescimento de 1,5% para 2,1%. A inflação permanece controlada, o que permite ao Banco Central manter a política monetária acomodatícia.

Para o próximo trimestre, as expectativas são otimistas, com projeções de crescimento entre 1,8% e 2,2%. O cenário externo favorável e a melhora dos indicadores de emprego sustentam as perspectivas positivas para a economia brasileira.`,
    imagem_url: "/placeholder.svg?height=400&width=800",
    data: new Date("2024-01-15"),
    categoria: "Economia",
  },
  {
    id: 2,
    titulo: "Nova tecnologia promete revolucionar energia solar",
    resumo: "Pesquisadores desenvolvem células fotovoltaicas com eficiência 40% maior",
    conteudo: `Pesquisadores da Universidade Federal de São Paulo desenvolveram uma nova tecnologia de células fotovoltaicas que promete revolucionar o setor de energia solar no Brasil. A inovação permite um aumento de 40% na eficiência de conversão da luz solar em energia elétrica.

A tecnologia utiliza materiais nanoestruturados que capturam uma faixa mais ampla do espectro solar, incluindo radiação infravermelha que tradicionalmente era desperdiçada. O processo de fabricação também é mais sustentável, utilizando 60% menos materiais tóxicos.

Os testes realizados em laboratório mostraram que as novas células mantêm alta eficiência mesmo em condições de baixa luminosidade, um avanço significativo para regiões com menor incidência solar. A durabilidade também foi aprimorada, com vida útil estimada em 30 anos.

O projeto recebeu investimento de R$ 15 milhões de agências de fomento e empresas privadas. A previsão é que a tecnologia esteja disponível comercialmente em 18 meses, inicialmente para projetos de grande escala.

Segundo o coordenador da pesquisa, a inovação pode reduzir o custo da energia solar em até 25%, tornando-a ainda mais competitiva em relação às fontes tradicionais. "Esta tecnologia pode acelerar significativamente a transição energética no país", destacou.

O Brasil possui um dos maiores potenciais solares do mundo, e avanços como este são fundamentais para consolidar o país como líder em energias renováveis na América Latina.`,
    imagem_url: "/placeholder.svg?height=400&width=800",
    data: new Date("2024-01-14"),
    categoria: "Tecnologia",
  },
]

const anuncios = [
  {
    id: 1,
    imagem_url: "/placeholder.svg?height=100&width=728",
    link: "#",
    titulo: "Patrocinador Premium",
  },
  {
    id: 2,
    imagem_url: "/placeholder.svg?height=250&width=300",
    link: "#",
    titulo: "Anúncio Lateral",
  },
]

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const noticia = noticias.find((n) => n.id === Number.parseInt(id))

  if (!noticia) {
    notFound()
  }

  // Dividir o conteúdo em parágrafos para inserir anúncios
  const paragrafos = noticia.conteudo.split("\n\n")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho da notícia */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">{noticia.categoria}</span>
            <span className="text-gray-500">
              {formatDistanceToNow(noticia.data, {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{noticia.titulo}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{noticia.resumo}</p>
        </header>

        {/* Imagem principal */}
        <div className="mb-8">
          <Image
            src={noticia.imagem_url || "/placeholder.svg"}
            alt={noticia.titulo}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>

        {/* Anúncio banner superior */}
        <div className="mb-8">
          <AdBanner
            imageUrl={anuncios[0].imagem_url}
            link={anuncios[0].link}
            title={anuncios[0].titulo}
            className="w-full"
          />
        </div>

        {/* Conteúdo da notícia */}
        <div className="flex flex-col lg:flex-row gap-8">
          <article className="lg:w-2/3">
            <div className="prose prose-lg max-w-none">
              {paragrafos.map((paragrafo, index) => (
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
                    imageUrl={anuncios[1].imagem_url}
                    link={anuncios[1].link}
                    title={anuncios[1].titulo}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-gray-900">Mais Lidas</h3>
                  <div className="space-y-3">
                    {noticias.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex gap-3">
                        <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 leading-tight">{item.titulo}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

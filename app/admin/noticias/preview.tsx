import Image from "next/image"
import { useEffect, useState } from "react"

interface NoticiaPreview {
  titulo?: string;
  resumo?: string;
  conteudo?: string;
  categoria?: string;
  imagem_url?: string;
  status?: string;
  autor?: string;
}

export default function PreviewNoticiaAdmin() {
  const [noticia, setNoticia] = useState<NoticiaPreview | null>(null)

  useEffect(() => {
    // Lê os dados do formulário do localStorage
    const data = localStorage.getItem("noticia-preview")
    if (data) {
      setNoticia(JSON.parse(data))
    }
  }, [])

  if (!noticia) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Prévia da Notícia</h1>
        <p className="mb-4">Clique em <b>Visualizar</b> no formulário de edição/criação para atualizar esta prévia.</p>
        <p className="text-gray-500">Nenhuma notícia carregada ainda.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded mr-2">{noticia.categoria || 'Sem categoria'}</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{noticia.titulo}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{noticia.resumo}</p>
        </header>
        {noticia.imagem_url && (
          <div className="mb-8">
            <Image
              src={noticia.imagem_url}
              alt={noticia.titulo || "Imagem da notícia"}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}
        <article>
          <div className="prose prose-lg max-w-none">
            {noticia.conteudo?.split("\n\n").map((paragrafo: string, idx: number) => (
              <p key={idx} className="text-gray-800 leading-relaxed mb-6 text-justify">{paragrafo}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
} 
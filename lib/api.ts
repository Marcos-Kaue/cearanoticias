import { Noticia, Patrocinador } from "@/lib/types"

// Busca notícias publicadas
export async function getNoticias(baseUrl: string): Promise<Noticia[]> {
  try {
    const res = await fetch(`${baseUrl}/api/noticias?status=publicado`, {
      next: { revalidate: 60 },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
    if (!res.ok) {
      console.error('Falha ao buscar notícias:', res.status, res.statusText)
      return []
    }
    const data = await res.json()
    // Garante que só retorna notícias publicadas
    const noticiasPublicadas = data.filter((noticia: Noticia) => noticia.status === 'publicado')
    return noticiasPublicadas
  } catch (error) {
    console.error('Ocorreu um erro ao buscar notícias:', error)
    return []
  }
}

// Busca patrocinadores ativos
export async function getPatrocinadores(baseUrl: string): Promise<Patrocinador[]> {
  try {
    const res = await fetch(`${baseUrl}/api/patrocinadores?ativo=true`, {
      next: { revalidate: 60 },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
    if (!res.ok) {
      console.error('Falha ao buscar patrocinadores:', res.status, res.statusText)
      return []
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar patrocinadores:', error)
    return []
  }
}

// Busca notícias publicadas por categoria
export async function getNoticiasPorCategoria(baseUrl: string, categoria: string): Promise<Noticia[]> {
  try {
    const categoriaMap: Record<string, string> = {
      politica: "Política",
      economia: "Economia",
      esportes: "Esportes",
      tecnologia: "Tecnologia",
      saude: "Saúde",
    }
    const categoriaDecodificada = categoriaMap[categoria.toLowerCase()] || categoria
    const res = await fetch(
      `${baseUrl}/api/noticias?status=publicado&categoria=${categoriaDecodificada}`,
      {
        next: { revalidate: 60 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    )
    if (!res.ok) {
      console.error("Falha ao buscar notícias:", res.statusText)
      return []
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Ocorreu um erro ao buscar notícias:", error)
    return []
  }
}

// Busca uma notícia específica por ID
export async function getNoticia(baseUrl: string, id: string): Promise<Noticia | null> {
  try {
    const res = await fetch(`${baseUrl}/api/noticias/${id}`, {
      next: { revalidate: 30 }, // Cache mais curto para dados atualizados
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
    if (!res.ok) {
      console.error("Falha ao buscar notícia:", res.statusText)
      return null
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Ocorreu um erro ao buscar notícia:", error)
    return null
  }
} 
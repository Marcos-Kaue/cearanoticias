import { getNoticia } from "@/lib/api"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const noticia = await getNoticia(baseUrl, params.id)
  if (!noticia) return { title: 'Notícia não encontrada' }
  return {
    title: noticia.titulo,
    description: noticia.resumo,
  }
} 
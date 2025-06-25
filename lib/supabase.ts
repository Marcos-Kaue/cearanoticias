import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
)
// Tipos para as tabelas
export interface Noticia {
  id?: number
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  imagem_url: string
  status: 'rascunho' | 'publicado' | 'arquivado'
  autor: string
  visualizacoes: number
  created_at?: string
  updated_at?: string
}

export interface Patrocinador {
  id?: number
  nome: string
  logo_url: string
  link_site: string
  ativo: boolean
  ordem_exibicao: number
  created_at?: string
  updated_at?: string
} 
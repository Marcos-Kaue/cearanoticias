// Script para verificar notícias no banco de dados
const { createClient } = require('@supabase/supabase-js')

async function checkNoticias() {
  console.log('🔍 Verificando notícias no banco de dados...')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Variáveis do Supabase não configuradas')
    return
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Buscar todas as notícias
    console.log('\n📰 Buscando todas as notícias...')
    const { data: todas, error: todasError } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (todasError) {
      console.error('❌ Erro ao buscar notícias:', todasError)
      return
    }
    
    console.log(`✅ Total de notícias encontradas: ${todas?.length || 0}`)
    
    if (todas && todas.length > 0) {
      // Contar por status
      const porStatus = todas.reduce((acc, n) => {
        acc[n.status] = (acc[n.status] || 0) + 1
        return acc
      }, {})
      
      console.log('\n📊 Distribuição por status:')
      Object.entries(porStatus).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} notícias`)
      })
      
      // Mostrar detalhes das últimas 5 notícias
      console.log('\n📋 Últimas 5 notícias:')
      todas.slice(0, 5).forEach((noticia, idx) => {
        console.log(`\n${idx + 1}. ${noticia.titulo}`)
        console.log(`   ID: ${noticia.id}`)
        console.log(`   Status: ${noticia.status}`)
        console.log(`   Categoria: ${noticia.categoria}`)
        console.log(`   Autor: ${noticia.autor}`)
        console.log(`   Criada em: ${noticia.created_at}`)
        console.log(`   Visualizações: ${noticia.visualizacoes || 0}`)
      })
      
      // Verificar notícias publicadas
      const publicadas = todas.filter(n => n.status === 'publicado')
      console.log(`\n✅ Notícias publicadas: ${publicadas.length}`)
      
      if (publicadas.length === 0) {
        console.log('⚠️  Nenhuma notícia está publicada!')
        console.log('💡 Para publicar uma notícia, altere o status para "publicado"')
      }
      
    } else {
      console.log('⚠️  Nenhuma notícia encontrada no banco de dados')
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkNoticias()
}

module.exports = { checkNoticias } 
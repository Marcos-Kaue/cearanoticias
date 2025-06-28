// Script para debugar problemas na Vercel
const { createClient } = require('@supabase/supabase-js')

async function debugVercel() {
  console.log('🔍 Debugando configuração da Vercel...')
  
  // Verificar variáveis de ambiente
  console.log('\n📋 Variáveis de Ambiente:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada')
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || '❌ Não configurada')
  
  // Testar conexão com Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('\n🔗 Testando conexão com Supabase...')
    
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      // Testar busca de notícias
      const { data: noticias, error: noticiasError } = await supabase
        .from('noticias')
        .select('*')
        .eq('status', 'publicado')
        .limit(5)
      
      if (noticiasError) {
        console.error('❌ Erro ao buscar notícias:', noticiasError)
      } else {
        console.log(`✅ Encontradas ${noticias?.length || 0} notícias publicadas`)
        if (noticias && noticias.length > 0) {
          console.log('📰 Primeira notícia:', {
            id: noticias[0].id,
            titulo: noticias[0].titulo,
            status: noticias[0].status,
            created_at: noticias[0].created_at
          })
        }
      }
      
      // Testar busca de todas as notícias
      const { data: todas, error: todasError } = await supabase
        .from('noticias')
        .select('*')
        .limit(10)
      
      if (todasError) {
        console.error('❌ Erro ao buscar todas as notícias:', todasError)
      } else {
        console.log(`✅ Total de notícias no banco: ${todas?.length || 0}`)
        
        // Contar por status
        const porStatus = todas?.reduce((acc, n) => {
          acc[n.status] = (acc[n.status] || 0) + 1
          return acc
        }, {}) || {}
        
        console.log('📊 Distribuição por status:', porStatus)
      }
      
    } catch (error) {
      console.error('❌ Erro na conexão com Supabase:', error)
    }
  } else {
    console.log('❌ Variáveis do Supabase não configuradas')
  }
  
  // Testar API local
  console.log('\n🌐 Testando API local...')
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    console.log('URL base:', baseUrl)
    
    const response = await fetch(`${baseUrl}/api/noticias?status=publicado`)
    console.log('Status da resposta:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ API retornou ${data?.length || 0} notícias`)
    } else {
      console.log('❌ API retornou erro:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Erro ao testar API:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  debugVercel()
}

module.exports = { debugVercel } 
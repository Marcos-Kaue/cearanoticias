// Script para testar a API de notícias
const testAPI = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  console.log('🧪 Testando API de notícias...')
  console.log('URL base:', baseUrl)
  
  try {
    // Teste 1: Buscar notícias publicadas
    console.log('\n📰 Testando busca de notícias publicadas...')
    const noticiasRes = await fetch(`${baseUrl}/api/noticias?status=publicado`)
    
    if (!noticiasRes.ok) {
      console.error('❌ Erro ao buscar notícias:', noticiasRes.status, noticiasRes.statusText)
      return
    }
    
    const noticias = await noticiasRes.json()
    console.log(`✅ Encontradas ${noticias.length} notícias publicadas`)
    
    if (noticias.length > 0) {
      console.log('📋 Primeira notícia:', {
        id: noticias[0].id,
        titulo: noticias[0].titulo,
        status: noticias[0].status,
        created_at: noticias[0].created_at
      })
    }
    
    // Teste 2: Buscar todas as notícias
    console.log('\n📰 Testando busca de todas as notícias...')
    const todasRes = await fetch(`${baseUrl}/api/noticias?status=todos`)
    
    if (todasRes.ok) {
      const todas = await todasRes.json()
      console.log(`✅ Encontradas ${todas.length} notícias no total`)
      
      // Contar por status
      const porStatus = todas.reduce((acc, n) => {
        acc[n.status] = (acc[n.status] || 0) + 1
        return acc
      }, {})
      
      console.log('📊 Distribuição por status:', porStatus)
    }
    
    // Teste 3: Buscar patrocinadores
    console.log('\n🏢 Testando busca de patrocinadores...')
    const patrocinadoresRes = await fetch(`${baseUrl}/api/patrocinadores?ativo=true`)
    
    if (patrocinadoresRes.ok) {
      const patrocinadores = await patrocinadoresRes.json()
      console.log(`✅ Encontrados ${patrocinadores.length} patrocinadores ativos`)
    }
    
    console.log('\n🎉 Todos os testes concluídos!')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error)
  }
}

// Executar se chamado diretamente
if (typeof window === 'undefined') {
  testAPI()
}

module.exports = { testAPI } 
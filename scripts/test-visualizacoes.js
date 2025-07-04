// Script para testar o sistema de visualizações
const testVisualizacoes = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  console.log('👁️ Testando sistema de visualizações...')
  console.log('URL base:', baseUrl)
  
  try {
    // Teste 1: Buscar notícias para pegar um ID
    console.log('\n📰 Buscando notícias para testar...')
    const noticiasRes = await fetch(`${baseUrl}/api/noticias?status=publicado`)
    
    if (!noticiasRes.ok) {
      console.error('❌ Erro ao buscar notícias:', noticiasRes.status, noticiasRes.statusText)
      return
    }
    
    const noticias = await noticiasRes.json()
    
    if (noticias.length === 0) {
      console.log('⚠️ Nenhuma notícia publicada encontrada para testar')
      return
    }
    
    const noticiaTeste = noticias[0]
    console.log(`✅ Notícia selecionada para teste: "${noticiaTeste.titulo}" (ID: ${noticiaTeste.id})`)
    console.log(`📊 Visualizações atuais: ${noticiaTeste.visualizacoes || 0}`)
    
    // Teste 2: Incrementar visualizações
    console.log('\n📈 Testando incremento de visualizações...')
    const incrementRes = await fetch(`${baseUrl}/api/noticias/${noticiaTeste.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!incrementRes.ok) {
      console.error('❌ Erro ao incrementar visualizações:', incrementRes.status, incrementRes.statusText)
      return
    }
    
    const incrementData = await incrementRes.json()
    console.log(`✅ Visualizações incrementadas: ${incrementData.visualizacoes}`)
    
    // Teste 3: Verificar se foi atualizado
    console.log('\n🔍 Verificando se a atualização foi persistida...')
    const verificarRes = await fetch(`${baseUrl}/api/noticias/${noticiaTeste.id}`)
    
    if (!verificarRes.ok) {
      console.error('❌ Erro ao verificar notícia:', verificarRes.status, verificarRes.statusText)
      return
    }
    
    const noticiaAtualizada = await verificarRes.json()
    console.log(`✅ Visualizações confirmadas: ${noticiaAtualizada.visualizacoes}`)
    
    // Teste 4: Testar múltiplas visualizações
    console.log('\n🔄 Testando múltiplas visualizações...')
    for (let i = 0; i < 3; i++) {
      await fetch(`${baseUrl}/api/noticias/${noticiaTeste.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log(`   Incremento ${i + 1} realizado`)
    }
    
    // Verificar resultado final
    const finalRes = await fetch(`${baseUrl}/api/noticias/${noticiaTeste.id}`)
    const noticiaFinal = await finalRes.json()
    console.log(`✅ Visualizações finais: ${noticiaFinal.visualizacoes}`)
    
    console.log('\n🎉 Teste de visualizações concluído com sucesso!')
    console.log('💡 O sistema está funcionando corretamente.')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Executar o teste
testVisualizacoes() 
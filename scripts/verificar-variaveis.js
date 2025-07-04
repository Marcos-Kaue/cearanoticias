// Script para verificar variáveis de ambiente
const verificarVariaveis = () => {
  console.log('🔍 Verificando variáveis de ambiente...')
  
  const variaveis = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL
  }
  
  let todasConfiguradas = true
  
  Object.entries(variaveis).forEach(([nome, valor]) => {
    if (valor) {
      console.log(`✅ ${nome}: ${valor.substring(0, 20)}...`)
    } else {
      console.log(`❌ ${nome}: NÃO CONFIGURADA`)
      todasConfiguradas = false
    }
  })
  
  if (todasConfiguradas) {
    console.log('\n🎉 Todas as variáveis estão configuradas!')
    console.log('💡 O site deve funcionar corretamente.')
  } else {
    console.log('\n⚠️ Algumas variáveis não estão configuradas!')
    console.log('📝 Configure as variáveis na Vercel:')
    console.log('   Settings > Environment Variables')
    console.log('\n🔗 Obtenha as credenciais do Supabase em:')
    console.log('   https://supabase.com/dashboard/project/_/settings/api')
  }
  
  return todasConfiguradas
}

verificarVariaveis() 
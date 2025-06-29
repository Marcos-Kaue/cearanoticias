const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente do .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  }
}

loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testBuckets() {
  console.log('🔍 Testando buckets do Supabase...\n')

  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Variáveis de ambiente não encontradas!')
    console.log('💡 Verifique se o arquivo .env.local existe e contém:')
    console.log('   NEXT_PUBLIC_SUPABASE_URL=sua-url')
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave')
    return
  }

  console.log('✅ Variáveis de ambiente configuradas')
  console.log('🔗 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  try {
    // 1. Verificar se os buckets existem
    console.log('\n1️⃣ Verificando buckets existentes...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError)
      return
    }

    console.log('📦 Buckets encontrados:')
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'público' : 'privado'})`)
    })

    // 2. Verificar bucket 'imagens'
    console.log('\n2️⃣ Testando bucket "imagens"...')
    const { data: imagensFiles, error: imagensError } = await supabase.storage
      .from('imagens')
      .list()

    if (imagensError) {
      console.log('❌ Erro no bucket "imagens":', imagensError.message)
      console.log('💡 Dica: Verifique se o bucket foi criado e as políticas configuradas')
    } else {
      console.log('✅ Bucket "imagens" funcionando!')
      console.log(`   Arquivos: ${imagensFiles?.length || 0}`)
    }

    // 3. Verificar bucket 'imagenspublicas'
    console.log('\n3️⃣ Testando bucket "imagenspublicas"...')
    const { data: publicasFiles, error: publicasError } = await supabase.storage
      .from('imagenspublicas')
      .list()

    if (publicasError) {
      console.log('❌ Erro no bucket "imagenspublicas":', publicasError.message)
      console.log('💡 Dica: Verifique se o bucket foi criado e as políticas configuradas')
    } else {
      console.log('✅ Bucket "imagenspublicas" funcionando!')
      console.log(`   Arquivos: ${publicasFiles?.length || 0}`)
    }

    // 4. Testar upload simulado (sem arquivo real)
    console.log('\n4️⃣ Testando permissões de upload...')
    
    // Teste para bucket imagens (deve falhar sem autenticação)
    const { error: uploadImagensError } = await supabase.storage
      .from('imagens')
      .upload('test-file.txt', 'test content')

    if (uploadImagensError) {
      console.log('✅ Bucket "imagens" protegido corretamente (upload negado sem auth)')
    } else {
      console.log('⚠️  Bucket "imagens" pode estar muito permissivo')
    }

    // Teste para bucket imagenspublicas (deve funcionar)
    const { error: uploadPublicasError } = await supabase.storage
      .from('imagenspublicas')
      .upload('test-file.txt', 'test content')

    if (uploadPublicasError) {
      console.log('❌ Bucket "imagenspublicas" não permite upload:', uploadPublicasError.message)
    } else {
      console.log('✅ Bucket "imagenspublicas" permite upload público')
      
      // Limpar arquivo de teste
      await supabase.storage
        .from('imagenspublicas')
        .remove(['test-file.txt'])
    }

    console.log('\n🎯 Resumo:')
    console.log('   - Bucket "imagens": Para uploads do painel administrativo')
    console.log('   - Bucket "imagenspublicas": Para uploads dos usuários')
    console.log('\n📋 Próximos passos:')
    console.log('   1. Configure os buckets no Supabase Dashboard')
    console.log('   2. Configure as políticas RLS')
    console.log('   3. Teste o formulário de envio de notícias')

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar teste
testBuckets() 
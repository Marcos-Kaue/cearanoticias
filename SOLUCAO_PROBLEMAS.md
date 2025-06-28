# 🔧 Solução de Problemas - Painel Administrativo

## 🚨 **Erros Comuns e Soluções**

### 1. **Erro: "Conexão com Supabase falhou"**

**Sintomas:**
- Painel de debug mostra erro vermelho
- Não consegue carregar notícias/patrocinadores
- Erro 500 nas APIs

**Soluções:**
1. **Verificar variáveis de ambiente:**
   ```bash
   # Verifique se o arquivo .env.local existe e tem:
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

2. **Verificar se as tabelas existem:**
   - Acesse o Supabase Dashboard
   - Vá em **Table Editor**
   - Verifique se existem as tabelas `noticias` e `patrocinadores`

3. **Criar tabelas se não existirem:**
   ```sql
   -- Cole no SQL Editor do Supabase
   CREATE TABLE noticias (
     id SERIAL PRIMARY KEY,
     titulo VARCHAR(255) NOT NULL,
     resumo TEXT,
     conteudo TEXT NOT NULL,
     categoria VARCHAR(100) NOT NULL,
     imagem_url TEXT,
     status VARCHAR(20) DEFAULT 'rascunho',
     autor VARCHAR(100) NOT NULL,
     visualizacoes INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE patrocinadores (
     id SERIAL PRIMARY KEY,
     nome VARCHAR(255) NOT NULL,
     logo_url TEXT NOT NULL,
     link_site TEXT NOT NULL,
     ativo BOOLEAN DEFAULT true,
     ordem_exibicao INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### 2. **Erro: "Não é possível localizar o módulo"**

**Sintomas:**
- Erros de TypeScript no console
- Módulos não encontrados

**Soluções:**
1. **Reinstalar dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

2. **Verificar se o Supabase foi instalado:**
   ```bash
   npm install @supabase/supabase-js
   ```

### 3. **Erro: "Erro ao salvar notícia/patrocinador"**

**Sintomas:**
- Formulário não salva
- Erro 500 ao tentar criar

**Soluções:**
1. **Verificar console do navegador (F12):**
   - Veja se há erros específicos
   - Verifique a resposta da API

2. **Testar API diretamente:**
   ```bash
   # Teste a API de notícias
   curl -X POST http://localhost:3000/api/noticias \
     -H "Content-Type: application/json" \
     -d '{"titulo":"Teste","conteudo":"Teste","categoria":"Teste","autor":"Admin"}'
   ```

3. **Verificar permissões no Supabase:**
   - Vá em **Authentication** → **Policies**
   - Verifique se as tabelas têm políticas de acesso

### 4. **Erro: "Página não encontrada"**

**Sintomas:**
- Erro 404 ao acessar `/admin`
- Rotas não funcionam

**Soluções:**
1. **Verificar se o servidor está rodando:**
   ```bash
   npm run dev
   ```

2. **Verificar se as rotas existem:**
   - `/admin` - Dashboard principal
   - `/admin/noticias` - Gerenciar notícias
   - `/admin/patrocinadores` - Gerenciar patrocinadores

### 5. **Erro: "Carregando..." infinito**

**Sintomas:**
- Loading eterno nas listagens
- Dados não carregam

**Soluções:**
1. **Verificar conexão com internet**
2. **Verificar se o Supabase está online**
3. **Verificar console do navegador para erros**

## 🛠️ **Ferramentas de Debug**

### **Painel de Debug**
- Acesse `/admin` para ver o painel de debug
- Mostra status da conexão com Supabase
- Permite testar conexão novamente

### **Console do Navegador**
- Pressione F12
- Vá na aba "Console"
- Veja erros detalhados

### **APIs de Teste**
- `GET /api/test` - Testa conexão com Supabase
- `GET /api/noticias` - Lista notícias
- `GET /api/patrocinadores` - Lista patrocinadores

## 📞 **Suporte**

Se ainda tiver problemas:

1. **Verifique o painel de debug** em `/admin`
2. **Consulte o console** do navegador (F12)
3. **Teste as APIs** diretamente
4. **Verifique as variáveis** de ambiente
5. **Confirme as tabelas** no Supabase

## ✅ **Checklist de Verificação**

- [ ] Arquivo `.env.local` existe e está correto
- [ ] Tabelas `noticias` e `patrocinadores` existem no Supabase
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Painel de debug mostra "sucesso"
- [ ] APIs respondem corretamente

**Se todos os itens estiverem marcados, o painel deve funcionar perfeitamente!** 🚀

# 🔧 Solução para Problemas Atuais

## Problema 1: Notícias não aparecem na Vercel

### ✅ Correções Implementadas:

1. **Configuração do Next.js** (`next.config.mjs`)
   - Adicionados headers para evitar cache
   - Configuração para pacotes externos do Supabase

2. **API de Notícias** (`app/api/noticias/route.ts`)
   - Logs detalhados para debug
   - Headers para evitar cache
   - Melhor tratamento de erros

3. **Página Principal** (`app/(site)/page.tsx`)
   - Filtro explícito por status "publicado"
   - Logs para debug
   - Headers para evitar cache

### 🔍 Como Verificar:

1. **Execute o script de debug:**
   ```bash
   npm run debug:vercel
   ```

2. **Verifique as variáveis de ambiente na Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

3. **Teste a API diretamente:**
   ```
   https://seu-dominio.vercel.app/api/noticias?status=publicado
   ```

### 🚨 Possíveis Causas:

1. **Variáveis de ambiente não configuradas**
2. **Notícias com status incorreto**
3. **Cache do Next.js**
4. **Problema de conexão com Supabase**

## Problema 2: Prévia no Admin não funciona

### ✅ Correções Implementadas:

1. **Botão Visualizar** adicionado ao formulário de nova notícia
2. **Página de prévia melhorada** com:
   - Loading state
   - Botões de ação
   - Melhor tratamento de erros
   - Debug logs

### 🔍 Como Testar:

1. **Acesse:** `/admin/noticias/nova`
2. **Preencha:** título e conteúdo
3. **Clique:** botão "Visualizar"
4. **Verifique:** nova aba com prévia

### 🚨 Se ainda não funcionar:

1. **Abra o console do navegador** (F12)
2. **Verifique se há erros**
3. **Teste o localStorage:**
   ```javascript
   localStorage.getItem("noticia-preview")
   ```

## 📋 Checklist de Verificação

### Para o Problema da Vercel:
- [ ] Variáveis de ambiente configuradas
- [ ] Novo deploy realizado
- [ ] API retorna dados
- [ ] Logs não mostram erros
- [ ] Notícias têm status "publicado"

### Para o Problema da Prévia:
- [ ] Botão "Visualizar" aparece
- [ ] localStorage funciona
- [ ] Nova aba abre
- [ ] Dados aparecem na prévia

## 🛠️ Comandos Úteis

```bash
# Debug local
npm run debug:vercel

# Teste da API
npm run test:api

# Build para produção
npm run build

# Deploy na Vercel
vercel --prod
```

## 📞 Próximos Passos

1. **Configure as variáveis na Vercel**
2. **Faça um novo deploy**
3. **Teste a API diretamente**
4. **Verifique os logs da Vercel**
5. **Teste a prévia no admin**

Se os problemas persistirem, verifique os logs da Vercel e me informe o que aparece! 
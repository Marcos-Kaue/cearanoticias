# 🚀 Configuração do Supabase - Ceará No Grau

## 📋 Passos para Conectar o Painel Administrativo

### 1. Criar Conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta
4. Clique em "New Project"

### 2. Configurar o Projeto
1. **Nome do Projeto:** `ceara-no-grau`
2. **Database Password:** Crie uma senha forte
3. **Region:** Escolha a região mais próxima (ex: São Paulo)
4. Clique em "Create new project"

### 3. Obter as Credenciais
1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Configurar Variáveis de Ambiente
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 5. Criar as Tabelas no Supabase

#### Tabela `noticias`:
```sql
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
```

#### Tabela `patrocinadores`:
```sql
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

### 6. Executar no SQL Editor do Supabase
1. No dashboard, vá em **SQL Editor**
2. Cole o código SQL acima
3. Clique em **Run**

### 7. Testar a Conexão
1. Rode o projeto: `npm run dev`
2. Acesse: `http://localhost:3000/admin`
3. Tente criar uma notícia ou patrocinador

## ✅ Funcionalidades Implementadas

### 📰 **Gerenciamento de Notícias:**
- ✅ Criar nova notícia
- ✅ Editar notícia existente
- ✅ Deletar notícia
- ✅ Listar todas as notícias
- ✅ Filtrar por status (rascunho/publicado/arquivado)
- ✅ Buscar por título
- ✅ Contador de visualizações

### 🏢 **Gerenciamento de Patrocinadores:**
- ✅ Adicionar novo patrocinador
- ✅ Editar patrocinador existente
- ✅ Deletar patrocinador
- ✅ Ativar/desativar patrocinador
- ✅ Ordenar patrocinadores
- ✅ Carrossel automático no rodapé

### 🔧 **APIs Criadas:**
- `GET /api/noticias` - Listar notícias
- `POST /api/noticias` - Criar notícia
- `GET /api/noticias/[id]` - Buscar notícia
- `PUT /api/noticias/[id]` - Atualizar notícia
- `DELETE /api/noticias/[id]` - Deletar notícia
- `GET /api/patrocinadores` - Listar patrocinadores
- `POST /api/patrocinadores` - Criar patrocinador
- `PUT /api/patrocinadores/[id]` - Atualizar patrocinador
- `DELETE /api/patrocinadores/[id]` - Deletar patrocinador

## 🎯 Próximos Passos

1. **Configurar autenticação** para o painel admin
2. **Implementar upload de imagens** para o Supabase Storage
3. **Adicionar validação** de formulários
4. **Criar sistema de categorias** dinâmico
5. **Implementar SEO** para as notícias

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se as tabelas foram criadas no Supabase
3. Verifique o console do navegador para erros
4. Teste as APIs diretamente no Supabase Dashboard 
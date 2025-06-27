# 🔍 VERIFICAÇÃO DE NOTÍCIAS ENVIADAS

## 📋 Problemas Comuns e Soluções

### 1. **Tabela não existe**
Execute no SQL Editor do Supabase:

```sql
-- Criar tabela noticias_enviadas
CREATE TABLE IF NOT EXISTS noticias_enviadas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  imagem_url TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. **Políticas RLS bloqueando inserção**
Execute no SQL Editor:

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE noticias_enviadas DISABLE ROW LEVEL SECURITY;

-- Ou criar políticas adequadas
CREATE POLICY "Permitir inserção pública" ON noticias_enviadas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem ler" ON noticias_enviadas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar" ON noticias_enviadas
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 3. **Bucket de imagens não existe**
Execute no SQL Editor:

```sql
-- Verificar se o bucket existe
SELECT * FROM storage.buckets WHERE name = 'imagenspublicas';

-- Se não existir, criar via interface do Supabase
-- Vá para Storage → New Bucket → Nome: imagenspublicas → Public
```

### 4. **Políticas do Storage**
Execute no SQL Editor:

```sql
-- Política para permitir upload público
CREATE POLICY "Upload público" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagenspublicas');

-- Política para permitir leitura pública
CREATE POLICY "Leitura pública" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagenspublicas');
```

## 🔧 Teste Manual

1. **Acesse:** http://localhost:3001/envie-sua-noticia
2. **Preencha o formulário**
3. **Abra o console do navegador** (F12)
4. **Tente enviar**
5. **Verifique os logs de erro**

## 📞 Logs para Verificar

- **Console do navegador:** Erros de JavaScript
- **Network tab:** Resposta da API
- **Supabase Logs:** Authentication → Logs
- **Database Logs:** SQL Editor → Logs

## 🚨 Erros Comuns

- **"Erro ao fazer upload da imagem"** → Problema no bucket/políticas
- **"Erro ao receber notícia"** → Problema na tabela/políticas RLS
- **"Network error"** → Problema de conexão com Supabase 
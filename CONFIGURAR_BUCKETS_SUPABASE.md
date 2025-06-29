# 🗂️ Configuração dos Buckets do Supabase - Ceará No Grau

## 📋 **Buckets Necessários**

O projeto utiliza **2 buckets diferentes** no Supabase Storage:

### 1. **Bucket `imagens`** 
- **Uso:** Imagens do painel administrativo (notícias e patrocinadores)
- **Acesso:** Apenas administradores

### 2. **Bucket `imagenspublicas`**
- **Uso:** Imagens enviadas pelos usuários através do formulário "Envie sua notícia"
- **Acesso:** Público (qualquer pessoa pode enviar)

---

## 🚀 **Como Configurar os Buckets**

### **Passo 1: Acessar o Supabase Dashboard**

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto `ceara-no-grau`

### **Passo 2: Criar o Bucket `imagens`**

1. No menu lateral, clique em **Storage**
2. Clique em **New Bucket**
3. Configure:
   - **Name:** `imagens`
   - **Public bucket:** ❌ **DESMARCADO** (privado)
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/*`
4. Clique em **Create bucket**

### **Passo 3: Criar o Bucket `imagenspublicas`**

1. Clique em **New Bucket** novamente
2. Configure:
   - **Name:** `imagenspublicas`
   - **Public bucket:** ✅ **MARCADO** (público)
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/*`
4. Clique em **Create bucket**

---

## 🔐 **Configurar Políticas de Acesso**

### **Para o Bucket `imagens` (Privado)**

Execute no **SQL Editor** do Supabase:

```sql
-- Política para permitir upload apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'imagens' 
        AND auth.role() = 'authenticated'
    );

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'imagens' 
        AND auth.role() = 'authenticated'
    );

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'imagens' 
        AND auth.role() = 'authenticated'
    );
```

### **Para o Bucket `imagenspublicas` (Público)**

Execute no **SQL Editor** do Supabase:

```sql
-- Política para permitir upload público
CREATE POLICY "Upload público" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagenspublicas');

-- Política para permitir leitura pública
CREATE POLICY "Leitura pública" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagenspublicas');

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar imagens públicas" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'imagenspublicas' 
        AND auth.role() = 'authenticated'
    );
```

---

## 🧪 **Como Testar**

### **Teste 1: Upload pelo Painel Administrativo**

1. Acesse: `http://localhost:3000/admin/noticias/nova`
2. Preencha o formulário
3. Faça upload de uma imagem
4. Verifique se a imagem aparece no bucket `imagens`

### **Teste 2: Upload pelo Formulário Público**

1. Acesse: `http://localhost:3000/envie-sua-noticia`
2. Preencha o formulário
3. Faça upload de uma imagem
4. Verifique se a imagem aparece no bucket `imagenspublicas`

---

## 🔍 **Verificar se os Buckets Existem**

Execute no **SQL Editor** para verificar:

```sql
-- Verificar todos os buckets
SELECT * FROM storage.buckets;

-- Verificar arquivos no bucket imagens
SELECT * FROM storage.objects WHERE bucket_id = 'imagens';

-- Verificar arquivos no bucket imagenspublicas
SELECT * FROM storage.objects WHERE bucket_id = 'imagenspublicas';
```

---

## 🚨 **Problemas Comuns**

### **Erro: "Bucket não encontrado"**
- Verifique se o nome do bucket está correto
- Confirme se o bucket foi criado no projeto correto

### **Erro: "Acesso negado"**
- Verifique se as políticas RLS estão configuradas
- Confirme se o bucket está marcado como público/privado corretamente

### **Erro: "Tamanho do arquivo excedido"**
- Verifique o limite configurado no bucket
- Reduza o tamanho da imagem

### **Erro: "Tipo de arquivo não permitido"**
- Verifique se o arquivo é uma imagem
- Confirme os tipos MIME permitidos no bucket

---

## 📱 **Acessar as Imagens**

### **Imagens do Admin (bucket `imagens`)**
```javascript
// URL pública (se configurada)
const url = supabase.storage.from('imagens').getPublicUrl('nome-do-arquivo.jpg')
```

### **Imagens Públicas (bucket `imagenspublicas`)**
```javascript
// URL pública direta
const url = supabase.storage.from('imagenspublicas').getPublicUrl('nome-do-arquivo.jpg')
```

---

## ✅ **Checklist de Verificação**

- [ ] Bucket `imagens` criado (privado)
- [ ] Bucket `imagenspublicas` criado (público)
- [ ] Políticas RLS configuradas para ambos os buckets
- [ ] Upload funcionando no painel administrativo
- [ ] Upload funcionando no formulário público
- [ ] Imagens aparecendo corretamente no site

**Se todos os itens estiverem marcados, o sistema de upload está funcionando perfeitamente!** 🚀

---

## 📞 **Suporte**

Se ainda tiver problemas:

1. **Verifique os logs** no console do navegador (F12)
2. **Confirme as políticas** no SQL Editor
3. **Teste os buckets** diretamente no Supabase Dashboard
4. **Verifique as variáveis** de ambiente

**Lembre-se:** O bucket `imagenspublicas` é onde as imagens enviadas pelos usuários são armazenadas! 📸 
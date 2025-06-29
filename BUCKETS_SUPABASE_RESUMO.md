# 📸 **BUCKETS DO SUPABASE - RESUMO COMPLETO**

## 🎯 **O que são os Buckets?**

Os **buckets** são como "pastas" no Supabase Storage onde você armazena arquivos (imagens, documentos, etc.). O projeto Ceará No Grau usa **2 buckets diferentes**:

---

## 🗂️ **Bucket 1: `imagens`**
- **📁 Nome:** `imagens`
- **🔒 Acesso:** Privado (apenas administradores)
- **📤 Uso:** Imagens das notícias e patrocinadores criados no painel administrativo
- **👥 Quem usa:** Administradores do site

### **Onde é usado:**
- `/admin/noticias/nova` - Upload de imagem da notícia
- `/admin/patrocinadores` - Upload do logo do patrocinador

---

## 🗂️ **Bucket 2: `imagenspublicas`**
- **📁 Nome:** `imagenspublicas`
- **🔓 Acesso:** Público (qualquer pessoa pode enviar)
- **📤 Uso:** Imagens enviadas pelos usuários através do formulário "Envie sua notícia"
- **👥 Quem usa:** Visitantes do site

### **Onde é usado:**
- `/envie-sua-noticia` - Formulário público para envio de notícias

---

## 🚀 **Como Configurar (Passo a Passo)**

### **1. Acessar o Supabase**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login e selecione seu projeto

### **2. Criar o Bucket `imagens`**
1. Clique em **Storage** no menu lateral
2. Clique em **New Bucket**
3. Configure:
   - **Name:** `imagens`
   - **Public bucket:** ❌ **DESMARCADO**
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/*`
4. Clique **Create bucket**

### **3. Criar o Bucket `imagenspublicas`**
1. Clique em **New Bucket** novamente
2. Configure:
   - **Name:** `imagenspublicas`
   - **Public bucket:** ✅ **MARCADO**
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/*`
4. Clique **Create bucket**

### **4. Configurar Políticas (SQL Editor)**

Cole este código no **SQL Editor** do Supabase:

```sql
-- Políticas para bucket 'imagens' (privado)
CREATE POLICY "Usuários autenticados podem fazer upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'imagens' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Usuários autenticados podem ler" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'imagens' 
        AND auth.role() = 'authenticated'
    );

-- Políticas para bucket 'imagenspublicas' (público)
CREATE POLICY "Upload público" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagenspublicas');

CREATE POLICY "Leitura pública" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagenspublicas');
```

---

## 🧪 **Como Testar**

### **Teste Automático:**
```bash
npm run test:buckets
```

### **Teste Manual:**

1. **Teste do Painel Admin:**
   - Acesse: `http://localhost:3000/admin/noticias/nova`
   - Faça upload de uma imagem
   - Verifique se aparece no bucket `imagens`

2. **Teste do Formulário Público:**
   - Acesse: `http://localhost:3000/envie-sua-noticia`
   - Preencha o formulário com uma imagem
   - Verifique se aparece no bucket `imagenspublicas`

---

## 🔍 **Verificar se Está Funcionando**

### **No Supabase Dashboard:**
1. Vá em **Storage**
2. Clique em cada bucket
3. Verifique se os arquivos aparecem

### **No SQL Editor:**
```sql
-- Verificar buckets
SELECT * FROM storage.buckets;

-- Verificar arquivos no bucket imagens
SELECT * FROM storage.objects WHERE bucket_id = 'imagens';

-- Verificar arquivos no bucket imagenspublicas
SELECT * FROM storage.objects WHERE bucket_id = 'imagenspublicas';
```

---

## 🚨 **Problemas Comuns**

### **"Bucket não encontrado"**
- ✅ Verifique se o nome está correto: `imagens` e `imagenspublicas`
- ✅ Confirme se foi criado no projeto correto

### **"Acesso negado"**
- ✅ Verifique se as políticas RLS foram criadas
- ✅ Confirme se o bucket está público/privado corretamente

### **"Erro ao fazer upload"**
- ✅ Verifique o tamanho do arquivo (máximo 5MB)
- ✅ Confirme se é uma imagem (jpg, png, etc.)

---

## 📱 **URLs das Imagens**

### **Imagens do Admin:**
```javascript
// Exemplo de URL
https://seu-projeto.supabase.co/storage/v1/object/public/imagens/nome-do-arquivo.jpg
```

### **Imagens Públicas:**
```javascript
// Exemplo de URL
https://seu-projeto.supabase.co/storage/v1/object/public/imagenspublicas/nome-do-arquivo.jpg
```

---

## ✅ **Checklist Final**

- [ ] Bucket `imagens` criado (privado)
- [ ] Bucket `imagenspublicas` criado (público)
- [ ] Políticas RLS configuradas
- [ ] Upload funcionando no admin
- [ ] Upload funcionando no formulário público
- [ ] Script de teste passando (`npm run test:buckets`)

**🎉 Se tudo estiver marcado, os buckets estão funcionando perfeitamente!**

---

## 💡 **Dica Importante**

O bucket **`imagenspublicas`** é onde as imagens enviadas pelos usuários são armazenadas. É o bucket que você estava perguntando! 📸

**Resumo:** 
- **Admin** → bucket `imagens` (privado)
- **Usuários** → bucket `imagenspublicas` (público) 
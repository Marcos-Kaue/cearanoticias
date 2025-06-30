# 👤 Como Configurar o Nome do Usuário no Supabase

## 🎯 Objetivo
Configurar o nome do usuário para que apareça no painel administrativo ao invés do email.

## 📋 Passos para Configurar

### 1. Acesse o Supabase Dashboard
- Vá para https://supabase.com/dashboard
- Selecione seu projeto

### 2. Navegue até Authentication
- No menu lateral, clique em **Authentication**
- Clique em **Users**

### 3. Edite o Usuário
- Encontre seu usuário na lista
- Clique no usuário para abrir os detalhes

### 4. Configure o User Metadata
- Role até a seção **User Metadata**
- Clique em **Edit** (ícone de lápis)
- Adicione o seguinte JSON:

```json
{
  "name": "Seu Nome Completo"
}
```

**Exemplos:**
```json
{
  "name": "João Silva"
}
```

```json
{
  "name": "Maria Santos"
}
```

### 5. Salve as Alterações
- Clique em **Save** para salvar as alterações

## 🔄 Como Funciona

O sistema tenta obter o nome do usuário na seguinte ordem:

1. **`user_metadata.full_name`** - Nome completo
2. **`user_metadata.name`** - Nome (configurado acima)
3. **`user_metadata.user_name`** - Nome de usuário
4. **Email** - Extrai o nome do email (ex: "joao.silva@gmail.com" → "Joao Silva")
5. **"Usuário"** - Fallback padrão

## 🎨 Exemplos de Resultado

| Configuração | Resultado no Painel |
|--------------|-------------------|
| `"name": "João Silva"` | João Silva |
| `"name": "Maria"` | Maria |
| Sem configuração, email: `joao.silva@gmail.com` | Joao Silva |
| Sem configuração, email: `maria_santos@hotmail.com` | Maria Santos |

## 🚀 Benefícios

- ✅ Interface mais amigável
- ✅ Identificação clara do usuário logado
- ✅ Profissionalismo no painel administrativo
- ✅ Melhor experiência do usuário

## 🔧 Configuração Avançada

### Múltiplos Campos
Você pode configurar múltiplos campos:

```json
{
  "name": "João Silva",
  "full_name": "João da Silva Santos",
  "role": "Administrador"
}
```

### Atualização via API
Também é possível atualizar via código:

```javascript
const { data, error } = await supabase.auth.updateUser({
  data: { name: 'Novo Nome' }
})
```

## 📞 Suporte

Se tiver dúvidas sobre a configuração:
1. Verifique se o JSON está formatado corretamente
2. Certifique-se de salvar as alterações
3. Faça logout e login novamente para ver as mudanças
4. Limpe o cache do navegador se necessário 
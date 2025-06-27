# 🔐 VERIFICAÇÃO DE USUÁRIO NO SUPABASE

## 📋 Passos para Verificar

### 1. Acesse o Supabase Dashboard
- Vá para https://supabase.com/dashboard
- Selecione seu projeto

### 2. Verificar Usuário
- Vá para **Authentication** → **Users**
- Procure pelo email do novo usuário
- Verifique se está marcado como **"Email Confirmed"**

### 3. Problemas Comuns e Soluções

#### ❌ **Email não confirmado**
- Clique no usuário
- Marque ✅ **"Email Confirmed"**
- Salve as alterações

#### ❌ **Senha incorreta**
- Clique em **"Reset Password"**
- Defina uma nova senha
- Teste o login

#### ❌ **Usuário não existe**
- Clique em **"Add User"**
- Preencha:
  - **Email:** email@exemplo.com
  - **Password:** senha123
  - **Email Confirm:** ✅ (marque como confirmado)

#### ❌ **Erro de autenticação**
- Verifique se o email está correto
- Teste com senha simples (ex: 123456)
- Verifique se não há espaços extras

### 4. Testar Login
- Acesse: http://localhost:3001/login
- Use as credenciais exatas
- Verifique mensagens de erro

### 5. Logs de Erro
- Vá para **Authentication** → **Logs**
- Procure por tentativas de login
- Verifique se há erros específicos

## 🔧 Credenciais de Teste Recomendadas

**Email:** teste@cearanoticias.com
**Senha:** teste123456

## 📞 Se ainda não funcionar

1. **Limpe o cache do navegador**
2. **Teste em janela anônima**
3. **Verifique se o servidor está rodando**
4. **Confirme se as variáveis de ambiente estão corretas** 
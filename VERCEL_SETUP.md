# Configuração da Vercel - Ceará Notícias

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel da Vercel:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Site URL
```
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

## Passos para Configurar

1. **Acesse o painel da Vercel**
   - Vá para https://vercel.com/dashboard
   - Selecione seu projeto

2. **Configure as variáveis de ambiente**
   - Vá em "Settings" > "Environment Variables"
   - Adicione cada variável listada acima

3. **Redeploy do projeto**
   - Após configurar as variáveis, faça um novo deploy
   - Vá em "Deployments" > "Redeploy"

## Verificação

Após o deploy, verifique:

1. **Logs da API**: Acesse os logs da Vercel para ver se há erros
2. **Console do navegador**: Verifique se há erros no console
3. **Teste a API diretamente**: Acesse `/api/noticias` para ver se retorna dados

## Problemas Comuns

### Notícias não aparecem
- Verifique se `NEXT_PUBLIC_SITE_URL` está configurada corretamente
- Confirme se as variáveis do Supabase estão corretas
- Verifique os logs da Vercel para erros

### Erro de conexão com Supabase
- Confirme se a URL e chave do Supabase estão corretas
- Verifique se o banco de dados está acessível

### Cache não atualiza
- O projeto já está configurado para evitar cache
- Se persistir, force um novo deploy

## Comandos Úteis

```bash
# Verificar variáveis de ambiente localmente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SITE_URL

# Testar API localmente
curl http://localhost:3000/api/noticias
``` 
# 🛡️ Sistema de Rate Limiting

## Visão Geral

O sistema de rate limiting foi implementado para proteger o site contra ataques de força bruta e sobrecarga de APIs.

## Configurações Implementadas

### 1. **APIs Gerais** (`rateLimiters.api`)
- **Limite**: 100 requisições por 15 minutos
- **Aplicado em**: Todas as rotas `/api/*` (exceto auth)
- **Mensagem**: "Limite de requisições excedido. Tente novamente em 15 minutos."

### 2. **Autenticação** (`rateLimiters.auth`)
- **Limite**: 5 tentativas por 15 minutos
- **Aplicado em**: Rotas `/api/auth/*`
- **Mensagem**: "Muitas tentativas de login. Tente novamente em 15 minutos."

### 3. **Criação de Conteúdo** (`rateLimiters.create`)
- **Limite**: 10 criações por hora
- **Aplicado em**: POST em `/api/noticias` e `/api/patrocinadores`
- **Mensagem**: "Limite de criação excedido. Tente novamente em 1 hora."

### 4. **Uploads** (`rateLimiters.upload`)
- **Limite**: 20 uploads por hora
- **Aplicado em**: Rotas de upload (quando implementadas)
- **Mensagem**: "Limite de uploads excedido. Tente novamente em 1 hora."

## Como Funciona

### Armazenamento
- **Memória**: Dados armazenados em Map (memória do servidor)
- **Chave**: `IP:pathname` (ex: `192.168.1.1:/api/noticias`)
- **Limpeza**: Entradas expiradas são removidas automaticamente

### Headers de Resposta
Quando o limite é excedido, a API retorna:
```json
{
  "error": "Mensagem de erro",
  "retryAfter": "900 segundos"
}
```

Com headers:
- `Retry-After`: Tempo para tentar novamente
- `X-RateLimit-Limit`: Limite máximo
- `X-RateLimit-Remaining`: Requisições restantes
- `X-RateLimit-Reset`: Timestamp de reset

## Monitoramento

### Painel de Debug
Acesse `/admin` para ver estatísticas em tempo real:
- Número de entradas ativas
- Status do sistema
- Limites configurados

### Logs
Rate limiting é aplicado no middleware, antes de qualquer processamento.

## Personalização

### Alterar Limites
Edite `lib/rate-limit.ts`:

```typescript
export const rateLimiters = {
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // Alterar aqui
    message: 'Mensagem personalizada'
  }),
  // ...
}
```

### Adicionar Novo Limiter
```typescript
const customLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 30,
  message: 'Limite personalizado'
})
```

## Segurança

### Proteções Implementadas
1. **IP Tracking**: Identificação por IP real
2. **Path Isolation**: Limites separados por rota
3. **Auto-limpeza**: Remoção automática de dados expirados
4. **Headers Padrão**: Headers HTTP de rate limiting

### Recomendações para Produção
1. **Redis**: Para múltiplos servidores, use Redis em vez de memória
2. **Proxy**: Configure proxy para capturar IP real
3. **Monitoramento**: Implemente alertas para ataques
4. **Whitelist**: Adicione IPs confiáveis à whitelist

## Teste

### Simular Rate Limiting
```bash
# Teste rápido com curl
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/noticias \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}'
done
```

### Verificar Headers
```bash
curl -I http://localhost:3000/api/noticias
# Deve retornar headers X-RateLimit-*
```

## Troubleshooting

### Problemas Comuns
1. **Limite muito baixo**: Aumente `maxRequests`
2. **Janela muito curta**: Aumente `windowMs`
3. **IP incorreto**: Configure proxy headers
4. **Memória alta**: Use Redis em produção

### Logs de Debug
Ative logs detalhados em desenvolvimento:
```typescript
// Adicione em lib/rate-limit.ts
console.log('Rate limit check:', { ip, pathname, count, limit })
``` 
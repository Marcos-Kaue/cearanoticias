# 👁️ Sistema de Visualizações - Ceará Notícias

## Como Funciona

### 1. **Contagem Automática**
Quando alguém acessa uma notícia (`/noticia/[id]`), o sistema automaticamente:
- Aguarda 2 segundos para garantir que a página carregou
- Faz uma requisição PATCH para `/api/noticias/[id]`
- Incrementa o contador de visualizações no banco de dados

### 2. **Componente Rastreador**
O componente `VisualizacaoTracker` é invisível e:
- Executa apenas no lado do cliente (browser)
- Evita contagem duplicada usando `useRef`
- Registra visualização apenas uma vez por sessão

### 3. **API de Incremento**
Endpoint `PATCH /api/noticias/[id]`:
- Busca a notícia atual no banco
- Incrementa o campo `visualizacoes`
- Atualiza o timestamp `updated_at`
- Retorna o novo valor de visualizações

## Onde Aparecem as Visualizações

### 🏠 **Página Inicial**
- Ranking "Mais Lidas" (top 3 notícias)
- Mostra número de visualizações ao lado de cada notícia

### 📰 **Página da Notícia**
- Visualizações são contabilizadas automaticamente
- Não exibe o contador na interface (para não poluir)

### 🎛️ **Painel Admin**
- **Dashboard**: Total de visualizações acumuladas
- **Lista de Notícias**: Visualizações por notícia
- **Relatórios**: 
  - Total de visualizações
  - Visualizações por mês
  - Ranking das mais lidas
  - Filtros por período (hoje, semana, mês)

## Estrutura do Banco

```sql
-- Campo na tabela noticias
visualizacoes INTEGER DEFAULT 0
```

## Testes

### Teste Manual
```bash
npm run test:visualizacoes
```

### Teste Manual no Browser
1. Acesse uma notícia
2. Abra o console do navegador
3. Verifique a mensagem: "Visualização registrada para notícia: [ID]"
4. Recarregue a página - não deve registrar novamente

### Verificar no Admin
1. Acesse `/admin`
2. Veja o card "Visualizações" no dashboard
3. Acesse `/admin/relatorios` para ver ranking

## Características Técnicas

### ✅ **Prevenção de Duplicação**
- Contagem única por sessão
- Timeout de 2 segundos
- Verificação de estado com `useRef`

### ✅ **Performance**
- Requisição assíncrona não bloqueante
- Cache otimizado para dados atualizados
- Rate limiting aplicado

### ✅ **Compatibilidade**
- Funciona em desktop e mobile
- Compatível com todos os navegadores
- Funciona na Vercel e localmente

## Monitoramento

### Logs
- Console do navegador mostra confirmação
- Logs do servidor registram erros
- Painel de debug mostra estatísticas

### Métricas Disponíveis
- Total de visualizações
- Visualizações por notícia
- Ranking das mais lidas
- Crescimento por período

## Troubleshooting

### Visualizações não contam
1. Verifique se a notícia está publicada
2. Confirme se o JavaScript está habilitado
3. Verifique os logs do console
4. Teste com `npm run test:visualizacoes`

### Números não atualizam
1. Verifique o cache do navegador
2. Confirme se a API está respondendo
3. Verifique os logs da Vercel
4. Teste a API diretamente

### Performance lenta
1. Verifique se há muitas requisições
2. Confirme se o rate limiting não está ativo
3. Verifique a conexão com o Supabase
4. Monitore os logs de erro

## Próximas Melhorias

- [ ] Visualizações únicas por IP
- [ ] Analytics mais detalhados
- [ ] Gráficos interativos
- [ ] Exportação de relatórios
- [ ] Notificações de recordes 
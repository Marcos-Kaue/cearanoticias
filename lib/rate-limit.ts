import { NextRequest, NextResponse } from 'next/server'

// Armazenamento em memória para rate limiting
// Em produção, considere usar Redis ou similar
export const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // Janela de tempo em milissegundos
  maxRequests: number // Máximo de requisições por janela
  message?: string // Mensagem de erro personalizada
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, message = 'Muitas requisições. Tente novamente em alguns minutos.' } = config

  return function rateLimit(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    // Limpar entradas expiradas
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }

    const key = `${ip}:${request.nextUrl.pathname}`
    const current = rateLimitStore.get(key)

    if (!current) {
      // Primeira requisição
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return null // Permite a requisição
    }

    if (now > current.resetTime) {
      // Janela expirou, resetar contador
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return null // Permite a requisição
    }

    if (current.count >= maxRequests) {
      // Limite excedido
      const retryAfter = Math.ceil((current.resetTime - now) / 1000)
      return NextResponse.json(
        { 
          error: message,
          retryAfter: `${retryAfter} segundos`
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(current.resetTime).toISOString()
          }
        }
      )
    }

    // Incrementar contador
    current.count++
    rateLimitStore.set(key, current)
    
    return null // Permite a requisição
  }
}

// Configurações predefinidas
export const rateLimiters = {
  // Rate limit para APIs gerais
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // 100 requisições por 15 minutos
    message: 'Limite de requisições excedido. Tente novamente em 15 minutos.'
  }),

  // Rate limit mais restritivo para autenticação
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5, // 5 tentativas de login por 15 minutos
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  }),

  // Rate limit para criação de conteúdo
  create: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 10, // 10 criações por hora
    message: 'Limite de criação excedido. Tente novamente em 1 hora.'
  }),

  // Rate limit para uploads
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 20, // 20 uploads por hora
    message: 'Limite de uploads excedido. Tente novamente em 1 hora.'
  })
}

// Função helper para aplicar rate limiting em rotas da API
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  limiter: ReturnType<typeof createRateLimiter>
) {
  return async function (request: NextRequest) {
    const rateLimitResult = limiter(request)
    if (rateLimitResult) {
      return rateLimitResult
    }
    return handler(request)
  }
} 
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Testar conexão com o Supabase
    const { data, error } = await supabase
      .from('noticias')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Erro na conexão com Supabase',
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Conexão com Supabase funcionando!',
      data 
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Erro interno',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 
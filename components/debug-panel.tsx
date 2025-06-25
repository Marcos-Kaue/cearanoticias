"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export default function DebugPanel() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    setStatus('loading')
    setMessage('Testando conexão...')
    
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage('Conexão com Supabase funcionando!')
        setDetails(data)
      } else {
        setStatus('error')
        setMessage('Erro na conexão com Supabase')
        setDetails(data)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Erro ao testar conexão')
      setDetails(error)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'loading' && <RefreshCw className="w-5 h-5 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
          Debug - Status da Conexão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className={`font-medium ${
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 'text-blue-600'
          }`}>
            {message}
          </p>
          
          {details && (
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre className="whitespace-pre-wrap">{JSON.stringify(details, null, 2)}</pre>
            </div>
          )}
          
          <Button onClick={testConnection} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Testar Novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
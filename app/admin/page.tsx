import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Eye, TrendingUp, Calendar } from "lucide-react"
import DebugPanel from "@/components/debug-panel"

// Mock data - em produção viria do banco de dados
const stats = {
  totalNoticias: 156,
  noticiasHoje: 8,
  visualizacoes: 45230,
  patrocinadores: 12,
  crescimentoMensal: 15.3,
  noticiasPublicadas: 142,
}

const recentNews = [
  {
    id: 1,
    titulo: "Economia brasileira cresce 2,5% no terceiro trimestre",
    status: "Publicado",
    visualizacoes: 1250,
    data: "2024-01-15",
  },
  {
    id: 2,
    titulo: "Nova tecnologia promete revolucionar energia solar",
    status: "Publicado",
    visualizacoes: 890,
    data: "2024-01-14",
  },
  {
    id: 3,
    titulo: "Copa do Mundo de 2026 terá novo formato",
    status: "Rascunho",
    visualizacoes: 0,
    data: "2024-01-13",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu portal de notícias</p>
      </div>

      {/* Painel de Debug */}
      <DebugPanel />

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNoticias}</div>
            <p className="text-xs text-muted-foreground">+{stats.noticiasHoje} hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visualizacoes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.crescimentoMensal}% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrocinadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patrocinadores}</div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.crescimentoMensal}%</div>
            <p className="text-xs text-muted-foreground">Comparado ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Notícias recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Notícias Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNews.map((noticia) => (
              <div key={noticia.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{noticia.titulo}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(noticia.data).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {noticia.visualizacoes} visualizações
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      noticia.status === "Publicado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {noticia.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

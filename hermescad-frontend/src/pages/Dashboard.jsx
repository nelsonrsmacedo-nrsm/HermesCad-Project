import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Users, Building, Mail, Activity, TrendingUp, DollarSign } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalCampanhas: 0,
    totalAtividades: 0,
    campanhasEnviadas: 0
  })

  useEffect(() => {
    // Buscar estatísticas do backend
    const fetchStats = async () => {
      try {
        const [clientesRes, atividadesRes] = await Promise.all([
          fetch('/api/clientes'),
          fetch('/api/atividades')
        ])

        const clientes = await clientesRes.json()
        const atividades = await atividadesRes.json()

        setStats({
          totalClientes: clientes.length,
          totalCampanhas: 0, // Será implementado futuramente
          totalAtividades: atividades.length,
          campanhasEnviadas: 0 // Será implementado futuramente
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu CRM</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampanhas}</div>
            <p className="text-xs text-muted-foreground">
              Campanhas de mala direta criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAtividades}</div>
            <p className="text-xs text-muted-foreground">
              Atividades registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Enviadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.campanhasEnviadas}</div>
            <p className="text-xs text-muted-foreground">
              Total de campanhas enviadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/clientes"
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Novo Cliente</span>
              </a>
              <a
                href="/mala-direta"
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Nova Campanha</span>
              </a>
              <a
                href="/atividades"
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Nova Atividade</span>
              </a>
              <a
                href="/produtos"
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Building className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Novo Produto</span>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Sistema</CardTitle>
            <CardDescription>
              Informações importantes sobre o HermesCad CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status do Sistema</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Última Atualização</span>
                <span className="text-sm font-medium">Hoje</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Versão</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard


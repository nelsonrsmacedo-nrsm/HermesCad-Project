import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Plus, Edit, Trash2, Target, DollarSign, Calendar } from 'lucide-react'

function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState([])
  const [clientes, setClientes] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOportunidade, setEditingOportunidade] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    cliente_id: '',
    valor: '',
    status: 'Prospecção',
    probabilidade: '',
    data_fechamento_prevista: ''
  })

  const statusOptions = [
    'Prospecção',
    'Qualificação',
    'Proposta',
    'Negociação',
    'Ganha',
    'Perdida'
  ]

  const getStatusColor = (status) => {
    const colors = {
      'Prospecção': 'bg-blue-100 text-blue-800',
      'Qualificação': 'bg-yellow-100 text-yellow-800',
      'Proposta': 'bg-purple-100 text-purple-800',
      'Negociação': 'bg-orange-100 text-orange-800',
      'Ganha': 'bg-green-100 text-green-800',
      'Perdida': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchOportunidades()
    fetchClientes()
  }, [])

  const fetchOportunidades = async () => {
    try {
      const response = await fetch('/api/oportunidades')
      const data = await response.json()
      setOportunidades(data)
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error)
    }
  }

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    }
  }

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente ? cliente.nome : 'Cliente não encontrado'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingOportunidade ? `/api/oportunidades/${editingOportunidade.id}` : '/api/oportunidades'
      const method = editingOportunidade ? 'PUT' : 'POST'
      
      const submitData = {
        ...formData,
        cliente_id: parseInt(formData.cliente_id),
        valor: parseFloat(formData.valor) || 0,
        probabilidade: parseInt(formData.probabilidade) || 0
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        await fetchOportunidades()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error)
    }
  }

  const handleEdit = (oportunidade) => {
    setEditingOportunidade(oportunidade)
    setFormData({
      nome: oportunidade.nome || '',
      cliente_id: oportunidade.cliente_id?.toString() || '',
      valor: oportunidade.valor?.toString() || '',
      status: oportunidade.status || 'Prospecção',
      probabilidade: oportunidade.probabilidade?.toString() || '',
      data_fechamento_prevista: oportunidade.data_fechamento_prevista ? 
        oportunidade.data_fechamento_prevista.split('T')[0] : ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      try {
        const response = await fetch(`/api/oportunidades/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchOportunidades()
        }
      } catch (error) {
        console.error('Erro ao excluir oportunidade:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      cliente_id: '',
      valor: '',
      status: 'Prospecção',
      probabilidade: '',
      data_fechamento_prevista: ''
    })
    setEditingOportunidade(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-600 mt-2">Gerencie suas oportunidades de vendas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Oportunidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingOportunidade ? 'Editar Oportunidade' : 'Nova Oportunidade'}
              </DialogTitle>
              <DialogDescription>
                {editingOportunidade 
                  ? 'Edite as informações da oportunidade.' 
                  : 'Adicione uma nova oportunidade ao sistema.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente_id">Cliente</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Oportunidade</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="probabilidade">Probabilidade (%)</Label>
                <Input
                  id="probabilidade"
                  name="probabilidade"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probabilidade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fechamento_prevista">Data de Fechamento Prevista</Label>
                <Input
                  id="data_fechamento_prevista"
                  name="data_fechamento_prevista"
                  type="date"
                  value={formData.data_fechamento_prevista}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOportunidade ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Oportunidades</CardTitle>
          <CardDescription>
            {oportunidades.length} oportunidade(s) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Data Prevista</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {oportunidades.map((oportunidade) => (
                <TableRow key={oportunidade.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span>{oportunidade.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getClienteNome(oportunidade.cliente_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>{formatCurrency(oportunidade.valor)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(oportunidade.status)}>
                      {oportunidade.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{oportunidade.probabilidade}%</TableCell>
                  <TableCell>
                    {oportunidade.data_fechamento_prevista && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(oportunidade.data_fechamento_prevista)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(oportunidade)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(oportunidade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {oportunidades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma oportunidade cadastrada ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OportunidadesPage


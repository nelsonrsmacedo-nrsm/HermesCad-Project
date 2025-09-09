import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Plus, Edit, Trash2, Activity, Calendar, Clock } from 'lucide-react'

function AtividadesPage() {
  const [atividades, setAtividades] = useState([])
  const [clientes, setClientes] = useState([])
  const [oportunidades, setOportunidades] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAtividade, setEditingAtividade] = useState(null)
  const [formData, setFormData] = useState({
    tipo: '',
    descricao: '',
    cliente_id: '',
    oportunidade_id: '',
    data_hora: '',
    status: 'Pendente'
  })

  const tipoOptions = [
    'Ligação',
    'Reunião',
    'E-mail',
    'Tarefa',
    'Visita',
    'Apresentação'
  ]

  const statusOptions = [
    'Pendente',
    'Concluída',
    'Cancelada'
  ]

  const getStatusColor = (status) => {
    const colors = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Concluída': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchAtividades()
    fetchClientes()
    fetchOportunidades()
  }, [])

  const fetchAtividades = async () => {
    try {
      const response = await fetch('/api/atividades')
      const data = await response.json()
      setAtividades(data)
    } catch (error) {
      console.error('Erro ao buscar atividades:', error)
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

  const fetchOportunidades = async () => {
    try {
      const response = await fetch('/api/oportunidades')
      const data = await response.json()
      setOportunidades(data)
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error)
    }
  }

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente ? cliente.nome : ''
  }

  const getOportunidadeNome = (oportunidadeId) => {
    const oportunidade = oportunidades.find(o => o.id === oportunidadeId)
    return oportunidade ? oportunidade.nome : ''
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingAtividade ? `/api/atividades/${editingAtividade.id}` : '/api/atividades'
      const method = editingAtividade ? 'PUT' : 'POST'
      
      const submitData = {
        ...formData,
        cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
        oportunidade_id: formData.oportunidade_id ? parseInt(formData.oportunidade_id) : null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        await fetchAtividades()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Erro ao salvar atividade:', error)
    }
  }

  const handleEdit = (atividade) => {
    setEditingAtividade(atividade)
    setFormData({
      tipo: atividade.tipo || '',
      descricao: atividade.descricao || '',
      cliente_id: atividade.cliente_id?.toString() || '',
      oportunidade_id: atividade.oportunidade_id?.toString() || '',
      data_hora: atividade.data_hora ? 
        new Date(atividade.data_hora).toISOString().slice(0, 16) : '',
      status: atividade.status || 'Pendente'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      try {
        const response = await fetch(`/api/atividades/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchAtividades()
        }
      } catch (error) {
        console.error('Erro ao excluir atividade:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      tipo: '',
      descricao: '',
      cliente_id: '',
      oportunidade_id: '',
      data_hora: '',
      status: 'Pendente'
    })
    setEditingAtividade(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
          <p className="text-gray-600 mt-2">Gerencie suas atividades e interações</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAtividade ? 'Editar Atividade' : 'Nova Atividade'}
              </DialogTitle>
              <DialogDescription>
                {editingAtividade 
                  ? 'Edite as informações da atividade.' 
                  : 'Adicione uma nova atividade ao sistema.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoOptions.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente_id">Cliente (Opcional)</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum cliente</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="oportunidade_id">Oportunidade (Opcional)</Label>
                <Select
                  value={formData.oportunidade_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, oportunidade_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma oportunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma oportunidade</SelectItem>
                    {oportunidades.map((oportunidade) => (
                      <SelectItem key={oportunidade.id} value={oportunidade.id.toString()}>
                        {oportunidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_hora">Data e Hora</Label>
                <Input
                  id="data_hora"
                  name="data_hora"
                  type="datetime-local"
                  value={formData.data_hora}
                  onChange={handleInputChange}
                  required
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
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingAtividade ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Atividades</CardTitle>
          <CardDescription>
            {atividades.length} atividade(s) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Oportunidade</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atividades.map((atividade) => (
                <TableRow key={atividade.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span>{atividade.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {atividade.descricao}
                  </TableCell>
                  <TableCell>{getClienteNome(atividade.cliente_id)}</TableCell>
                  <TableCell>{getOportunidadeNome(atividade.oportunidade_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatDateTime(atividade.data_hora)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(atividade.status)}>
                      {atividade.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(atividade)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(atividade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {atividades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma atividade cadastrada ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AtividadesPage


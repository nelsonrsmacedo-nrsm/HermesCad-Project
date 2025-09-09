import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Plus, Edit, Trash2, Mail, Phone, User } from 'lucide-react'

function ContatosPage() {
  const [contatos, setContatos] = useState([])
  const [clientes, setClientes] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContato, setEditingContato] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    cliente_id: ''
  })

  useEffect(() => {
    fetchContatos()
    fetchClientes()
  }, [])

  const fetchContatos = async () => {
    try {
      const response = await fetch('/api/contatos')
      const data = await response.json()
      setContatos(data)
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingContato ? `/api/contatos/${editingContato.id}` : '/api/contatos'
      const method = editingContato ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cliente_id: parseInt(formData.cliente_id)
        }),
      })

      if (response.ok) {
        await fetchContatos()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Erro ao salvar contato:', error)
    }
  }

  const handleEdit = (contato) => {
    setEditingContato(contato)
    setFormData({
      nome: contato.nome || '',
      email: contato.email || '',
      telefone: contato.telefone || '',
      cargo: contato.cargo || '',
      cliente_id: contato.cliente_id?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        const response = await fetch(`/api/contatos/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchContatos()
        }
      } catch (error) {
        console.error('Erro ao excluir contato:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      cliente_id: ''
    })
    setEditingContato(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
          <p className="text-gray-600 mt-2">Gerencie os contatos dos seus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingContato ? 'Editar Contato' : 'Novo Contato'}
              </DialogTitle>
              <DialogDescription>
                {editingContato 
                  ? 'Edite as informações do contato.' 
                  : 'Adicione um novo contato ao sistema.'
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
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingContato ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
          <CardDescription>
            {contatos.length} contato(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contatos.map((contato) => (
                <TableRow key={contato.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{contato.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getClienteNome(contato.cliente_id)}</TableCell>
                  <TableCell>{contato.cargo}</TableCell>
                  <TableCell>
                    {contato.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{contato.email}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {contato.telefone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{contato.telefone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contato)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contato.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {contatos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum contato cadastrado ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ContatosPage


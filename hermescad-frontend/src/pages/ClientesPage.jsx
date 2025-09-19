import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react'

function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState(null)
  const [formData, setFormData] = useState({
    nome: ",
    email: ",
    endereco: ",
    numero_telefone: ",
    numero_celular: ",
    possui_whatsapp: false,
    area_atuacao: ",
    cpf_cnpj: ",
    informacoes_financeiras: ",
    cargo: "
  })

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingCliente ? `/api/clientes/${editingCliente.id}` : '/api/clientes'
      const method = editingCliente ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchClientes()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  const handleEdit = (cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome || ",
      email: cliente.email || ",
      endereco: cliente.endereco || ",
      numero_telefone: cliente.numero_telefone || ",
      numero_celular: cliente.numero_celular || ",
      possui_whatsapp: cliente.possui_whatsapp || false,
      area_atuacao: cliente.area_atuacao || ",
      cpf_cnpj: cliente.cpf_cnpj || ",
      informacoes_financeiras: cliente.informacoes_financeiras || ",
      cargo: cliente.cargo || "
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await fetch(`/api/clientes/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchClientes()
        }
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: ",
      email: ",
      endereco: ",
      numero_telefone: ",
      numero_celular: ",
      possui_whatsapp: false,
      area_atuacao: ",
      cpf_cnpj: ",
      informacoes_financeiras: ",
      cargo: "
    })
    setEditingCliente(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingCliente 
                  ? 'Edite as informações do cliente.' 
                  : 'Adicione um novo cliente ao sistema.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
                <Input
                  id="cnpj_cpf"
                  name="cnpj_cpf"
                  value={formData.cnpj_cpf}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  placeholder="Ex: Gerente, Diretor, etc."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCliente ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {clientes.length} cliente(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>CNPJ/CPF</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    {cliente.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{cliente.email}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {cliente.telefone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{cliente.telefone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{cliente.cargo || '-'}</TableCell>
                  <TableCell>{cliente.cnpj_cpf}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cliente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {clientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum cliente cadastrado ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientesPage


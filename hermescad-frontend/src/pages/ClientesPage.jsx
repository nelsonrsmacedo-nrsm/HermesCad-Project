
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
    nome: '',
    endereco: '',
    numero_telefone: '',
    numero_celular: '',
    possui_whatsapp: false,
    area_atuacao: '',
    cpf_cnpj: '',
    informacoes_financeiras: '',
    email: '',
    site: '',
    cargo: ''
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
      } else {
        const errorData = await response.json()
        console.error('Erro do servidor:', errorData)
        alert(`Erro ao salvar cliente: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      alert('Erro ao salvar cliente. Verifique a conexão.')
    }
  }

  const handleEdit = (cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome || '',
      endereco: cliente.endereco || '',
      numero_telefone: cliente.numero_telefone || '',
      numero_celular: cliente.numero_celular || '',
      possui_whatsapp: cliente.possui_whatsapp || false,
      area_atuacao: cliente.area_atuacao || '',
      cpf_cnpj: cliente.cpf_cnpj || '',
      informacoes_financeiras: cliente.informacoes_financeiras || '',
      email: cliente.email || '',
      site: cliente.site || '',
      cargo: cliente.cargo || ''
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
        } else {
          const errorData = await response.json()
          console.error('Erro do servidor:', errorData)
          alert(`Erro ao excluir cliente: ${errorData.error || response.statusText}`)
        }
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
        alert('Erro ao excluir cliente. Verifique a conexão.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      numero_telefone: '',
      numero_celular: '',
      possui_whatsapp: false,
      area_atuacao: '',
      cpf_cnpj: '',
      informacoes_financeiras: '',
      email: '',
      site: '',
      cargo: ''
    })
    setEditingCliente(null)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_telefone">Telefone</Label>
                <Input
                  id="numero_telefone"
                  name="numero_telefone"
                  value={formData.numero_telefone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_celular">Celular</Label>
                <Input
                  id="numero_celular"
                  name="numero_celular"
                  value={formData.numero_celular}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="possui_whatsapp"
                  name="possui_whatsapp"
                  checked={formData.possui_whatsapp}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <Label htmlFor="possui_whatsapp">Possui WhatsApp</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_atuacao">Área de Atuação</Label>
                <Input
                  id="area_atuacao"
                  name="area_atuacao"
                  value={formData.area_atuacao}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf_cnpj">CPF ou CNPJ</Label>
                <Input
                  id="cpf_cnpj"
                  name="cpf_cnpj"
                  value={formData.cpf_cnpj}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="informacoes_financeiras">Informações Financeiras (PIX, Conta Bancária)</Label>
                <Input
                  id="informacoes_financeiras"
                  name="informacoes_financeiras"
                  value={formData.informacoes_financeiras}
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
                <Label htmlFor="site">Site</Label>
                <Input
                  id="site"
                  name="site"
                  value={formData.site}
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
                <TableHead>Celular</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Área de Atuação</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Info Financeiras</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell>{cliente.numero_telefone || '-'}</TableCell>
                  <TableCell>{cliente.numero_celular || '-'}</TableCell>
                  <TableCell>{cliente.possui_whatsapp ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{cliente.area_atuacao || '-'}</TableCell>
                  <TableCell>{cliente.cpf_cnpj || '-'}</TableCell>
                  <TableCell>{cliente.informacoes_financeiras || '-'}</TableCell>
                  <TableCell>{cliente.site || '-'}</TableCell>
                  <TableCell>{cliente.cargo || '-'}</TableCell>
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



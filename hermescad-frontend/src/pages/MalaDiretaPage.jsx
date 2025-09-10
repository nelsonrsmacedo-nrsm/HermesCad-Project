import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Mail, MessageCircle, Upload, Send, Users, CheckCircle, AlertCircle } from 'lucide-react'

export default function MalaDiretaPage() {
  const [clientes, setClientes] = useState([])
  const [selectedClients, setSelectedClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })

  // Estados para formulário de e-mail
  const [emailForm, setEmailForm] = useState({
    subject: '',
    body: '',
    attachments: []
  })

  // Estados para formulário de WhatsApp
  const [whatsappForm, setWhatsappForm] = useState({
    message: '',
    image: null
  })

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      } else {
        showMessage('error', 'Erro ao carregar clientes')
      }
    } catch (error) {
      showMessage('error', 'Erro ao conectar com o servidor')
    }
  }

  const showMessage = (type, content) => {
    setMessage({ type, content })
    setTimeout(() => setMessage({ type: '', content: '' }), 5000)
  }

  const handleClientSelection = (clientId, checked) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId])
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId))
    }
  }

  const handleSelectAllClients = (checked) => {
    if (checked) {
      setSelectedClients(clientes.map(cliente => cliente.id))
    } else {
      setSelectedClients([])
    }
  }

  const handleFileUpload = async (file, type) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/mala_direta/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'email') {
          setEmailForm(prev => ({
            ...prev,
            attachments: [...prev.attachments, data.file_path]
          }))
        } else if (type === 'whatsapp') {
          setWhatsappForm(prev => ({
            ...prev,
            image: data.file_path
          }))
        }
        showMessage('success', 'Arquivo enviado com sucesso')
      } else {
        showMessage('error', 'Erro ao enviar arquivo')
      }
    } catch (error) {
      showMessage('error', 'Erro ao conectar com o servidor')
    }
  }

  const sendEmail = async () => {
    if (selectedClients.length === 0) {
      showMessage('error', 'Selecione pelo menos um cliente')
      return
    }

    if (!emailForm.subject || !emailForm.body) {
      showMessage('error', 'Preencha o assunto e o corpo do e-mail')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/mala_direta/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_ids: selectedClients,
          subject: emailForm.subject,
          body: emailForm.body,
          attachments: emailForm.attachments
        })
      })

      const data = await response.json()
      if (response.ok) {
        showMessage('success', `E-mails enviados com sucesso! ${data.sent_count}/${data.total_clients} enviados`)
        setEmailForm({ subject: '', body: '', attachments: [] })
      } else {
        showMessage('error', data.error || 'Erro ao enviar e-mails')
      }
    } catch (error) {
      showMessage('error', 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const sendWhatsApp = async () => {
    if (selectedClients.length === 0) {
      showMessage('error', 'Selecione pelo menos um cliente')
      return
    }

    if (!whatsappForm.message) {
      showMessage('error', 'Digite a mensagem do WhatsApp')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/mala_direta/send_whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_ids: selectedClients,
          message: whatsappForm.message,
          image_path: whatsappForm.image
        })
      })

      const data = await response.json()
      if (response.ok) {
        showMessage('success', `Mensagens WhatsApp enviadas! ${data.sent_count}/${data.total_clients} enviadas`)
        setWhatsappForm({ message: '', image: null })
      } else {
        showMessage('error', data.error || 'Erro ao enviar mensagens WhatsApp')
      }
    } catch (error) {
      showMessage('error', 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mala Direta</h1>
          <p className="text-gray-600">Envie campanhas por e-mail e WhatsApp para seus clientes</p>
        </div>
      </div>

      {message.content && (
        <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
          {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.content}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Clientes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selecionar Clientes
            </CardTitle>
            <CardDescription>
              Escolha os clientes que receberão a campanha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedClients.length === clientes.length && clientes.length > 0}
                  onCheckedChange={handleSelectAllClients}
                />
                <Label htmlFor="select-all" className="font-medium">
                  Selecionar todos ({clientes.length})
                </Label>
              </div>
              
              <div className="border rounded-md p-2 max-h-96 overflow-y-auto">
                {clientes.map((cliente) => (
                  <div key={cliente.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`cliente-${cliente.id}`}
                      checked={selectedClients.includes(cliente.id)}
                      onCheckedChange={(checked) => handleClientSelection(cliente.id, checked)}
                    />
                    <Label htmlFor={`cliente-${cliente.id}`} className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{cliente.nome}</div>
                        <div className="text-sm text-gray-500">
                          {cliente.email && <div>📧 {cliente.email}</div>}
                          {cliente.telefone && <div>📱 {cliente.telefone}</div>}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-600">
                {selectedClients.length} cliente(s) selecionado(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulários de Envio */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mail
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            {/* Formulário de E-mail */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Campanha por E-mail</CardTitle>
                  <CardDescription>
                    Configure e envie e-mails para os clientes selecionados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email-subject">Assunto</Label>
                    <Input
                      id="email-subject"
                      placeholder="Digite o assunto do e-mail"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email-body">Mensagem</Label>
                    <Textarea
                      id="email-body"
                      placeholder="Digite o conteúdo do e-mail"
                      rows={6}
                      value={emailForm.body}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email-attachments">Anexos</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email-attachments"
                        type="file"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files).forEach(file => {
                            handleFileUpload(file, 'email')
                          })
                        }}
                      />
                      <Upload className="h-4 w-4 text-gray-500" />
                    </div>
                    {emailForm.attachments.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {emailForm.attachments.length} arquivo(s) anexado(s)
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={sendEmail} 
                    disabled={loading || selectedClients.length === 0}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar E-mails'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Formulário de WhatsApp */}
            <TabsContent value="whatsapp">
              <Card>
                <CardHeader>
                  <CardTitle>Campanha por WhatsApp</CardTitle>
                  <CardDescription>
                    Configure e envie mensagens WhatsApp para os clientes selecionados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp-message">Mensagem</Label>
                    <Textarea
                      id="whatsapp-message"
                      placeholder="Digite a mensagem do WhatsApp"
                      rows={6}
                      value={whatsappForm.message}
                      onChange={(e) => setWhatsappForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp-image">Imagem (opcional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="whatsapp-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(e.target.files[0], 'whatsapp')
                          }
                        }}
                      />
                      <Upload className="h-4 w-4 text-gray-500" />
                    </div>
                    {whatsappForm.image && (
                      <div className="mt-2 text-sm text-gray-600">
                        Imagem anexada
                      </div>
                    )}
                  </div>
                  
                  <Alert className="border-yellow-500 bg-yellow-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Esta é uma implementação de demonstração. Para uso em produção, configure uma API oficial do WhatsApp Business.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={sendWhatsApp} 
                    disabled={loading || selectedClients.length === 0}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar WhatsApp'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


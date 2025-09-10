import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Mail, Palette, TestTube, Save, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'

function ConfiguracoesSistemaPage() {
  const [configuracoes, setConfiguracoes] = useState({
    email_server: '',
    email_port: 587,
    email_user: '',
    email_password: '',
    email_use_tls: true,
    cor_primaria: '#007bff',
    cor_secundaria: '#6c757d',
    logo_url: '',
    slogan: '',
    nome_empresa: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [testEmail, setTestEmail] = useState('')

  useEffect(() => {
    fetchConfiguracoes()
  }, [])

  const fetchConfiguracoes = async () => {
    try {
      const response = await fetch('/api/configuracoes_sistema')
      const data = await response.json()
      setConfiguracoes(data)
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar configurações' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/configuracoes_sistema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracoes),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: result.message })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error })
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: 'Digite um e-mail para teste' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/configuracoes_sistema/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_destino: testEmail }),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: result.message })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error })
      }
    } catch (error) {
      console.error('Erro ao testar e-mail:', error)
      setMessage({ type: 'error', text: 'Erro ao testar e-mail' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setConfiguracoes(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-2">Configure as opções de e-mail e personalização do sistema</p>
      </div>

      {message.text && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="email" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>E-mail</span>
            </TabsTrigger>
            <TabsTrigger value="personalizacao" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Personalização</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de E-mail</CardTitle>
                <CardDescription>
                  Configure o servidor SMTP para envio de e-mails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_server">Servidor SMTP</Label>
                    <Input
                      id="email_server"
                      name="email_server"
                      value={configuracoes.email_server}
                      onChange={handleInputChange}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_port">Porta</Label>
                    <Input
                      id="email_port"
                      name="email_port"
                      type="number"
                      value={configuracoes.email_port}
                      onChange={handleInputChange}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_user">Usuário/E-mail</Label>
                  <Input
                    id="email_user"
                    name="email_user"
                    type="email"
                    value={configuracoes.email_user}
                    onChange={handleInputChange}
                    placeholder="seu-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_password">Senha</Label>
                  <Input
                    id="email_password"
                    name="email_password"
                    type="password"
                    value={configuracoes.email_password}
                    onChange={handleInputChange}
                    placeholder="Digite a senha"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email_use_tls"
                    name="email_use_tls"
                    checked={configuracoes.email_use_tls}
                    onCheckedChange={(checked) => 
                      setConfiguracoes(prev => ({ ...prev, email_use_tls: checked }))
                    }
                  />
                  <Label htmlFor="email_use_tls">Usar TLS/SSL</Label>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Testar Configurações</h4>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite um e-mail para teste"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTestEmail}
                      disabled={loading}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Testar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personalizacao">
            <Card>
              <CardHeader>
                <CardTitle>Personalização</CardTitle>
                <CardDescription>
                  Personalize a aparência e identidade do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                  <Input
                    id="nome_empresa"
                    name="nome_empresa"
                    value={configuracoes.nome_empresa}
                    onChange={handleInputChange}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input
                    id="slogan"
                    name="slogan"
                    value={configuracoes.slogan}
                    onChange={handleInputChange}
                    placeholder="Slogan da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL do Logo</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    value={configuracoes.logo_url}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cor_primaria">Cor Primária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cor_primaria"
                        name="cor_primaria"
                        type="color"
                        value={configuracoes.cor_primaria}
                        onChange={handleInputChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={configuracoes.cor_primaria}
                        onChange={(e) => setConfiguracoes(prev => ({ ...prev, cor_primaria: e.target.value }))}
                        placeholder="#007bff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cor_secundaria"
                        name="cor_secundaria"
                        type="color"
                        value={configuracoes.cor_secundaria}
                        onChange={handleInputChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={configuracoes.cor_secundaria}
                        onChange={(e) => setConfiguracoes(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                        placeholder="#6c757d"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ConfiguracoesSistemaPage


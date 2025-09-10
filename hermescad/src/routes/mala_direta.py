from flask import Blueprint, request, jsonify
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from src.models.cliente import Cliente
from src.models.user import db

mala_direta_bp = Blueprint('mala_direta', __name__)

# Configurações de e-mail (devem ser configuradas via variáveis de ambiente)
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
EMAIL_USER = os.getenv('EMAIL_USER', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')

@mala_direta_bp.route('/mala_direta/send_email', methods=['POST'])
def send_email():
    """
    Envia e-mails para clientes selecionados
    """
    try:
        data = request.get_json()
        
        # Validação dos dados de entrada
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        client_ids = data.get('client_ids', [])
        subject = data.get('subject', '')
        body = data.get('body', '')
        attachments = data.get('attachments', [])
        
        if not client_ids:
            return jsonify({'error': 'Nenhum cliente selecionado'}), 400
        
        if not subject or not body:
            return jsonify({'error': 'Assunto e corpo do e-mail são obrigatórios'}), 400
        
        # Verificar configurações de e-mail
        if not EMAIL_USER or not EMAIL_PASSWORD:
            return jsonify({'error': 'Configurações de e-mail não definidas'}), 500
        
        # Buscar clientes no banco de dados
        clientes = Cliente.query.filter(Cliente.id.in_(client_ids)).all()
        
        if not clientes:
            return jsonify({'error': 'Nenhum cliente encontrado'}), 404
        
        # Configurar servidor SMTP
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        
        sent_count = 0
        failed_emails = []
        
        for cliente in clientes:
            if not cliente.email:
                failed_emails.append(f"Cliente {cliente.nome} não possui e-mail")
                continue
            
            try:
                # Criar mensagem
                msg = MIMEMultipart()
                msg['From'] = EMAIL_USER
                msg['To'] = cliente.email
                msg['Subject'] = subject
                
                # Adicionar corpo do e-mail
                msg.attach(MIMEText(body, 'html' if '<' in body else 'plain'))
                
                # Adicionar anexos (se houver)
                for attachment_path in attachments:
                    if os.path.isfile(attachment_path):
                        with open(attachment_path, "rb") as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {os.path.basename(attachment_path)}'
                        )
                        msg.attach(part)
                
                # Enviar e-mail
                text = msg.as_string()
                server.sendmail(EMAIL_USER, cliente.email, text)
                sent_count += 1
                
            except Exception as e:
                failed_emails.append(f"Erro ao enviar para {cliente.email}: {str(e)}")
        
        server.quit()
        
        return jsonify({
            'success': True,
            'sent_count': sent_count,
            'total_clients': len(clientes),
            'failed_emails': failed_emails
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@mala_direta_bp.route('/mala_direta/send_whatsapp', methods=['POST'])
def send_whatsapp():
    """
    Envia mensagens WhatsApp para clientes selecionados
    Nota: Esta implementação é uma demonstração. Para uso em produção,
    considere usar a API oficial do WhatsApp Business.
    """
    try:
        data = request.get_json()
        
        # Validação dos dados de entrada
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        client_ids = data.get('client_ids', [])
        message = data.get('message', '')
        image_path = data.get('image_path', '')
        
        if not client_ids:
            return jsonify({'error': 'Nenhum cliente selecionado'}), 400
        
        if not message:
            return jsonify({'error': 'Mensagem é obrigatória'}), 400
        
        # Buscar clientes no banco de dados
        clientes = Cliente.query.filter(Cliente.id.in_(client_ids)).all()
        
        if not clientes:
            return jsonify({'error': 'Nenhum cliente encontrado'}), 404
        
        sent_count = 0
        failed_messages = []
        
        for cliente in clientes:
            if not cliente.telefone:
                failed_messages.append(f"Cliente {cliente.nome} não possui telefone")
                continue
            
            try:
                # Aqui seria a implementação do envio via WhatsApp
                # Por questões de segurança e limitações, esta é uma simulação
                
                # Para implementação real, considere:
                # 1. API oficial do WhatsApp Business
                # 2. Twilio WhatsApp API
                # 3. Outras soluções empresariais
                
                # Simulação de envio bem-sucedido
                print(f"Simulando envio de WhatsApp para {cliente.telefone}: {message}")
                if image_path and os.path.isfile(image_path):
                    print(f"Com imagem: {image_path}")
                
                sent_count += 1
                
            except Exception as e:
                failed_messages.append(f"Erro ao enviar para {cliente.telefone}: {str(e)}")
        
        return jsonify({
            'success': True,
            'sent_count': sent_count,
            'total_clients': len(clientes),
            'failed_messages': failed_messages,
            'note': 'Esta é uma implementação de demonstração. Para uso em produção, configure uma API oficial do WhatsApp.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@mala_direta_bp.route('/mala_direta/upload', methods=['POST'])
def upload_file():
    """
    Endpoint para upload de arquivos (anexos e imagens)
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        # Criar diretório de uploads se não existir
        upload_dir = os.path.join(os.path.dirname(__file__), '..', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Salvar arquivo
        filename = file.filename
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'file_path': file_path
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro no upload: {str(e)}'}), 500


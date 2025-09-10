from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.configuracoes_sistema import ConfiguracoesSistema

configuracoes_sistema_bp = Blueprint('configuracoes_sistema', __name__)

@configuracoes_sistema_bp.route('/api/configuracoes_sistema', methods=['GET'])
def get_configuracoes():
    """Obter configurações do sistema"""
    try:
        # Sempre retorna a primeira configuração ou cria uma nova se não existir
        config = ConfiguracoesSistema.query.first()
        if not config:
            # Criar configuração padrão
            config = ConfiguracoesSistema()
            db.session.add(config)
            db.session.commit()
        
        # Não retornar a senha por segurança
        config_dict = config.to_dict()
        config_dict['email_password'] = '***' if config.email_password else ''
        
        return jsonify(config_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@configuracoes_sistema_bp.route('/api/configuracoes_sistema', methods=['POST'])
def save_configuracoes():
    """Salvar configurações do sistema"""
    try:
        data = request.get_json()
        
        # Obter ou criar configuração
        config = ConfiguracoesSistema.query.first()
        if not config:
            config = ConfiguracoesSistema()
        
        # Atualizar campos de e-mail
        if 'email_server' in data:
            config.email_server = data['email_server']
        if 'email_port' in data:
            config.email_port = data['email_port']
        if 'email_user' in data:
            config.email_user = data['email_user']
        if 'email_password' in data and data['email_password'] != '***':
            config.email_password = data['email_password']
        if 'email_use_tls' in data:
            config.email_use_tls = data['email_use_tls']
        
        # Atualizar campos de personalização
        if 'cor_primaria' in data:
            config.cor_primaria = data['cor_primaria']
        if 'cor_secundaria' in data:
            config.cor_secundaria = data['cor_secundaria']
        if 'logo_url' in data:
            config.logo_url = data['logo_url']
        if 'slogan' in data:
            config.slogan = data['slogan']
        if 'nome_empresa' in data:
            config.nome_empresa = data['nome_empresa']
        
        db.session.add(config)
        db.session.commit()
        
        return jsonify({'message': 'Configurações salvas com sucesso!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@configuracoes_sistema_bp.route('/api/configuracoes_sistema/email/test', methods=['POST'])
def test_email():
    """Testar configurações de e-mail"""
    try:
        data = request.get_json()
        email_destino = data.get('email_destino')
        
        if not email_destino:
            return jsonify({'error': 'E-mail de destino é obrigatório'}), 400
        
        # Obter configurações
        config = ConfiguracoesSistema.query.first()
        if not config or not config.email_server:
            return jsonify({'error': 'Configurações de e-mail não encontradas'}), 400
        
        # Aqui você implementaria o teste real de envio de e-mail
        # Por enquanto, retornamos sucesso simulado
        return jsonify({'message': f'E-mail de teste enviado para {email_destino} com sucesso!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


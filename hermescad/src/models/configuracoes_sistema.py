from flask_sqlalchemy import SQLAlchemy
from src.models.user import db

class ConfiguracoesSistema(db.Model):
    __tablename__ = 'configuracoes_sistema'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Configurações de E-mail
    email_server = db.Column(db.String(200))
    email_port = db.Column(db.Integer)
    email_user = db.Column(db.String(120))
    email_password = db.Column(db.String(200))
    email_use_tls = db.Column(db.Boolean, default=True)
    
    # Configurações de Personalização
    cor_primaria = db.Column(db.String(7), default='#007bff')  # Hex color
    cor_secundaria = db.Column(db.String(7), default='#6c757d')  # Hex color
    logo_url = db.Column(db.String(500))
    slogan = db.Column(db.String(200))
    nome_empresa = db.Column(db.String(200))
    
    def __repr__(self):
        return f'<ConfiguracoesSistema {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'email_server': self.email_server,
            'email_port': self.email_port,
            'email_user': self.email_user,
            'email_password': self.email_password,  # Em produção, não retornar a senha
            'email_use_tls': self.email_use_tls,
            'cor_primaria': self.cor_primaria,
            'cor_secundaria': self.cor_secundaria,
            'logo_url': self.logo_url,
            'slogan': self.slogan,
            'nome_empresa': self.nome_empresa
        }


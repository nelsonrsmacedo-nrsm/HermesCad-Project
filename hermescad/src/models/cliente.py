from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    endereco = db.Column(db.Text)
    numero_telefone = db.Column(db.String(20))
    numero_celular = db.Column(db.String(20))
    possui_whatsapp = db.Column(db.Boolean, default=False)
    area_atuacao = db.Column(db.String(100))
    cpf_cnpj = db.Column(db.String(20), unique=True)
    informacoes_financeiras = db.Column(db.Text)
    email = db.Column(db.String(120), unique=True)
    cargo = db.Column(db.String(100))
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Cliente {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'endereco': self.endereco,
            'numero_telefone': self.numero_telefone,
            'numero_celular': self.numero_celular,
            'possui_whatsapp': self.possui_whatsapp,
            'area_atuacao': self.area_atuacao,
            'cpf_cnpj': self.cpf_cnpj,
            'informacoes_financeiras': self.informacoes_financeiras,
            'email': self.email,
            'cargo': self.cargo,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }
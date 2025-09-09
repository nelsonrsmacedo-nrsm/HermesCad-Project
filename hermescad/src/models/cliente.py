from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    endereco = db.Column(db.Text)
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True)
    cnpj_cpf = db.Column(db.String(20), unique=True)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    contatos = db.relationship('Contato', backref='cliente', lazy=True, cascade='all, delete-orphan')
    oportunidades = db.relationship('Oportunidade', backref='cliente', lazy=True, cascade='all, delete-orphan')
    atividades = db.relationship('Atividade', backref='cliente', lazy=True)

    def __repr__(self):
        return f'<Cliente {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'endereco': self.endereco,
            'telefone': self.telefone,
            'email': self.email,
            'cnpj_cpf': self.cnpj_cpf,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }


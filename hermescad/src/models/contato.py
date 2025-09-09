from flask_sqlalchemy import SQLAlchemy
from src.models.user import db

class Contato(db.Model):
    __tablename__ = 'contatos'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    cargo = db.Column(db.String(100))
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True)

    def __repr__(self):
        return f'<Contato {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'nome': self.nome,
            'cargo': self.cargo,
            'telefone': self.telefone,
            'email': self.email
        }


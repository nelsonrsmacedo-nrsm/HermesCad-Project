from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Oportunidade(db.Model):
    __tablename__ = 'oportunidades'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float)
    status = db.Column(db.String(50), nullable=False, default='Prospecção')
    probabilidade = db.Column(db.Integer)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_fechamento_prevista = db.Column(db.DateTime)
    
    # Relacionamentos
    atividades = db.relationship('Atividade', backref='oportunidade', lazy=True)

    def __repr__(self):
        return f'<Oportunidade {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'nome': self.nome,
            'valor': self.valor,
            'status': self.status,
            'probabilidade': self.probabilidade,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_fechamento_prevista': self.data_fechamento_prevista.isoformat() if self.data_fechamento_prevista else None
        }


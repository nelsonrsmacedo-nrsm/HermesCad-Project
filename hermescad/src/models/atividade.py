from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Atividade(db.Model):
    __tablename__ = 'atividades'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'))
    oportunidade_id = db.Column(db.Integer, db.ForeignKey('oportunidades.id'))
    tipo = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.Text)
    data_hora = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False, default='Pendente')

    def __repr__(self):
        return f'<Atividade {self.tipo}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'oportunidade_id': self.oportunidade_id,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'data_hora': self.data_hora.isoformat() if self.data_hora else None,
            'status': self.status
        }


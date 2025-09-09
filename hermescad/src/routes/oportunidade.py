from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db
from src.models.oportunidade import Oportunidade

oportunidade_bp = Blueprint('oportunidade', __name__)

@oportunidade_bp.route('/oportunidades', methods=['GET'])
def get_oportunidades():
    oportunidades = Oportunidade.query.all()
    return jsonify([oportunidade.to_dict() for oportunidade in oportunidades])

@oportunidade_bp.route('/oportunidades/<int:id>', methods=['GET'])
def get_oportunidade(id):
    oportunidade = Oportunidade.query.get_or_404(id)
    return jsonify(oportunidade.to_dict())

@oportunidade_bp.route('/oportunidades/cliente/<int:cliente_id>', methods=['GET'])
def get_oportunidades_by_cliente(cliente_id):
    oportunidades = Oportunidade.query.filter_by(cliente_id=cliente_id).all()
    return jsonify([oportunidade.to_dict() for oportunidade in oportunidades])

@oportunidade_bp.route('/oportunidades', methods=['POST'])
def create_oportunidade():
    data = request.get_json()
    
    # Converter string de data para datetime se fornecida
    data_fechamento_prevista = None
    if data.get('data_fechamento_prevista'):
        try:
            data_fechamento_prevista = datetime.fromisoformat(data.get('data_fechamento_prevista'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido'}), 400
    
    oportunidade = Oportunidade(
        cliente_id=data.get('cliente_id'),
        nome=data.get('nome'),
        valor=data.get('valor'),
        status=data.get('status', 'Prospecção'),
        probabilidade=data.get('probabilidade'),
        data_fechamento_prevista=data_fechamento_prevista
    )
    
    try:
        db.session.add(oportunidade)
        db.session.commit()
        return jsonify(oportunidade.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@oportunidade_bp.route('/oportunidades/<int:id>', methods=['PUT'])
def update_oportunidade(id):
    oportunidade = Oportunidade.query.get_or_404(id)
    data = request.get_json()
    
    # Converter string de data para datetime se fornecida
    if data.get('data_fechamento_prevista'):
        try:
            oportunidade.data_fechamento_prevista = datetime.fromisoformat(data.get('data_fechamento_prevista'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido'}), 400
    
    oportunidade.nome = data.get('nome', oportunidade.nome)
    oportunidade.valor = data.get('valor', oportunidade.valor)
    oportunidade.status = data.get('status', oportunidade.status)
    oportunidade.probabilidade = data.get('probabilidade', oportunidade.probabilidade)
    
    try:
        db.session.commit()
        return jsonify(oportunidade.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@oportunidade_bp.route('/oportunidades/<int:id>', methods=['DELETE'])
def delete_oportunidade(id):
    oportunidade = Oportunidade.query.get_or_404(id)
    
    try:
        db.session.delete(oportunidade)
        db.session.commit()
        return jsonify({'message': 'Oportunidade deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


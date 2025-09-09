from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db
from src.models.atividade import Atividade

atividade_bp = Blueprint('atividade', __name__)

@atividade_bp.route('/atividades', methods=['GET'])
def get_atividades():
    atividades = Atividade.query.all()
    return jsonify([atividade.to_dict() for atividade in atividades])

@atividade_bp.route('/atividades/<int:id>', methods=['GET'])
def get_atividade(id):
    atividade = Atividade.query.get_or_404(id)
    return jsonify(atividade.to_dict())

@atividade_bp.route('/atividades/cliente/<int:cliente_id>', methods=['GET'])
def get_atividades_by_cliente(cliente_id):
    atividades = Atividade.query.filter_by(cliente_id=cliente_id).all()
    return jsonify([atividade.to_dict() for atividade in atividades])

@atividade_bp.route('/atividades/oportunidade/<int:oportunidade_id>', methods=['GET'])
def get_atividades_by_oportunidade(oportunidade_id):
    atividades = Atividade.query.filter_by(oportunidade_id=oportunidade_id).all()
    return jsonify([atividade.to_dict() for atividade in atividades])

@atividade_bp.route('/atividades', methods=['POST'])
def create_atividade():
    data = request.get_json()
    
    # Converter string de data para datetime se fornecida
    data_hora = datetime.utcnow()
    if data.get('data_hora'):
        try:
            data_hora = datetime.fromisoformat(data.get('data_hora'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido'}), 400
    
    atividade = Atividade(
        cliente_id=data.get('cliente_id'),
        oportunidade_id=data.get('oportunidade_id'),
        tipo=data.get('tipo'),
        descricao=data.get('descricao'),
        data_hora=data_hora,
        status=data.get('status', 'Pendente')
    )
    
    try:
        db.session.add(atividade)
        db.session.commit()
        return jsonify(atividade.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@atividade_bp.route('/atividades/<int:id>', methods=['PUT'])
def update_atividade(id):
    atividade = Atividade.query.get_or_404(id)
    data = request.get_json()
    
    # Converter string de data para datetime se fornecida
    if data.get('data_hora'):
        try:
            atividade.data_hora = datetime.fromisoformat(data.get('data_hora'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido'}), 400
    
    atividade.tipo = data.get('tipo', atividade.tipo)
    atividade.descricao = data.get('descricao', atividade.descricao)
    atividade.status = data.get('status', atividade.status)
    
    try:
        db.session.commit()
        return jsonify(atividade.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@atividade_bp.route('/atividades/<int:id>', methods=['DELETE'])
def delete_atividade(id):
    atividade = Atividade.query.get_or_404(id)
    
    try:
        db.session.delete(atividade)
        db.session.commit()
        return jsonify({'message': 'Atividade deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


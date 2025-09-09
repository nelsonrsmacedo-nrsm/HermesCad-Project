from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.contato import Contato

contato_bp = Blueprint('contato', __name__)

@contato_bp.route('/contatos', methods=['GET'])
def get_contatos():
    contatos = Contato.query.all()
    return jsonify([contato.to_dict() for contato in contatos])

@contato_bp.route('/contatos/<int:id>', methods=['GET'])
def get_contato(id):
    contato = Contato.query.get_or_404(id)
    return jsonify(contato.to_dict())

@contato_bp.route('/contatos/cliente/<int:cliente_id>', methods=['GET'])
def get_contatos_by_cliente(cliente_id):
    contatos = Contato.query.filter_by(cliente_id=cliente_id).all()
    return jsonify([contato.to_dict() for contato in contatos])

@contato_bp.route('/contatos', methods=['POST'])
def create_contato():
    data = request.get_json()
    
    contato = Contato(
        cliente_id=data.get('cliente_id'),
        nome=data.get('nome'),
        cargo=data.get('cargo'),
        telefone=data.get('telefone'),
        email=data.get('email')
    )
    
    try:
        db.session.add(contato)
        db.session.commit()
        return jsonify(contato.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@contato_bp.route('/contatos/<int:id>', methods=['PUT'])
def update_contato(id):
    contato = Contato.query.get_or_404(id)
    data = request.get_json()
    
    contato.nome = data.get('nome', contato.nome)
    contato.cargo = data.get('cargo', contato.cargo)
    contato.telefone = data.get('telefone', contato.telefone)
    contato.email = data.get('email', contato.email)
    
    try:
        db.session.commit()
        return jsonify(contato.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@contato_bp.route('/contatos/<int:id>', methods=['DELETE'])
def delete_contato(id):
    contato = Contato.query.get_or_404(id)
    
    try:
        db.session.delete(contato)
        db.session.commit()
        return jsonify({'message': 'Contato deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


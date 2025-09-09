from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.cliente import Cliente

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/clientes', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes])

@cliente_bp.route('/clientes/<int:id>', methods=['GET'])
def get_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    return jsonify(cliente.to_dict())

@cliente_bp.route('/clientes', methods=['POST'])
def create_cliente():
    data = request.get_json()
    
    cliente = Cliente(
        nome=data.get('nome'),
        endereco=data.get('endereco'),
        telefone=data.get('telefone'),
        email=data.get('email'),
        cnpj_cpf=data.get('cnpj_cpf')
    )
    
    try:
        db.session.add(cliente)
        db.session.commit()
        return jsonify(cliente.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@cliente_bp.route('/clientes/<int:id>', methods=['PUT'])
def update_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    data = request.get_json()
    
    cliente.nome = data.get('nome', cliente.nome)
    cliente.endereco = data.get('endereco', cliente.endereco)
    cliente.telefone = data.get('telefone', cliente.telefone)
    cliente.email = data.get('email', cliente.email)
    cliente.cnpj_cpf = data.get('cnpj_cpf', cliente.cnpj_cpf)
    
    try:
        db.session.commit()
        return jsonify(cliente.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@cliente_bp.route('/clientes/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    
    try:
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({'message': 'Cliente deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


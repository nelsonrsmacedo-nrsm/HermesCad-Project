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
        numero_telefone=data.get("numero_telefone"),
        numero_celular=data.get("numero_celular"),
        possui_whatsapp=data.get("possui_whatsapp"),
        area_atuacao=data.get("area_atuacao"),
        cpf_cnpj=data.get("cpf_cnpj"),
        informacoes_financeiras=data.get("informacoes_financeiras"),
        email=data.get("email"),
        cargo=data.get("cargo"),
        site=data.get("site")
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
    cliente.numero_telefone = data.get("numero_telefone", cliente.numero_telefone)
    cliente.numero_celular = data.get("numero_celular", cliente.numero_celular)
    cliente.possui_whatsapp = data.get("possui_whatsapp", cliente.possui_whatsapp)
    cliente.area_atuacao = data.get("area_atuacao", cliente.area_atuacao)
    cliente.cpf_cnpj = data.get("cpf_cnpj", cliente.cpf_cnpj)
    cliente.informacoes_financeiras = data.get("informacoes_financeiras", cliente.informacoes_financeiras)
    cliente.email = data.get("email", cliente.email)
    cliente.cargo = data.get("cargo", cliente.cargo)
    cliente.site = data.get("site", cliente.site)


    
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


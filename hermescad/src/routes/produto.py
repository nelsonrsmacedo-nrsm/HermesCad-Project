from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.produto import Produto

produto_bp = Blueprint('produto', __name__)

@produto_bp.route('/produtos', methods=['GET'])
def get_produtos():
    produtos = Produto.query.all()
    return jsonify([produto.to_dict() for produto in produtos])

@produto_bp.route('/produtos/<int:id>', methods=['GET'])
def get_produto(id):
    produto = Produto.query.get_or_404(id)
    return jsonify(produto.to_dict())

@produto_bp.route('/produtos', methods=['POST'])
def create_produto():
    data = request.get_json()
    
    produto = Produto(
        nome=data.get('nome'),
        descricao=data.get('descricao'),
        preco=data.get('preco')
    )
    
    try:
        db.session.add(produto)
        db.session.commit()
        return jsonify(produto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@produto_bp.route('/produtos/<int:id>', methods=['PUT'])
def update_produto(id):
    produto = Produto.query.get_or_404(id)
    data = request.get_json()
    
    produto.nome = data.get('nome', produto.nome)
    produto.descricao = data.get('descricao', produto.descricao)
    produto.preco = data.get('preco', produto.preco)
    
    try:
        db.session.commit()
        return jsonify(produto.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@produto_bp.route('/produtos/<int:id>', methods=['DELETE'])
def delete_produto(id):
    produto = Produto.query.get_or_404(id)
    
    try:
        db.session.delete(produto)
        db.session.commit()
        return jsonify({'message': 'Produto deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


from flask import Blueprint, request
from app.service.database import cliente

bp = Blueprint('clientes', __name__)

@bp.route("/get_clientes")
def get_clientes():
    return cliente.get_clientes()

@bp.route("/insert_cliente", methods=['POST'])
def insert_cliente():
    dados = {
        'razao_social': request.form.get('razao_social'),
        'endereco': request.form.get('endereco'),
        'nome_cabecalho': request.form.get('nome_cabecalho'),
        }
    cliente_insert = cliente.insert_cliente(dados)
   
    return cliente_insert.to_dict()

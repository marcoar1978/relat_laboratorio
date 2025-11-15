from flask import Blueprint, request
from app.service.database.relatorio import *

bp = Blueprint('relatorios', __name__)

@bp.route("/insert_relatorio", methods=['POST'])
def insert_relatorio():
    dados = {
        'cliente_id': request.form.get('cliente_id'),
        'nome_cliente': request.form.get('nome_cliente'),
        'tipo_relatorio': request.form.get('tipo_relatorio'),
        'detalhes': request.form.get('detalhes')
    }

    insert_relatorio_db(dados)

    return dados

@bp.route("/list_relatorios")
def list_relatorios():
    return list_relatorios_db()

@bp.route("/get_relatorio/<rel_id>")
def get_relatorio(rel_id):
    return get_relatorio_by_id(rel_id)
from app.models.cliente import Cliente
from app.extensions.database import db


def get_clientes():
    clientes = Cliente.query.order_by(Cliente.razao_social).all()
    for cliente in clientes:
       return [cliente.to_dict() for cliente in clientes]

def insert_cliente(dados):
    cliente = Cliente()
    cliente.razao_social = dados.get('razao_social')
    cliente.endereco = dados.get('endereco')
    cliente.nome_cabecalho = dados.get('nome_cabecalho')

    db.session.add(cliente)
    db.session.commit()
    db.session.refresh(cliente)

    return cliente
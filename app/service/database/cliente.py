from app.models.cliente import Cliente


def get_clientes():
    clientes = Cliente.query.all()
    for cliente in clientes:
       return [cliente.to_dict() for cliente in clientes]

    
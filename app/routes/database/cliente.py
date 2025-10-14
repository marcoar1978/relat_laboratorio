from flask import Blueprint
from app.service.database import cliente

bp = Blueprint('clientes', __name__)

@bp.route("/get_clientes")
def get_clientes():
    return cliente.get_clientes()
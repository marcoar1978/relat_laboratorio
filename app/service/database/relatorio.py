from app.extensions.database import db
from app.models.relatorio import Relatorio
from datetime import datetime
import pytz
import json

def getDataTimezone():
     tz_Brasilia = pytz.timezone('America/Sao_Paulo')
     return datetime.now(tz_Brasilia)

def insert_relatorio_db(relatorio):

    relat = Relatorio()
    relat.cliente_id = relatorio.get('cliente_id')
    relat.nome_cliente = relatorio.get('nome_cliente')
    relat.detalhes =  relatorio.get('detalhes')
    relat.tipo_relatorio = relatorio.get('tipo_relatorio')
    relat.data_inclusao = getDataTimezone()

    db.session.add(relat)
    db.session.commit()

def list_relatorios_db():
     relatorios = Relatorio.query.all()

     return [relatorio.to_dict() for relatorio in relatorios]
     


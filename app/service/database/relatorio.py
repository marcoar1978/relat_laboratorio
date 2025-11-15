from flask import send_file
from app.extensions.database import db
from app.models.relatorio import Relatorio
from app.models.cliente import Cliente
from app.service.word import relatorio
from datetime import datetime
import pytz
import json
import os

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
     
def get_relatorio_by_id(rel_id):
     relat = Relatorio.query.filter(Relatorio.id == int(rel_id)).first()
     relat_dict = relat.to_dict()
     
     relatorio.gerar_relatorio(relat_dict.get('detalhes'))
     
     return send_file(f"{os.getcwd()}/app/templates/relat/temp/arquivo.docx"), 200
    
     
    
     

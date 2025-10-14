from app.extensions.database import db
from sqlalchemy.dialects.postgresql import JSONB
# from sqlalchemy import JSONB, DateTime
import json

class Relatorio(db.Model):
    __tablename__ = 'relatorio'

    id = db.Column(db.Integer, primary_key = True)
    cliente_id = db.Column(db.Integer)
    nome_cliente = db.Column(db.String(500))
    tipo_relatorio = db.Column(db.Integer)
    data_inclusao = db.Column(db.DateTime)
    detalhes = db.Column(JSONB)

    def to_dict(self):
        detalhes_dict = None
        if self.detalhes != None:
            detalhes_dict = json.loads(self.detalhes)
        
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'nome_cliente': self.nome_cliente,
            'tipo_relatorio': self.tipo_relatorio,
            'data_inclusao': self.data_inclusao,
            'detalhes': detalhes_dict
        }
from app.extensions.database import db

class Cliente(db.Model):
    __tablename__ = 'cliente'

    id = db.Column(db.Integer, primary_key = True)
    razao_social = db.Column(db.String(500))
    endereco = db.Column(db.String(500))
    nome_cabecalho = db.Column(db.String(500))
    

    def to_dict(self):
        return {
            'id': self.id,
            'razao_social': self.razao_social,
            'endereco': self.endereco,
            'nome_cabecalho': self.nome_cabecalho
            
        }

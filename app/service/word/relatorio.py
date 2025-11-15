from docxtpl import DocxTemplate, RichText, R



def gerar_relatorio(dados):
    context = {
        'razao_social': dados.get('cliente').get('razao_social'),
        'endereco': dados.get('cliente').get('endereco'),
        'responsavel': '--[RESPONSÁVEL]--',
        'laboratorio': '--[LABORATÓRIO]--',
        'tipo_material': dados.get('tipo_material'),
        'objetivo': dados.get('objetivo'),

        'lotes': dados.get('lote'),
        'lotes_result': dados.get('lote'),
        
    }

    tpl = DocxTemplate('app/templates/relat/relat_template.docx')
    tpl.render(context)
    tpl.save(f'app/templates/relat/temp/arquivo.docx')



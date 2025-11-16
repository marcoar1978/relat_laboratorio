from docxtpl import DocxTemplate, RichText, R



def gerar_relatorio(dados):
    
    
    for lote in dados.get('lote'):
        for res in lote.get('resultado'):
            rt = RichText()
            if res.get('comp').get('atende_abnt') == False:
                print(f"False - {res['comp']['valor']}")
                rt.add(res['comp']['valor'], color="FF0000")
            else:
                print(f"True - {res['comp']['valor']}")
                rt.add(res['comp']['valor'], color="808080") 
            res['comp']['valor_format'] = rt

            # print(res.get('comp'))

    
    
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



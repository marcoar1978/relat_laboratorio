from docxtpl import DocxTemplate, RichText, R


def get_valor_format(lotes):
    
    propriedades_list  = ['comp', 'altura', 'espessura', 'long', 'largura', 'transv']
                              
    for lote in lotes:
        for res in lote.get('resultado'):
            for propriedade in  propriedades_list:
                format_valor(res, propriedade)
                    
    return lotes
            

def format_valor(res, propriedade):
    color_red = "FF0000"
    color_grey = "000000"

    rt = RichText()
    if res.get(propriedade).get('atende_abnt') == False:
        rt.add(res[propriedade]['valor'], color=color_red)
    else:
        rt.add(res[propriedade]['valor'], color=color_grey) 
    
    res[propriedade]['valor_format'] = rt
    



def gerar_relatorio(dados):
        
    lotes_format = get_valor_format(dados.get('lote'))   
    
    context = {
        'razao_social': dados.get('cliente').get('razao_social'),
        'endereco': dados.get('cliente').get('endereco'),
        'responsavel': '--[RESPONSÁVEL]--',
        'laboratorio': '--[LABORATÓRIO]--',
        'tipo_material': dados.get('tipo_material'),
        'objetivo': dados.get('objetivo'),

        'lotes': dados.get('lote'),
        'lotes_result': lotes_format,
        
    }

    tpl = DocxTemplate('app/templates/relat/relat_template.docx')
    tpl.render(context)
    tpl.save(f'app/templates/relat/temp/arquivo.docx')



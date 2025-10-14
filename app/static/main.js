tipo_relatorio = 0;
clientes = [];
relatorios = []
relatorio_input = {}
relatorio = {};
lote_referencia_blocos = 0;
lote_referencia_blocos_sub = [];

init();

function init() {
  get_clientes();
  list_relatorios()

  setTimeout(() => {
    $("#icon-minus-sub").hide();
  }, 400);
}

$(document).ready(function () {
  $(document).on("change", "#tipo_relatorio", (e) => {
    tipo_relatorio = $(`#${e.currentTarget.id}`).val();
    $(".div-insercao-relatorio").hide();
    $(`#div-insercao-relatorio__${tipo_relatorio}`).show();
    if (tipo_relatorio == "1") {
      render_form_referencia_blocos();
    }

    if (tipo_relatorio != "0") {
      $("#salvar-relatorio").show();
    }
  });

  $(document).on("change", "#tipo_material", () => {
    value = $("#tipo_material").val();
    caracterizacao = "";
    if (value == "bloco_concreto")
      caracterizacao = "Objetivo - Bloco de concreto";
    else if (value == "caracterizacao")
      caracterizacao = "Objetivo - Caracterização de agregados";
    $("#objetivo").val(caracterizacao);
  });

  $(document).on("click", "#icon-plus-sub", (e) => {
    render_form_referencia_blocos();
    $("#icon-minus-sub").show();
  });

  $(document).on("click", "#icon-minus-sub", (e) => {
    lote_referencia_blocos--;
    if (lote_referencia_blocos > 0) {
      $(`#div-referencia__${lote_referencia_blocos}`).remove();
    }
    if (lote_referencia_blocos == 1) {
      $("#icon-minus-sub").hide();
    }
  });

  $(document).on("click", "#salvar-relatorio", () => {
    get_dados_relatorio();
    console.log(relatorio_input)
    insert_relatorio()
  });

  $(document).on('click', '#page-lista', () => {
    $('#inclusao_relatorio').fadeOut(300, () => {
      $('#lista_relatorios').fadeIn(300)
    })
  })

  $(document).on('click', '#page-inclusao-relatorio', () => {
    $('#lista_relatorios').fadeOut(300, () => {
      $('#inclusao_relatorio').fadeIn(300)
    })
  })

  $(document).on('click','.icon-download', (e) => {
    rel_id = e.currentTarget.id.split('__')[1]
    rel = relatorios.find(relatorio => relatorio.id == rel_id)
  })

});

function get_clientes() {
  $.ajax({
    url: "/get_clientes",
    method: "get",
    success: (response) => {
      clientes = response;
      render_select_clientes();
    },
  });
}

function render_select_clientes() {
  $("#cliente_id").html("").append(`<option value="0">SELECIONE O CLIENTE`);
  clientes.forEach((cliente) => {
    div = `<option value=${cliente.id}> ${cliente.razao_social}`;
    $("#cliente_id").append(div);
  });
}

function render_form_referencia_blocos() {
  if (lote_referencia_blocos_sub[lote_referencia_blocos]) {
    lote_referencia_blocos_sub[lote_referencia_blocos]++;
  } else {
    lote_referencia_blocos_sub[lote_referencia_blocos] = 0;
  }

  div = `
        <div class='div-referencia' id='div-referencia__${lote_referencia_blocos}'>
        <div style="font-size:24px;font-weight: bold;margin-top:20px;">Lote ${
          lote_referencia_blocos + 1
        }</div>

          <table class="table-light" style="margin-top:20px;">
              <thead>
                <tr style="font-size:14px">
                  <th style="text-align: center;">Lote</th>
                  <th style="text-align: center;">Data Fabricação</th>
                  <th style="text-align: center;">Blocos de Concreto<br>(un)</th>
                  <th style="text-align: center;">Dimensão Teórica<br>(cm)</th>
                  <th style="text-align: center;">Fbk  Teórico<br>(MPa)</th>
                  <th style="text-align: center;">Com função estrutural?<br> (Sim/Não)</th>
                </tr>
                <tr>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='lote__${lote_referencia_blocos}' class="form-control">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='data_fabricacao__${lote_referencia_blocos}' class="form-control">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='blocos_concreto__${lote_referencia_blocos}' class="form-control">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='dimensao_teorica__${lote_referencia_blocos}' class="form-control">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='fbk_teorico__${lote_referencia_blocos}' class="form-control">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <select id='com_funcao_estrutural__${lote_referencia_blocos}' class="form-select">
                      <option value="0">
                      <option value="sim">Sim
                      <option value="nao">Não  
                    </select>
                  </td>
                </tr>  
              </table>
              
              ${render_form_referencia_blocos_sub()}
            </div> 
            
    `;
  $(`#referencias_bloco`).append(div);
  render_form_referencia_blocos_content_sub()
  lote_referencia_blocos++;
   
}

function render_form_referencia_blocos_sub() {
  
  
  div = `
        <div style='display:flex;justify-content:center'>
        <table style="margin-top:30px;margin-bottom:30px;background-color: #f8f9fa;font-size:14px;width:95%;"> 
             <thead>   
                <tr>
                    <th colspan='10' class='th-cel-table' style='font-weight:bold;padding:5px'>RESULTADOS</th>
                     
                </tr>
                <tr>
                    <th rowspan='2' class='th-cel-table'>Nº Bloco</th>
                    <th rowspan='2' class='th-cel-table'>Massa<br>(gramas)</th>
                    <th colspan='3' class='th-cel-table'>Dimensões Médias (mm)</th>
                    <th colspan='2' class='th-cel-table'>Paredes (mm)</th>
                    <th rowspan='2' class='th-cel-table'>Espessura<br/>Equivalente<br/>(mm/m)</th>
                    <th rowspan='2' class='th-cel-table'>Carga (N)</th>
                    <th rowspan='2' class='th-cel-table'>Resistência à compressão<br/>(MPa)</th>
                   
                 </tr>
                <tr>           
                    <th class='th-cel-table'>Comp.</th>
                    <th class='th-cel-table'>Largura</th>
                    <th class='th-cel-table'>Altura</th>
                    <th class='th-cel-table'>Long.</th>
                    <th class='th-cel-table'>Transv.</th>
                </tr>
            </thead>
            <tbody id='table-lote-sub__${lote_referencia_blocos}'>
                
            </tbody>
        </table>
        </div>
    
    `;

  return div;
}

function render_form_referencia_blocos_content_sub() {
  console.log(lote_referencia_blocos)
  
  for(i = 0; i < 6; i++){
      div = `
        <tr>
            <td class='th-cel-table'><input type='text' id='n_bloco__${lote_referencia_blocos}__${i}' value='${i + 1}' class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='massa__${lote_referencia_blocos}__${i}'  class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='comp__${lote_referencia_blocos}__${i}' class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='largura__${lote_referencia_blocos}__${i}' class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='altura__${lote_referencia_blocos}__${i}'  class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='long__${lote_referencia_blocos}__${i}' class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='transv__${lote_referencia_blocos}__${i}' class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='espessura__${lote_referencia_blocos}__${i}'  class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='carga__${lote_referencia_blocos}__${i}'  class="form-control"></td>
            <td class='th-cel-table'><input type='text' id='resistencia__${lote_referencia_blocos}__${i}'  class="form-control"></td>
            
            
        </tr>    
    
    `;
  $(`#table-lote-sub__${lote_referencia_blocos}`).append(div);

  } 
}

function get_dados_relatorio() {
  relatorio = {}
  cliente_id = $(`#cliente_id`).val()
  relatorio['cliente'] = clientes.find(c => c.id == cliente_id) 
  relatorio['tipo_material'] = $(`#tipo_material`).val()
  relatorio['objetivo'] = $(`#objetivo`).val()

  if (tipo_relatorio == 1) {
    relatorio["lote"] = [];
    for (num_lote = 0; num_lote < lote_referencia_blocos; num_lote++) {
      resultados = []
      for(num_lote_sub = 0; num_lote_sub < 6; num_lote_sub++){
        resultado = {
          n_bloco: $(`#n_bloco__${num_lote}__${num_lote_sub}`).val(),
          massa: $(`#massa__${num_lote}__${num_lote_sub}`).val(),
          comp: $(`#comp__${num_lote}__${num_lote_sub}`).val(),
          largura: $(`#largura__${num_lote}__${num_lote_sub}`).val(),
          altura: $(`#altura__${num_lote}__${num_lote_sub}`).val(),
          long: $(`#long__${num_lote}__${num_lote_sub}`).val(),
          transv: $(`#transv__${num_lote}__${num_lote_sub}`).val(),
          espessura: $(`#espessura__${num_lote}__${num_lote_sub}`).val(),
          carga: $(`#resistencia__${num_lote}__${num_lote_sub}`).val()
        }
        resultados.push(resultado)
      }

      relatorio["lote"][num_lote] = {
        lote: $(`#lote__${num_lote}`).val(),
        data_fabricacao: $(`#data_fabricacao__${num_lote}`).val(),
        blocos_concreto: $(`#blocos_concreto__${num_lote}`).val(),
        dimensao_teorica: $(`#dimensao_teorica__${num_lote}`).val(),
        fbk_teorico: $(`#fbk_teorico__${num_lote}`).val(),
        com_funcao_estrutural: $(`#com_funcao_estrutural__${num_lote}`).val(),
        resultado: resultados
      };
    }
    
    relatorio_input = {
      cliente_id: cliente_id,
      nome_cliente: relatorio['cliente'].razao_social,
      tipo_relatorio: tipo_relatorio,
      detalhes: JSON.stringify(relatorio)
    }
   
  }
}




function insert_relatorio(){
  $.ajax({
    url: '/insert_relatorio',
    method: 'post',
    data: relatorio_input,
    success: (response) => {
      console.log(response)
    }
  })
}

function list_relatorios(){
  $.ajax({
    url: '/list_relatorios',
    method: 'get',
    success: (response) => {
      console.log(response)
      relatorios = response
      render_lista_relatorios()
    }
  })
}

function render_lista_relatorios(){
  $('#table-lista-relatorios').html('')
  relatorios.forEach(rel => {
    div = `
      <tr>
        <td>${rel.nome_cliente}</td>
        <td style="text-align: center;">--</td>
        <td style="text-align: center;">--</td>
        <td style="text-align: center;">
          <i class="bi bi-file-text icon-download" style='cursor:pointer;color:#000099;font-size:18px' id='icon-download__${rel.id}'></i>
        </td>
      </tr>
      `
    $('#table-lista-relatorios').append(div)  
  })
}



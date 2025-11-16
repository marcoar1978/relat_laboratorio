init();

function init() {
  get_clientes();
  list_relatorios();

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
    // console.log(relatorio_input)
    insert_relatorio();
  });

  $(document).on("click", "#page-lista", () => {
    $("#inclusao_relatorio").fadeOut(300, () => {
      $("#lista_relatorios").fadeIn(300);
    });
  });

  $(document).on("click", "#page-inclusao-relatorio", () => {
    $("#lista_relatorios").fadeOut(300, () => {
      $("#inclusao_relatorio").fadeIn(300);
    });
  });

  $(document).on("click", ".icon-download", (e) => {
    rel_id = e.currentTarget.id.split("__")[1];
    rel = relatorios.find((relatorio) => relatorio.id == rel_id);
  });

  $(document).on("blur", ".carga-kgf", (e) => {
    id_split = e.currentTarget.id.split("__");
    const value_kgf = $(`#${e.currentTarget.id}`).val();
    const value_n = parseFloat(value_kgf) * 9.80665;
    const lote_id = id_split[1];
    const sub_lote_id = id_split[2];
    if (!isNaN(value_n)) {
      $(`#carga-n__${lote_id}__${sub_lote_id}`).val(value_n.toFixed(3));
    } else {
      $(`#carga-n__${lote_id}__${sub_lote_id}`).val("");
    }
  });

  $(document).on("blur", ".mpa", (e) => {
    id_split = e.currentTarget.id.split("__");
    const lote_id = id_split[1];
    const sub_lote_id = id_split[2];
    calcular_mpa(lote_id, sub_lote_id);
  });

  $(document).on("blur", ".parede-transv, .comp", (e) => {
    id_split = e.currentTarget.id.split("__");
    const lote_id = id_split[1];
    const sub_lote_id = id_split[2];

    const primeira = parseFloat(
      $(`#parede-transv-1__${lote_id}__${sub_lote_id}`).val()
    );
    const segunda = parseFloat(
      $(`#parede-transv-2__${lote_id}__${sub_lote_id}`).val()
    );
    const terceira = parseFloat(
      $(`#parede-transv-3__${lote_id}__${sub_lote_id}`).val()
    );
    const comp = parseFloat($(`#comp__${lote_id}__${sub_lote_id}`).val());

    if (
      !isNaN(primeira) &&
      !isNaN(segunda) &&
      !isNaN(terceira) &&
      !isNaN(comp)
    ) {
      const result = (primeira + segunda + terceira) / (comp / 100);
      $(`#espessura__${lote_id}__${sub_lote_id}`).val(result.toFixed(3));
    }
  });

  $(document).on("change", ".dimensao_teorica, .com_funcao_estrutural", (e) => {
    lote_id = e.currentTarget.id.split("__")[1];
    def_dimensoes(lote_id);
  });

  $(document).on("blur", ".fbk_teorico", (e) => {
    lote_id = e.currentTarget.id.split("__")[1];

    def_dimensoes(lote_id);
  });
});

function def_dimensoes(lote_id) {
  fbk_teorico = $(`#fbk_teorico__${lote_id}`).val();
  dimensao_teorica = $(`#dimensao_teorica__${lote_id}`).val();
  com_funcao_estrutural = $(`#com_funcao_estrutural__${lote_id}`).val();

  if (fbk_teorico && dimensao_teorica && com_funcao_estrutural) {
    if (com_funcao_estrutural == "Não") {
      if (dimensao_teorica == "14x19x39") {
        dimensaoChoose[parseInt(lote_id)] = dimensao[0];
      } else if (dimensao_teorica == "19x19x39") {
        dimensaoChoose[parseInt(lote_id)] = dimensao[1];
      }
    } else if (com_funcao_estrutural == "Sim") {
      if (fbk_teorico > 3 && fbk_teorico < 4) {
        if (dimensao_teorica == "14x19x39") {
          dimensaoChoose[parseInt(lote_id)] = dimensao[0];
        } else if (dimensao_teorica == "19x19x39") {
          dimensaoChoose[parseInt(lote_id)] = dimensao[1];
        }
      } else if (fbk_teorico >= 4) {
        if (dimensao_teorica == "14x19x39") {
          dimensaoChoose[parseInt(lote_id)] = dimensao[2];
        } else if (dimensao_teorica == "19x19x39") {
          dimensaoChoose[parseInt(lote_id)] = dimensao[3];
        }
      }
    }
    console.log(dimensaoChoose);
  }
}

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

       <div style='display:flex;justify-content:center'>
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
                    <input type="text" id='lote__${lote_referencia_blocos}' class="form-control lote">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='data_fabricacao__${lote_referencia_blocos}' class="form-control data_fabricacao">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='blocos_concreto__${lote_referencia_blocos}' class="form-control blocos_concreto">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <select id='dimensao_teorica__${lote_referencia_blocos}' class="form-select dimensao_teorica">
                      <option value=''>
                      <option value='14x19x39'>14x19x39 cm
                      <option value='19x19x39'>19x19x39 cm
                    </select>
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='fbk_teorico__${lote_referencia_blocos}' class="form-control fbk_teorico">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <select id='com_funcao_estrutural__${lote_referencia_blocos}' class="form-select com_funcao_estrutural">
                      <option value="">
                      <option value="Sim">Sim
                      <option value="Não">Não  
                    </select>
                  </td>
                </tr>  
              </table>
            </div>  
              ${render_form_referencia_blocos_sub()}
            </div> 
            
    `;
  $(`#referencias_bloco`).append(div);
  render_form_referencia_blocos_content_sub();
  lote_referencia_blocos++;
}

function render_form_referencia_blocos_sub() {
  div = `
        <div style='display:flex;justify-content:center'>
        <table style="margin-top:30px;margin-bottom:30px;background-color: #f8f9fa;font-size:14px;width:95%;"> 
             <thead>   
                <tr>
                    <th colspan='14' class='th-cel-table' style='font-weight:bold;padding:5px'>RESULTADOS</th>
                     
                </tr>
                <tr>
                    <th rowspan='2' class='th-cel-table'>Nº Bloco</th>
                    <th rowspan='2' class='th-cel-table'>Massa<br>(gramas)</th>
                    <th colspan='3' class='th-cel-table'>Dimensões Médias (mm)</th>
                    <th colspan='2' class='th-cel-table'>Paredes (mm)</th>
                    <th colspan='3' class='th-cel-table'>Parede Transversal</th>
                    <th rowspan='2' class='th-cel-table'>Espessura<br/>Equivalente<br/>(mm/m)</th>
                    <th rowspan='2' class='th-cel-table'>Carga (Kgf)</th>
                    <th rowspan='2' class='th-cel-table'>Carga (N)</th>
                    <th rowspan='2' class='th-cel-table'>Resistência à compressão<br/>(MPa)</th>
                   
                 </tr>
                <tr>           
                    <th class='th-cel-table'>Comp.</th>
                    <th class='th-cel-table'>Largura</th>
                    <th class='th-cel-table'>Altura</th>
                    <th class='th-cel-table'>Long.</th>
                    <th class='th-cel-table'>Transv.</th>
                    <th class='th-cel-table'>1º</th>
                    <th class='th-cel-table'>2º</th>
                    <th class='th-cel-table'>3º</th>
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
  console.log(lote_referencia_blocos);

  for (i = 0; i < 6; i++) {
    div = `
        <tr>
            <td class='th-cel-table'><input type='text' id='n_bloco__${lote_referencia_blocos}__${i}' value='${
      i + 1
    }' class="n_bloco form-control"></td>
            <td class='th-cel-table'><input type='text' id='massa__${lote_referencia_blocos}__${i}'   value='9485' class="massa form-control"></td>
            <td class='th-cel-table'><input type='text' id='comp__${lote_referencia_blocos}__${i}'  value='390' class="comp mpa form-control"></td>
            <td class='th-cel-table'><input type='text' id='largura__${lote_referencia_blocos}__${i}' value='141' class="largura mpa form-control"></td>
            <td class='th-cel-table'><input type='text' id='altura__${lote_referencia_blocos}__${i}'  value='189' class="altura form-control"></td>
            <td class='th-cel-table'><input type='text' id='long__${lote_referencia_blocos}__${i}' value='23' class="long form-control"></td>
            <td class='th-cel-table'><input type='text' id='transv__${lote_referencia_blocos}__${i}' value='25' class="transv form-control"></td>
            <td class='th-cel-table'><input type='text' id='parede-transv-1__${lote_referencia_blocos}__${i}'  value='10' class="parede-transv form-control"></td>
            <td class='th-cel-table'><input type='text' id='parede-transv-2__${lote_referencia_blocos}__${i}' value='10' class="parede-transv form-control"></td>
            <td class='th-cel-table'><input type='text' id='parede-transv-3__${lote_referencia_blocos}__${i}' value='10'  class="parede-transv form-control"></td>
            <td class='th-cel-table'><input type='text' id='espessura__${lote_referencia_blocos}__${i}'  value='185' disabled=disabled class="espessura form-control"></td>
            <td class='th-cel-table'><input type='text' id='carga-kgf__${lote_referencia_blocos}__${i}'   class="carga-kgf mpa form-control"></td>
            <td class='th-cel-table'><input type='text' id='carga-n__${lote_referencia_blocos}__${i}' value='238' disabled=disabled   class="carga-n form-control"></td>
            <td class='th-cel-table'><input type='text' id='resistencia__${lote_referencia_blocos}__${i}'  value='4.3' disabled=disabled   class="resistencia form-control"></td>
       </tr>    
    
    `;
    $(`#table-lote-sub__${lote_referencia_blocos}`).append(div);
  }
}

function calcular_mpa(lote_id, sub_lote_id) {
  const carga_kgf = $(`#carga-kgf__${lote_id}__${sub_lote_id}`).val();
  const carga_n = parseFloat(carga_kgf) * 9.80665;
  const comp = $(`#comp__${lote_id}__${sub_lote_id}`).val();
  const largura = $(`#largura__${lote_id}__${sub_lote_id}`).val();

  const resistencia =
    parseFloat(carga_n) / (parseFloat(comp) * parseFloat(largura));
  if (!isNaN(resistencia)) {
    $(`#resistencia__${lote_id}__${sub_lote_id}`).val(resistencia.toFixed(3));
  } else {
    $(`#resistencia__${lote_id}__${sub_lote_id}`).val("");
  }
}

function get_dados_relatorio() {
  relatorio = {};
  cliente_id = $(`#cliente_id`).val();
  relatorio["cliente"] = clientes.find((c) => c.id == cliente_id);
  relatorio["tipo_material"] = $(`#tipo_material`).val();
  relatorio["objetivo"] = $(`#objetivo`).val();

  if (tipo_relatorio == 1) {
    relatorio["lote"] = [];
    for (num_lote = 0; num_lote < lote_referencia_blocos; num_lote++) {
      resultados = [];
      for (num_lote_sub = 0; num_lote_sub < 6; num_lote_sub++) {
        resultado = {
          n_bloco: $(`#n_bloco__${num_lote}__${num_lote_sub}`).val(),
          massa: $(`#massa__${num_lote}__${num_lote_sub}`).val(),
          comp: verif_comp_abnt(num_lote, parseFloat($(`#comp__${num_lote}__${num_lote_sub}`).val())),
          largura: verif_largura_abnt(num_lote, parseFloat($(`#largura__${num_lote}__${num_lote_sub}`).val())),
          altura: verif_altura_abnt(num_lote, parseFloat($(`#altura__${num_lote}__${num_lote_sub}`).val())),
          long: verif_long_abnt(num_lote, parseFloat($(`#long__${num_lote}__${num_lote_sub}`).val())),
          transv: verif_transv_abnt(num_lote, parseFloat($(`#transv__${num_lote}__${num_lote_sub}`).val())),
          parede_transv_1: $(
            `#parede-transv-1__${num_lote}__${num_lote_sub}`
          ).val(),
          parede_transv_2: $(
            `#parede-transv-2__${num_lote}__${num_lote_sub}`
          ).val(),
          parede_transv_3: $(
            `#parede-transv-3__${num_lote}__${num_lote_sub}`
          ).val(),
          espessura: verif_espessura_abnt(num_lote, parseFloat($(`#espessura__${num_lote}__${num_lote_sub}`).val())),
          carga_kgf: $(`#carga-kgf__${num_lote}__${num_lote_sub}`).val(),
          carga_n: $(`#carga-n__${num_lote}__${num_lote_sub}`).val(),
          resistencia: $(`#resistencia__${num_lote}__${num_lote_sub}`).val(),
        };
        resultados.push(resultado);
      }

      norma_abnt = verif_atende_norma_abnt(num_lote, resultados);

      relatorio["lote"][num_lote] = {
        lote: $(`#lote__${num_lote}`).val(),
        data_fabricacao: $(`#data_fabricacao__${num_lote}`).val(),
        blocos_concreto: $(`#blocos_concreto__${num_lote}`).val(),
        dimensao_teorica: $(`#dimensao_teorica__${num_lote}`).val(),
        fbk_teorico: $(`#fbk_teorico__${num_lote}`).val(),
        com_funcao_estrutural: $(`#com_funcao_estrutural__${num_lote}`).val(),
        dimensao_padrao: dimensaoChoose[num_lote],
        resultado: resultados,
        norma_abnt: norma_abnt,
      };
    }
    console.log(resultados)
    
    relatorio_input = {
      cliente_id: cliente_id,
      nome_cliente: relatorio["cliente"].razao_social,
      tipo_relatorio: tipo_relatorio,
      detalhes: JSON.stringify(relatorio),
    };
  }
}

function verif_atende_norma_abnt(lote_id, resultados) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  let ret = { atende_norma_abnt: true, campos_nao_atende: [] };

  console.log(lote_id_int);
  console.log(dimensaoChoose[lote_id_int].comprimento);
  console.log(resultados);
  resultados.forEach((res, index) => {
    if (
      res.comp.valor < dimensoes.comprimento - dimensoes.comprimento_step ||
      res.comp.valor > dimensoes.comprimento + dimensoes.comprimento_step
    ) {
      ret.atende_norma_abnt = false;
      ret.campos_nao_atende.push({ campo: "comp", index });
    }
    if (
      res.largura.valor < dimensoes.largura - dimensoes.largura_step ||
      res.largura.valor > dimensoes.largura + dimensoes.largura_step
    ) {
      ret.atende_norma_abnt = false;
      ret.campos_nao_atende.push({ campo: "largura", index });
    }
    if (
      res.altura.valor < dimensoes.altura - dimensoes.altura_step ||
      res.altura.valor > dimensoes.altura + dimensoes.altura_step
    ) {
      ret.atende_norma_abnt = false;
      ret.campos_nao_atende.push({ campo: "altura", index });
    }
    if (res.long.valor < dimensoes.paredes_long) {
      ret.atende_norma_abnt = false;
      ret.campos_nao_atende.push({ campo: "long", index });
    }
    if (res.transv.valor < dimensoes.paredes_transv) {
      ret.atende_norma_abnt = false;
      ret.campos_nao_atende.push({ campo: "transv", index });
    }
  });

  return ret;
}

function verif_comp_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = {valor: parseFloat(valor)}

  if (
    valor < dimensoes.comprimento - dimensoes.comprimento_step ||
    valor > dimensoes.comprimento + dimensoes.comprimento_step
  ) {
    ret['atende_abnt'] = false;
  } else {
    ret['atende_abnt'] = true;
  }

  return ret
}

function verif_largura_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = {valor: parseFloat(valor)}

  if (
    valor < dimensoes.largura - dimensoes.largura_step ||
    valor > dimensoes.largura + dimensoes.largura_step
  ) {
    ret['atende_abnt'] = false;
  } else {
    ret['atende_abnt'] = true;
  }

  return ret
}

function verif_altura_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = {valor: parseFloat(valor)}

  if (
    valor < dimensoes.altura - dimensoes.altura_step ||
    valor > dimensoes.altura + dimensoes.altura_step
  ) {
    ret['atende_abnt'] = false;
  } else {
    ret['atende_abnt'] = true;
  }

  return ret
}

function verif_long_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = {valor: parseFloat(valor)}

  if (valor < dimensoes.paredes_long) {
    ret['atende_abnt'] = false;
  } else {
    ret['atende_abnt'] = true;
  }

  return ret
}

function verif_transv_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = {valor: parseFloat(valor)}

  if (valor < dimensoes.paredes_transv) {
    ret['atende_abnt'] = false;
  } else {
    ret['atende_abnt'] = true;
  }

  return ret
}

function verif_espessura_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = {valor: parseFloat(valor)}

  if (valor < dimensoes.espessura) {
    ret['atende_abnt'] = false;
  } else {
    ret['atende_abnt'] = true;
  }

  return ret
}


function insert_relatorio() {
  $.ajax({
    url: "/insert_relatorio",
    method: "post",
    data: relatorio_input,
    success: (response) => {
      console.log(response);
    },
  });
}

function list_relatorios() {
  $.ajax({
    url: "/list_relatorios",
    method: "get",
    success: (response) => {
      console.log(response);
      relatorios = response;
      render_lista_relatorios();
    },
  });
}

function render_lista_relatorios() {
  $("#table-lista-relatorios").html("");
  relatorios.forEach((rel) => {
    div = `
      <tr>
        <td>${rel.nome_cliente}</td>
        <td style="text-align: center;">--</td>
        <td style="text-align: center;">--</td>
        <td style="text-align: center;">
          <i class="bi bi-file-text icon-download" style='cursor:pointer;color:#000099;font-size:18px' id='icon-download__${rel.id}'></i>
        </td>
      </tr>
      `;
    $("#table-lista-relatorios").append(div);
  });
}

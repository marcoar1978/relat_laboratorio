init();

function init() {
  get_clientes();
  list_relatorios();

  setTimeout(() => {
    $("#icon-minus-sub").hide();
    show_form();
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
    if (value == "Bloco de concreto")
      caracterizacao = "Objetivo - Bloco de concreto";
    else if (value == "Caracterização de agregados")
      caracterizacao = "Objetivo - Caracterização de agregados";
    $("#objetivo").val(caracterizacao);
  });

  $(document).on("click", "#icon-plus-sub", (e) => {
    render_form_referencia_blocos();
    $("#salvar-relatorio")
      .prop("disabled", true)
      .css("background-color", "#ccc");
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

    habilita_botao_salvar();
  });

  $(document).on("click", "#salvar-relatorio", () => {
    get_dados_relatorio();
    // insert_relatorio();
    // setTimeout(() => {
    //   list_relatorios();
    //   $("#inclusao_relatorio").fadeOut(300, () => {
    //     $("#lista_relatorios").fadeIn(300);
    //   });
    // }, 400);
  });

  $(document).on("click", "#page-lista", () => {
    $("#inclusao_relatorio").fadeOut(300, () => {
      $("#lista_relatorios").fadeIn(300);
    });
  });

  $(document).on("click", "#page-inclusao-relatorio", () => {
    $("#lista_relatorios").fadeOut(300, () => {
      $("#inclusao_relatorio").fadeIn(300);
      $("#salvar-relatorio")
        .prop("disabled", true)
        .css("background-color", "#ccc");
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
      $(`#carga-n__${lote_id}__${sub_lote_id}`).val(value_n.toFixed(0));
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
      const result = (primeira + segunda + terceira) / (comp / 1000);
      $(`#espessura__${lote_id}__${sub_lote_id}`).val(result.toFixed(0));
    }

    if (!isNaN(primeira) &&
      !isNaN(segunda) &&
      !isNaN(terceira)){
        const media_transv = ((primeira + segunda + terceira)/3).toFixed(0)
        $(`#transv__${lote_id}__${sub_lote_id}`).val(media_transv)
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

  $(document).on("focusout", ".input-rel", () => {
    habilita_botao_salvar();
  });

  $(document).on("click", "#button_insert_cliente", () => {
    console.log("ok");
    $("#modal-overlay").show();
    $("#modal-insert-cliente").show();
  });

  $(document).on("click", "#modal-overlay", () => {
    $("#modal-overlay").hide();
    $("#modal-insert-cliente").hide();
    $(".dados-cliente").val("");
  });

  $(document).on("click", "#save_cliente", (e) => {
    const razao_social = $("#razao_social").val();
    const endereco = $("#endereco_empresa").val();
    const nome_cabecalho = $("#nome_simp").val();

    if (razao_social && endereco && nome_cabecalho) {
      const dados = { razao_social, endereco, nome_cabecalho };
      save_cliente(dados);
      $(".dados-cliente").val("");
    } else {
      $('#msg-valid-cliente').fadeIn(300, () => {
        setTimeout(() => {
           $('#msg-valid-cliente').fadeOut(300)
        }, 1500)
      })
    }
  });
});

function habilita_botao_salvar() {
  if (valida_campos()) {
    $("#salvar-relatorio").prop("disabled", false).css("background-color", "");
  } else {
    $("#salvar-relatorio")
      .prop("disabled", true)
      .css("background-color", "#ccc");
  }
}

function show_form() {
  $(".div-insercao-relatorio").hide();
  $(`#div-insercao-relatorio__1`).show();
  render_form_referencia_blocos();
  $("#salvar-relatorio").show();
}

function def_dimensoes(lote_id) {
  fbk_teorico = $(`#fbk_teorico__${lote_id}`).val();
  dimensao_teorica = $(`#dimensao_teorica__${lote_id}`).val();
  com_funcao_estrutural = $(`#com_funcao_estrutural__${lote_id}`).val();

  if (fbk_teorico && dimensao_teorica && com_funcao_estrutural) {
    $(".span-dimensao").hide();
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
    $(`#span-dimensao-comp__${lote_id}`).text(
      `${dimensaoChoose[parseInt(lote_id)].comprimento}±3mm`
    );
    $(`#span-dimensao-largura__${lote_id}`).text(
      `${dimensaoChoose[parseInt(lote_id)].largura}±2mm`
    );
    $(`#span-dimensao-altura__${lote_id}`).text(
      `${dimensaoChoose[parseInt(lote_id)].altura}±2mm`
    );
    $(`#span-dimensao-long__${lote_id}`).text(
      `≥  ${dimensaoChoose[parseInt(lote_id)].paredes_long} mm`
    );
    $(`#span-dimensao-transv__${lote_id}`).text(
      `≥  ${dimensaoChoose[parseInt(lote_id)].paredes_transv} mm`
    );
    $(`#span-dimensao-espessura__${lote_id}`).text(
      `≥  ${dimensaoChoose[parseInt(lote_id)].espessura} mm`
    );
    $(`.span-dimensao`).show();

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
    div = `<option id='option_cliente_${cliente.id}' value=${cliente.id}> ${cliente.razao_social}`;
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
                    <input type="text" id='lote__${lote_referencia_blocos}' class="form-control lote input-rel">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="date" id='data_fabricacao__${lote_referencia_blocos}' class="form-control data_fabricacao input-rel">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='blocos_concreto__${lote_referencia_blocos}' class="form-control blocos_concreto input-rel">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <select id='dimensao_teorica__${lote_referencia_blocos}' class="form-select dimensao_teorica input-rel">
                      <option value=''>
                      <option value='14x19x39'>14x19x39 cm
                      <option value='19x19x39'>19x19x39 cm
                    </select>
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <input type="text" id='fbk_teorico__${lote_referencia_blocos}' class="form-control fbk_teorico input-rel">
                  </td>
                  <td style="padding-left: 5px;padding-right: 5px;">
                    <select id='com_funcao_estrutural__${lote_referencia_blocos}' class="form-select com_funcao_estrutural input-rel">
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
                <tr style='background-color:#5A595D; color: #fff'>
                    <th rowspan='2' class='th-cel-table'>Massa<br>(gramas)</th>
                    <th colspan='3' class='th-cel-table'>Dimensões Médias (mm)</th>
                    <th colspan='2' class='th-cel-table'>Paredes (mm)</th>
                    <th colspan='3' class='th-cel-table'>Parede Transversal</th>
                    <th rowspan='2' class='th-cel-table'>Espessura<br/>Equivalente<br/>(mm/m)</th>
                    <th rowspan='2' class='th-cel-table'>Carga (Kgf)</th>
                    <th rowspan='2' class='th-cel-table'>Carga (N)</th>
                    <th rowspan='2' class='th-cel-table'>Resistência à compressão<br/>(MPa)</th>
                   
                 </tr>
                <tr style='background-color:#5A595D; color: #fff'>           
                    <th class='th-cel-table'>Comp.</th>
                    <th class='th-cel-table'>Largura</th>
                    <th class='th-cel-table'>Altura</th>
                    <th class='th-cel-table'>Long.</th>
                    <th class='th-cel-table'>Transv.</th>
                    <th class='th-cel-table'>1º</th>
                    <th class='th-cel-table'>2º</th>
                    <th class='th-cel-table'>3º</th>
                </tr>
                <tr style='height:35px'>
                  <th class='th-cel-table'></th>
                  <th class='th-cel-table'><span id='span-dimensao-comp__${lote_referencia_blocos}' class='span-dimensao'></span></th>
                  <th class='th-cel-table'><span id='span-dimensao-largura__${lote_referencia_blocos}' class='span-dimensao'></span></th>
                  <th class='th-cel-table'><span id='span-dimensao-altura__${lote_referencia_blocos}' class='span-dimensao'></span></th>
                  <th class='th-cel-table'><span id='span-dimensao-long__${lote_referencia_blocos}' class='span-dimensao'></span></th>
                  <th class='th-cel-table'><span id='span-dimensao-transv__${lote_referencia_blocos}' class='span-dimensao'></span></th>
                  <th class='th-cel-table'></th>
                  <th class='th-cel-table'></th>
                  <th class='th-cel-table'></th>
                  <th class='th-cel-table'><span id='span-dimensao-espessura__${lote_referencia_blocos}'></span></th>
                  <th class='th-cel-table'></th>
                  <th class='th-cel-table'></th>
                  <th class='th-cel-table'></th>

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
            
            <td class='th-cel-table'><input type='text' id='massa__${lote_referencia_blocos}__${i}'  class="massa form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='comp__${lote_referencia_blocos}__${i}'  class="comp mpa form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='largura__${lote_referencia_blocos}__${i}' class="largura mpa form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='altura__${lote_referencia_blocos}__${i}'  class="altura form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='long__${lote_referencia_blocos}__${i}' class="long form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='transv__${lote_referencia_blocos}__${i}' disabled=disabled class="transv form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='parede-transv-1__${lote_referencia_blocos}__${i}'  class="parede-transv form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='parede-transv-2__${lote_referencia_blocos}__${i}' class="parede-transv form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='parede-transv-3__${lote_referencia_blocos}__${i}'  class="parede-transv form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='espessura__${lote_referencia_blocos}__${i}'  disabled=disabled class="espessura form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='carga-kgf__${lote_referencia_blocos}__${i}'   class="carga-kgf mpa form-control input-rel"></td>
            <td class='th-cel-table'><input type='text' id='carga-n__${lote_referencia_blocos}__${i}' disabled=disabled   class="carga-n form-control input-rel" style='width:100px;'></td>
            <td class='th-cel-table'><input type='text' id='resistencia__${lote_referencia_blocos}__${i}'   disabled=disabled class="resistencia form-control input-rel"></td>
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
    $(`#resistencia__${lote_id}__${sub_lote_id}`).val(resistencia.toFixed(1));
  } else {
    $(`#resistencia__${lote_id}__${sub_lote_id}`).val("");
  }
}

function valida_campos() {
  let ret = true;
  $(".input-rel")
    .get()
    .forEach((obj) => {
      campo = $(`#${obj.id}`);
      if (campo.val() == "" || campo.val() == 0 || campo.val() == "0") {
        ret = false;
      }
    });
  return ret;
}

function get_dados_relatorio() {
  relatorio = {};
  cliente_id = $(`#cliente_id`).val();
  relatorio["cliente"] = clientes.find((c) => c.id == cliente_id);
  // relatorio["tipo_material"] = $(`#tipo_material`).val();
  relatorio["tipo_material"] = "Bloco de concreto";
  relatorio["data_ensaio"] = moment($(`#data_ensaio`).val());
  relatorio["data_ensaio_format"] = relatorio["data_ensaio"].format(
    "D [de] MMMM [de] YYYY"
  );
  // relatorio["objetivo"] = $(`#objetivo`).val();
  relatorio["objetivo"] = "";
  relatorio["laboratorio"] = $(`#laboratorio`).val();
  relatorio["responsavel"] = $(`#responsavel`).val();
  relatorio["data_relatorio"] = moment($(`#data_relatorio`).val());
  relatorio["data_relatorio_format_simp"] =
    relatorio["data_relatorio"].format(" D[/]MM[/]YYYY");
  relatorio["data_relatorio_format_comp"] = relatorio["data_relatorio"].format(
    "[São Paulo], D [de] MMMM [de] YYYY"
  );
  relatorio["local_cliente"] = $(`#local_cliente`).val();
  relatorio["tipo_cimento"] = $(`#tipo_cimento`).val();
  relatorio["local_fabrica"] = $(`#local_fabrica`).val();

  if (tipo_relatorio == 1) {
    relatorio["lote"] = [];
    for (num_lote = 0; num_lote < lote_referencia_blocos; num_lote++) {
      resultados = [];

      for (num_lote_sub = 0; num_lote_sub < 6; num_lote_sub++) {
        resultado = {
          // n_bloco: $(`#n_bloco__${num_lote}__${num_lote_sub}`).val(),
          massa: $(`#massa__${num_lote}__${num_lote_sub}`).val(),
          massa_f: parseFloat(
            $(`#massa__${num_lote}__${num_lote_sub}`).val()
          ).toLocaleString("pt-BR"),
          comp: verif_comp_abnt(
            num_lote,
            parseFloat($(`#comp__${num_lote}__${num_lote_sub}`).val())
          ),
          largura: verif_largura_abnt(
            num_lote,
            parseFloat($(`#largura__${num_lote}__${num_lote_sub}`).val())
          ),
          altura: verif_altura_abnt(
            num_lote,
            parseFloat($(`#altura__${num_lote}__${num_lote_sub}`).val())
          ),
          long: verif_long_abnt(
            num_lote,
            parseFloat($(`#long__${num_lote}__${num_lote_sub}`).val())
          ),
          transv: verif_transv_abnt(
            num_lote,
            parseFloat($(`#transv__${num_lote}__${num_lote_sub}`).val())
          ),
          parede_transv_1: $(
            `#parede-transv-1__${num_lote}__${num_lote_sub}`
          ).val(),
          parede_transv_2: $(
            `#parede-transv-2__${num_lote}__${num_lote_sub}`
          ).val(),
          parede_transv_3: $(
            `#parede-transv-3__${num_lote}__${num_lote_sub}`
          ).val(),
          espessura: verif_espessura_abnt(
            num_lote,
            parseFloat($(`#espessura__${num_lote}__${num_lote_sub}`).val())
          ),
          carga_kgf: $(`#carga-kgf__${num_lote}__${num_lote_sub}`).val(),
          carga_n: $(`#carga-n__${num_lote}__${num_lote_sub}`).val(),
          carga_n_f: parseFloat(
            $(`#carga-n__${num_lote}__${num_lote_sub}`).val()
          ).toLocaleString("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          resistencia: parseFloat(
            $(`#resistencia__${num_lote}__${num_lote_sub}`).val()
          ),
          resistencia_f: parseFloat(
            $(`#resistencia__${num_lote}__${num_lote_sub}`).val()
          ).toLocaleString("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        };

        resultados.push(resultado);
      }

      media = get_media_mpa(resultados);
      fbk_geral = calcula_fbk(resultados, $(`#fbk_teorico__${num_lote}`).val());
      classe = get_classe(
        fbk_geral,
        $(`#com_funcao_estrutural__${num_lote}`).val()
      );
      norma_abnt = verif_atende_norma_abnt(num_lote, resultados);
      resultados.sort(
        (a, b) => parseFloat(a.resistencia) - parseFloat(b.resistencia)
      );
      resultados.forEach((res, index) => {
        res["ordem"] = index + 1;
      });

      data_fabricacao_moment = moment($(`#data_fabricacao__${num_lote}`).val());

      relatorio["lote"][num_lote] = {
        lote: $(`#lote__${num_lote}`).val(),
        data_fabricacao: data_fabricacao_moment.format("DD/MM/YYYY"),
        idade_fabicacao: relatorio["data_ensaio"].diff(
          data_fabricacao_moment,
          "day"
        ),
        blocos_concreto: $(`#blocos_concreto__${num_lote}`).val(),
        dimensao_teorica: $(`#dimensao_teorica__${num_lote}`).val(),
        fbk_teorico: $(`#fbk_teorico__${num_lote}`).val(),
        com_funcao_estrutural: $(`#com_funcao_estrutural__${num_lote}`).val(),
        dimensao_padrao: dimensaoChoose[num_lote],
        resultado: resultados,
        norma_abnt: norma_abnt,
        fbk: fbk_geral,
        classe: classe,
        media: media,
      };
    }
    console.log(relatorio);

    relatorio_input = {
      cliente_id: cliente_id,
      nome_cliente: relatorio["cliente"].razao_social,
      tipo_relatorio: tipo_relatorio,
      detalhes: JSON.stringify(relatorio),
    };
  }
}

function get_media_mpa(resultados) {
  ret = 0;
  resultados.forEach((res) => {
    ret += parseFloat(res.resistencia);
  });
  return parseFloat(ret / 6).toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function get_classe(fbk, com_funcao_estrutural) {
  ret = "";
  fbk_float = parseFloat(fbk.fbk);
  if (com_funcao_estrutural == "Não") {
    ret = "C";
  } else if (com_funcao_estrutural == "Sim") {
    if (fbk_float >= 3 && fbk_float < 4) {
      ret = "C";
    } else if (fbk_float >= 4 && fbk_float < 8) {
      ret = "B";
    } else if (fbk_float >= 8) {
      ret = "A";
    } else {
      ret = "";
    }
  }

  return ret;
}

function calcula_fbk(resultados, fbk_teorico) {
  fbk_geral_list = [];
  resultados.forEach((res) => {
    fbk_geral_list.push(parseFloat(res.resistencia));
  });

  fbk_geral_list.sort((a, b) => parseFloat(a) - parseFloat(b));
  console.log(fbk_geral_list);
  console.log(
    `${fbk_geral_list[0]} - ${fbk_geral_list[1]} - ${fbk_geral_list[2]}`
  );
  fbk_geral = fbk_geral_list[0] + fbk_geral_list[1] - fbk_geral_list[2];
  atende_fbk = parseFloat(fbk_teorico) <= fbk_geral;

  return {
    fbk: parseFloat(fbk_geral.toFixed(1)),
    fbk_f: parseFloat(fbk_geral).toLocaleString("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }),
    atende_fbk,
  };
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
  ret = { valor: parseFloat(valor) };

  if (
    valor < dimensoes.comprimento - dimensoes.comprimento_step ||
    valor > dimensoes.comprimento + dimensoes.comprimento_step
  ) {
    ret["atende_abnt"] = false;
  } else {
    ret["atende_abnt"] = true;
  }

  return ret;
}

function verif_largura_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = { valor: parseFloat(valor) };

  if (
    valor < dimensoes.largura - dimensoes.largura_step ||
    valor > dimensoes.largura + dimensoes.largura_step
  ) {
    ret["atende_abnt"] = false;
  } else {
    ret["atende_abnt"] = true;
  }

  return ret;
}

function verif_altura_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = { valor: parseFloat(valor) };

  if (
    valor < dimensoes.altura - dimensoes.altura_step ||
    valor > dimensoes.altura + dimensoes.altura_step
  ) {
    ret["atende_abnt"] = false;
  } else {
    ret["atende_abnt"] = true;
  }

  return ret;
}

function verif_long_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = { valor: parseFloat(valor) };

  if (valor < dimensoes.paredes_long) {
    ret["atende_abnt"] = false;
  } else {
    ret["atende_abnt"] = true;
  }

  return ret;
}

function verif_transv_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = { valor: parseFloat(valor) };

  if (valor < dimensoes.paredes_transv) {
    ret["atende_abnt"] = false;
  } else {
    ret["atende_abnt"] = true;
  }

  return ret;
}

function verif_espessura_abnt(lote_id, valor) {
  const lote_id_int = parseInt(lote_id);
  const dimensoes = dimensaoChoose[lote_id_int];
  ret = { valor: parseFloat(valor) };

  if (valor < dimensoes.espessura) {
    ret["atende_abnt"] = false;
  } else {
    ret["atende_abnt"] = true;
  }

  return ret;
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
  if (table_relatorio) table_relatorio.destroy();
  $("#table-lista-relatorios").fadeOut(200);
  $("#table-body-lista-relatorios").html("");
  relatorios.forEach((rel) => {
    div = `
      <tr>
        <td>${rel.nome_cliente}</td>
        <td style="text-align: center;">${rel.detalhes.data_relatorio_format_simp}</td>
        <td style="text-align: center;">${rel.detalhes.lote.length}</td>
        <td style="text-align: center;">
          <i class="bi bi-download icon-download" style='cursor:pointer;color:#000099;font-size:18px' id='icon-download__${rel.id}'></i>
        </td>
      </tr>
      `;
    $("#table-body-lista-relatorios").append(div);
  });

  table_relatorio = $("#table-lista-relatorios").DataTable({
    ordering: false,
    layout: {
      topStart: null,
      topEnd: "search",
      bottomStart: "info",
      bottomEnd: "paging",
    },
    language: {
      url: "/dataTablePt",
    },
    pageLength: 10,
    pagingType: "full_numbers",
    columns: [
      { width: "60%" },
      { width: "10%" },
      { width: "10%" },
      { width: "10%" },
    ],
  });

  $("#table-lista-relatorios").fadeIn(200);
}

function save_cliente(dados) {
  $.ajax({
    url: "/insert_cliente",
    data: dados,
    method: "post",
    success: (response) => {
      const cliente = response;
      get_clientes();
      $("#modal-overlay").fadeOut(200);
      $("#modal-insert-cliente").fadeOut(200);

      setTimeout(() => {
        console.log($(`#cliente_id option[value='${cliente.id}']`).val());
        $(`#cliente_id option[value='${cliente.id}']`).prop("selected", true);
      }, 400);
    },
  });
}

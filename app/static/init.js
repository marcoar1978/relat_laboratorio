tipo_relatorio = 1;
clientes = [];
relatorios = [];
relatorio_input = {};
relatorio = {};
lote_referencia_blocos = 0;
lote_referencia_blocos_sub = [];
table_relatorio = null

dimensaoChoose = [];
classe = [];

dimensao = [];
dimensao[0] = {
  descricao: 'classe C - 14x19x39',
  comprimento: 390,
  comprimento_step: 3,
  largura: 140,
  largura_step: 2,
  altura: 190,
  altura_step: 3,   
  paredes_long: 18,
  paredes_transv: 18,
  espessura: 135
};

dimensao[1] = {
  descricao: "classe C - 19x19x39",
  comprimento: 390,
  comprimento_step: 3,
  largura: 190,
  largura_step: 2,
  altura: 190,
  altura_step: 3,   
  paredes_long: 18,
  paredes_transv: 18,
  espessura: 135
};

dimensao[2] = {
  descricao: "classes A e B - 14x19x39",
  comprimento: 390,
  comprimento_step: 3,
  largura: 140,
  largura_step: 2,
  altura: 190,
  altura_step: 3,   
  paredes_long: 25,
  paredes_transv: 25,
  espessura: 188
};

dimensao[3] = {
  descricao: "classes A e B - 19x19x39",
  comprimento: 390,
  comprimento_step: 3,
  largura: 190,
  largura_step: 2,
  altura: 190,
  altura_step: 3,   
  paredes_long: 32,
  paredes_transv: 25,
  espessura: 188
};
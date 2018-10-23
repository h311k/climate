/**
* Descobre as coordenadas do usuario e retorna os dados de previsao do tempo no momento.
* Por limitacoes da API do climatempo, apenas a hora fechada e capturada.
* Autor: Haony Duarte Porto Vieira
*/
var cidade;
var estado;
var latitude;
var longitude;
var idLocal;
var tempAgora;
var tempHoje;
var previsaoHoje;
var previsaoSemana;

function getPrevisaoDoTempo(loader){
  $(loader).fadeIn('slow');
  $.ajax('http://ip-api.com/json').then(function success(response) {
    cidade = response.city;
    estado = response.region;
    $.getJSON('https://cors.io/?http://apiadvisor.climatempo.com.br/api/v1/locale/city?name='+cidade+'&state='+estado+'&token=207dd08101b70c9a6a72b196757c9d98', function(data){
      idLocal = data[0].id;
      $.getJSON('https://cors.io/?http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/'+idLocal+'/hours/72?token=207dd08101b70c9a6a72b196757c9d98', function(data){
        var d = new Date();
        dia = d.getDate();
        mes = d.getMonth()+1;
        ano = d.getFullYear();
        if(d.getHours()<10){
          hora = '0'+d.getHours();
        } else {
          hora = d.getHours();
        }
        dia = dia+'/'+mes+'/'+ano+' '+hora+':00:00';
        tempHoje = data.data;
        result = $.grep(data.data, function(e){ return e.date_br == dia; });
        tempAgora = result[0].temperature.temperature;
        $.getJSON('https://cors.io/?http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/'+idLocal+'/days/15?token=207dd08101b70c9a6a72b196757c9d98', function(data){
          var d = new Date();
          dia = d.getDate();
          mes = d.getMonth()+1;
          ano = d.getFullYear();
          dia = dia+'/'+mes+'/'+ano;
          previsaoSemana = data.data;
          result = $.grep(data.data, function(e){ return e.date_br == dia; });
          previsaoHoje = result[0];
          console.log(previsaoHoje);
          renderizaPrevisaoHoje();
          $(loader).fadeOut('slow');
        });
      });
    });
  },
  function fail(data, status) {
    console.log('Falha na requisição.  Status retornado: ', status);
  });
}

function renderizaPrevisaoHoje() {
  $('#cidade').text(cidade);
  $('#temperatura-atual').text(tempAgora+'°');
  $('#sensacao-termica').text('Mínima de '+previsaoHoje.temperature.min+'° e máxima de '+previsaoHoje.temperature.max+'°');
  var d = new Date();
  hora = d.getHours();
  if(hora >= 4 && hora < 6) {
    $('#lide').text(previsaoHoje.text_icon.text.phrase.dawn);
    $('#imagem-clima').addClass('dawn');
    $('#imagem-clima').attr('src', './img/realistic/200px/'+previsaoHoje.text_icon.icon.dawn+'.png');

    if(previsaoHoje.text_icon.icon.dawn.indexOf('2')>=0) {
      $('#principal').addClass('nuvens');
      $('body').addClass('ceu-madrugada-limpo');
    } else if((previsaoHoje.text_icon.icon.dawn.indexOf('3')>=0) || (previsaoHoje.text_icon.icon.dawn.indexOf('4')>=0)) {
      $('#principal').addClass('chuva-leve');
      $('body').addClass('ceu-madrugada-fechado');
    } else if((previsaoHoje.text_icon.icon.dawn.indexOf('5')>=0) || (previsaoHoje.text_icon.icon.dawn.indexOf('6')>=0)) {
      $('#principal').addClass('chuva-pesada');
      $('body').addClass('ceu-madrugada-fechado');
    } else {
      $('body').addClass('ceu-madrugada-limpo');
    }

  } else if(hora <=12) {
    $('#lide').text(previsaoHoje.text_icon.text.phrase.morning);
    $('#imagem-clima').addClass('morning');
    $('#imagem-clima').attr('src', './img/realistic/200px/'+previsaoHoje.text_icon.icon.morning+'.png');

    if(previsaoHoje.text_icon.icon.morning.indexOf('2')>=0) {
      $('#principal').addClass('nuvens');
      $('body').addClass('ceu-limpo');
    } else if((previsaoHoje.text_icon.icon.morning.indexOf('3')>=0) || (previsaoHoje.text_icon.icon.morning.indexOf('4')>=0)) {
      $('#principal').addClass('chuva-leve');
      $('body').addClass('ceu-fechado');
    } else if((previsaoHoje.text_icon.icon.morning.indexOf('5')>=0) || (previsaoHoje.text_icon.icon.morning.indexOf('6')>=0)) {
      $('#principal').addClass('chuva-pesada');
      $('body').addClass('ceu-fechado');
    } else {
      $('body').addClass('ceu-limpo');
    }

  } else if (hora<=18) {
    $('#lide').text(previsaoHoje.text_icon.text.phrase.afternoon);
    $('#imagem-clima').addClass('afternoon');
    $('#imagem-clima').attr('src', './img/realistic/200px/'+previsaoHoje.text_icon.icon.afternoon+'.png');

    if(previsaoHoje.text_icon.icon.afternoon.indexOf('2')>=0) {
      $('#principal').addClass('nuvens');
      $('body').addClass('ceu-limpo');
    } else if((previsaoHoje.text_icon.icon.afternoon.indexOf('3')>=0) || (previsaoHoje.text_icon.icon.afternoon.indexOf('4')>=0)) {
      $('#principal').addClass('chuva-leve');
      $('body').addClass('ceu-fechado');
    } else if((previsaoHoje.text_icon.icon.afternoon.afternoon('5')>=0) || (previsaoHoje.text_icon.icon.afternoon.indexOf('6')>=0)) {
      $('#principal').addClass('chuva-pesada');
      $('body').addClass('ceu-fechado');
    } else {
      $('body').addClass('ceu-limpo');
    }

  } else {
    $('#lide').text(previsaoHoje.text_icon.text.phrase.night);
    $('#imagem-clima').addClass('night');
    $('#imagem-clima').attr('src', './img/realistic/200px/'+previsaoHoje.text_icon.icon.night+'.png');

    if(previsaoHoje.text_icon.icon.night.indexOf('2')>=0) {
      $('#principal').addClass('nuvens');
      $('body').addClass('ceu-noite-limpo');
    } else if((previsaoHoje.text_icon.icon.night.indexOf('3')>=0) || (previsaoHoje.text_icon.icon.night.indexOf('4')>=0)) {
      $('#principal').addClass('chuva-leve');
      $('body').addClass('ceu-noite-fechado');
    } else if((previsaoHoje.text_icon.icon.night.afternoon('5')>=0) || (previsaoHoje.text_icon.icon.night.indexOf('6')>=0)) {
      $('#principal').addClass('chuva-pesada');
      $('body').addClass('ceu-noite-fechado');
    } else {
      $('body').addClass('ceu-noite-limpo');
    }

  }
  $('#detalhe').text(previsaoHoje.text_icon.text.phrase.reduced);
}

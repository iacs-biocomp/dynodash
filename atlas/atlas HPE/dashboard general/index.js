//JavaScript perteneciente al widget de niveles de agregación code 4565
function getDataAggLevels() {
  return $.ajax({
    dataType: "json",
    type: "GET",
    url: "http://localhost:8080/datos/aggLevels/1245"
  })
}
function callbackDataAggLevels(data) {
  myViewModel.setDataAggLevels(data)
}
$(getDataAggLevels().done(callbackDataAggLevels))


//JavaScript perteneciente al widget de indicadores
function getDataIndicadores() {
  return $.ajax({
    dataType: "json",
    type: "GET",
    url: "http://localhost:8080/datos/indicadores/452"
  })
}

function callbackDataIndicadores(data) {
  myViewModel.setDataIndicadores(data)
}
$(getDataIndicadores().done(callbackDataIndicadores))



//JavaScript perteneciente al widget de mapa/gráfico
myViewModel.globalIndicador.subscribe(function () {

  if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {

    let escala = myViewModel.globalAggLevel();
    let indicador = myViewModel.globalIndicador();
    myViewModel.setVariabilidad('General')
    
    Promise.all([getDataGeneral(indicador), getLeyendaGeneral(indicador)]).then(values => {

      const datos = values[0].filter(dato => dato.distintivo == 'General')[0]
      let valores = [datos, values[1]]

      const datosParse = parseador(escala, datos.data)
      myViewModel.setData('General', datosParse)

      getMapaGeneral(valores)
    })
  };
});


//JavaScript perteneciente al widget de mapa/gráfico
myViewModel.globalIndicador.subscribe(function () {

  if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {

    let indicador = myViewModel.globalIndicador();
    
    Promise.all([getLeyendaGeneral(indicador)]).then(values => {

      let valores = values[0]

      paintLeyendaGeneral(valores) 
    })
  };
});

//estas son las funciones adecuadas que se utilizan para obtener data code 471
//JavaScript perteneciente al widget de mapa/gráfico
function getLeyendaGeneral(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/leyenda/" + indicador,
  });
}

//JavaScript perteneciente al widget de mapa/gráfico
function getDataGeneral(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: "http://localhost:8080/datos/data/" + indicador,
  }
  ).then(function(data) {
      return data
  });
}

//estas son las funciones adecuadas que se utilizan para obtener data
//JavaScript perteneciente al widget de mapa/gráfico
const getMapaGeneral = function (datos) {
  const { id, data, nivel } = datos[0];
  const { customLabels, customBreaks} = datos[1];

  let mapa = mapSpain('#mapGeneral');

  mapa
    .data(data)
    .escala(nivel)
    .customBreaks(customBreaks)
    .customLabels(customLabels)
    .variabilidad('General')
    .title('')
    .opacity(1)
    .paint();
}

const paintLeyendaGeneral = function (datos) {
  const { customLabels, customBreaks } = datos;

  let legend = leyenda('#legendGeneral');

  legend
    .customBreaks(customBreaks)
    .customLabels(customLabels)
    .paint();
}

function parseador(escala, datos) {
  //console.log('datos inicio',datos)
  //console.log(escala)
  const arrayDatos = []
  if(escala == 'as') {
    datos.forEach(element => {
      arrayDatos.push({codigo: element.code_as, nombre: element.snombre, value: element.value})
    });
    return arrayDatos
  }
  
  if(escala == 'zbs') {
    datos.forEach(element => {
      arrayDatos.push({codigo: element.code_zbs, nombre: element.znombre, value: element.value})
    });
    return arrayDatos
  }
  return arrayDatos
}

/*function getZBS() {
  //console.log('llamaada a zonas')
  return $.ajax({
    dataType: "json",
    type: "GET",
    url: "https://gist.githubusercontent.com/AleOG/f7bfa242f4534e806cf24c29677586fd/raw/0b18b9aa2e7bf56e5557c9af06bf7d3f31ce3735/ZBS_ESP_WGS84.json",
  }).then(function (data) {
    return data.objects.ZBS_ESP_WGS84.geometries
  })
}

//add zona basica
function addZBS(c, d, v) {

  ZBS_ESP_WGS84.push({ codigo: c, nombre: d, value: v })
}

let callbackZBS = function (response) {
  $.each(response, function (index, item) {
    //console.log(item.properties.codatzbs)
    addZBS(item.properties.codatzbs, item.properties.n_zbs)
  });
  //console.log('callback zonas', zonas_bas_salud())
  //setZBS(false)
};

$(getZBS().done(callbackZBS))*/

/*function getAS() {
  return $.ajax({
    dataType: "json",
    type: "GET",
    url: "https://gist.githubusercontent.com/AleOG/1ea3da77ddbc4f8085a012a76ccadde8/raw/88f79d2102a8597f52209c998015c24da5b3f0e5/AREA_ESP_WGS84.json",
  }).then(function (data) {
    return data.objects.AREA_ESP_WGS84.geometries;
  })
}

//add area sanitaria
function addAS(c, d, v) {
  AREA_ESP_WGS84.push({ codigo: c, nombre: d, value: v })
}

var callbackAS = function (response) {

  $.each(response, function (index, item) {
    addAS(item.properties.IDN, item.properties.M3D)
  });
  //console.log('callback areas', areas_sanitarias())
  //setAS(false)
};

$(getAS().done(callbackAS))*/

/*let getMapa3 = function (escala) {
  let mapa = mapSpain();

  mapa
    .data(null)
    .escala(escala)
    .title('Poblacion %')
    .opacity(1)
    .paint();
}

function getData3(escala, indicador) {
  //llamada a los datos del indicador
  const url = 'https://gist.githubusercontent.com/AleOG/6b1f20157ec785c409423fd0c0bbf9fe/raw/ff02c334530915acca44722485118f254331bc53/hpe_zbs_leyenda.csv';

  const datos = d3.csv(url).then(function (datos) {
    const indicadores = [
      "Tasas estandarizadas por edad y sexo en HPE por 10.000 habitantes",
      "HPE distintas a lo esperado",
      "Tasas estandarizadas por edad y sexo en admisiones por DH por 10.000 habitantes",
      "HPE por DH distintas a lo esperado",
      "Tasas estandarizadas por edad y sexo en admisiones por ICC por 10.000 habitantes",
      "HPE por ICC distintas a lo esperado",
      "Tasas estandarizadas por edad y sexo en admisiones por complicaciones agudas de diabetes por 10.000 habitantes",
      "HPE por complicaciones agudas de diabetes distintas a lo esperado",
      "Tasas estandarizadas por edad y sexo en admisiones por asma por 10.000 habitantes",
      "HPE por asma distintas a lo esperado",
      "Tasas estandarizadas por edad y sexo en admisiones por EPOC por 10.000 habitantes",
      "HPE por EPOC distintas a lo esperado",
      "Tasas estandarizadas por edad y sexo en admisiones por angina no primaria por 10.000 habitantes",
      "HPE por angina no primaria distintas a lo esperado"
    ]

    let jsonIndicadores = []

    indicadores.forEach(function (indicadorItem, index) {

      let indicador = {
        "id_indicador": "",
        "customBreaks": [],
        "customLabels": []
      }

      let quintil = datos.filter(dato => dato.Element == indicadorItem)

      console.log('quintil', quintil)

      indicador.id_indicador = index +15

      quintil[1].Value.split(';').forEach(function(element) {
        indicador.customBreaks.push(+element.replace(',', '.'))
      })
      indicador.customLabels = quintil[2].Value.split(';')
      indicador.id_indicador = index + 15;
      indicador.indicador = indicadorItem

      console.log(indicador.nivel)
      datos.forEach(function (itemDato, index) {
        if (itemDato.codes != '')
          indicador.data.push({ "code_zbs": itemDato.codes, "value": +itemDato[indicadorItem] })
      })

      jsonIndicadores.push(indicador)

    })

    console.log(jsonIndicadores)

    //getMapa3(escala)
  })
}
getData3()*/
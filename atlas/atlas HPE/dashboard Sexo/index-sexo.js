//JavaScript perteneciente al widget de niveles de agregación
function getDataAggLevels() {
  return $.ajax({
    dataType: "json",
    type: "GET",
    url: "http://localhost:8080/datos/aggLevels/1245" //Se corresponde a la url del widget. Le falta el id del documento en concreto el cual será único
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
    url: "http://localhost:8080/datos/indicadores/222" //Se corresponde a la url del widget. Le falta el id del documento en concreto el cual será el id del dashboard
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
    myViewModel.setVariabilidad('Hombre')

    Promise.all([getDataHombre(indicador), getLeyendaHombre(indicador)]).then(values => {

      const datos = values[0].filter(dato => dato.distintivo == 'Hombre')[0]
      let valores = [datos, values[1]]

      const datosParse = parseador(escala, datos.data)
      myViewModel.setData('Hombre', datosParse)

      getMapaHombre(valores)
    })

  };

});

//JavaScript perteneciente al widget de mapa/gráfico
myViewModel.globalIndicador.subscribe(function () {

  if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {

    let indicador = myViewModel.globalIndicador();

    Promise.all([getLeyendaHombre(indicador)]).then(values => {

      let valores = values[0]

      paintLeyendaHombre(valores)
    })

  };

});

function getLeyendaHombre(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/leyenda/" + indicador,
  });
}

//estas son las funciones adecuadas que se utilizan para obtener data
//JavaScript perteneciente al widget de mapa/gráfico
function getDataHombre(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/data/" + indicador,
  }
  ).then(function(data) {
    console.log(data)
    return data
  });
}

const getMapaHombre = function (datos) {
  const { id, data, nivel } = datos[0];
  const { customLabels, customBreaks } = datos[1];

  let mapa = mapSpain('#mapHombre'); // --> se pasa como argumento el id del mapa {{{id_mapa}}}

  mapa
    .data(data)
    .escala(nivel)
    .customBreaks(customBreaks)
    .customLabels(customLabels)
    .variabilidad('Hombre')
    .title('Poblacion %')
    .opacity(1)
    .paint();
}

const paintLeyendaHombre = function (datos) {
  const { customLabels, customBreaks } = datos;
  
  let legend = leyenda('#legendHombre');

  legend
    .customBreaks(customBreaks)
    .customLabels(customLabels)
    .paint();
}

//$(getData3("indicadores", "escala").done(getMapa3)) -----> Esta función se ejecuta dentro de los subscribe

//JavaScript perteneciente al widget de mapa/gráfico
myViewModel.globalIndicador.subscribe(function () {

  if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {


    let escala = myViewModel.globalAggLevel();
    let indicador = myViewModel.globalIndicador();
    myViewModel.setVariabilidad('Mujer')

    Promise.all([getDataMujer(indicador), getLeyendaMujer(indicador)]).then(values => {

      const datos = values[0].filter(dato => dato.distintivo == 'Mujer')[0]
      let valores = [datos, values[1]]

      const datosParse = parseador(escala, datos.data)
      myViewModel.setData('Mujer', datosParse)

      getMapaMujer(valores)
    })

  };

});


function getLeyendaMujer(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/leyenda/" + indicador,
  });
}

function getDataMujer(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/data/" + indicador,
  }
  ).then(function(data) {
    //cuando el campo distintivo del indicador está vacío es que pertenece a la variabilidad general
      return data
  });
}

const getMapaMujer = function (datos) {
  const { id, data, nivel } = datos[0];
  const { customLabels, customBreaks } = datos[1];

  let mapa = mapSpain('#mapMujer'); // --> se pasa como argumento el id del mapa {{{id_mapa}}}

  mapa
    .data(data)
    .escala(nivel)
    .customBreaks(customBreaks)
    .customLabels(customLabels)
    .variabilidad('Mujer')
    .title('Poblacion %')
    .opacity(1)
    .paint();
}

myViewModel.globalIndicador.subscribe(function () {

  if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {

    let indicador = myViewModel.globalIndicador();

    Promise.all([getLeyendaMujer(indicador)]).then(values => {

      let valores = values[0]

      paintLeyendaMujer(valores)
    })

  };

});

const paintLeyendaMujer = function (datos) {
  const { customLabels, customBreaks } = datos;

  let legend = leyenda('#legendMujer');


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

/*function getData4(escala, indicador) {
  //llamada a los datos del indicador
  const url = 'https://gist.githubusercontent.com/AleOG/050b2df355b820c97864dc308d78f28d/raw/1fcb18aa592db1130b3c8fa3d5820b31b8019c56/hpe_zbs_80.csv';

  const datos = d3.csv(url).then(function (datos) {

    console.log('datos',datos)
    const indicadores =
    [
      "Tasas estandarizadas por edad y sexo de HPE por 10.000 habitantes",
      "HPE por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por DH por 10.000 habitantes",
      "HPE por DH por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por ICC por 10.000 habitantes",
      "HPE por ICC por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por complicaciones agudas de diabetes por 10.000 habitantes",
      "HPE por complicaciones agudas de diabetes por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por asma por 10.000 habitantes",
      "HPE por asma por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por EPOC por 10.000 habitantes",
      "HPE por EPOC por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por angina por 10.000 habitantes",
      "HPE por angina no primaria por encima de las esperadas"
  ]

    let jsonIndicadores = []

    indicadores.forEach(function (indicadorItem, index) {

      let indicador = {
        "id": "",
        "indicador": "",
        "ambito": "España",
        "nivel": "ZBS",
        "distintivo": "Edad_80",
        "anno_inicial": "",
        "anno_final": "",
        "data": [],
      }

      indicador.id = (index + 71)+""
      indicador.indicador = indicadorItem

      datos.forEach(function (itemDato, index) {

        indicador.data.push({ "code_zbs": itemDato.codes, "value": +itemDato[indicadorItem] })
      })

      jsonIndicadores.push(indicador)


      

      //getMapa3(escala)
    })
    console.log('indicadores', jsonIndicadores)
  })
}
getData4()*/

/*function getData3(escala, indicador) {
  //llamada a los datos del indicador
  const url = 'https://gist.githubusercontent.com/AleOG/929de60ddd86eb3538d252817e5df87d/raw/561bc59623a9a7832f69afd0257f5e2208964cd5/hpe_zbs_edad_leyenda.csv';

  const datos = d3.csv(url).then(function (datos) {
    const indicadores =     [
      "Tasas estandarizadas por edad y sexo de HPE por 10.000 habitantes",
      "HPE por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por DH por 10.000 habitantes",
      "HPE por DH por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por ICC por 10.000 habitantes",
      "HPE por ICC por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por complicaciones agudas de diabetes por 10.000 habitantes",
      "HPE por complicaciones agudas de diabetes por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por asma por 10.000 habitantes",
      "HPE por asma por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por EPOC por 10.000 habitantes",
      "HPE por EPOC por encima de las esperadas",
      "Tasas estandarizadas por edad y sexo de las admisiones por angina por 10.000 habitantes",
      "HPE por angina no primaria por encima de las esperadas"
  ]

    let jsonIndicadores = []
  console.log(datos)
    indicadores.forEach(function (indicadorItem, index) {

      let indicador = {
        "id_indicador": "",
        "customBreaks": [],
        "customLabels": []
      }

      let quintil = datos.filter(dato => dato.Element == indicadorItem)

      //console.log('quintil', quintil)

      indicador.id_indicador = index +71

      quintil[1].Value.split(';').forEach(function(element) {
        indicador.customBreaks.push(+element.replace(',', '.'))
      })
      indicador.customLabels = quintil[2].Value.split(';')


      jsonIndicadores.push(indicador)

    })

    console.log(jsonIndicadores)

    //getMapa3(escala)
  })
}
getData3()*/


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

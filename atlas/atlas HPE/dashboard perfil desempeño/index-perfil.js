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



//JavaScript perteneciente al widget de mapa/gráfico
myViewModel.globalIndicador.subscribe(function () {

  if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {

    let escala = myViewModel.globalAggLevel();
    let indicador = myViewModel.globalIndicador();
    myViewModel.setVariabilidad('Perfil')

    Promise.all([getDataPerfil(indicador), getLeyendaPerfil(1)]).then(values => { // Pensar como llamar a la leyenda

      const datos = values[0].filter(dato => dato.distintivo == 'Perfil')[0]
      let valores = [datos, values[1]]

      const datosParse = parseador(escala, datos.data)
      myViewModel.setData('Perfil', datosParse)

      getMapaPerfil(valores)
      
      
      //const datos = values[0].data

      //const datosParse = parseador(escala, datos)

      //myViewModel.setData('Perfil', datosParse)

      //getMapaPerfil(values)
    })

  };

});


function getLeyendaPerfil(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/leyenda/" + indicador,
  });
}

//estas son las funciones adecuadas que se utilizan para obtener data
//JavaScript perteneciente al widget de mapa/gráfico
function getDataPerfil(indicador) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    //La url del widget de mapa
    url: "http://localhost:8080/datos/data/" + indicador,
  }
  ).then(function(data) {
    //cuando el campo distintivo del indicador está vacío es que pertenece a la variabilidad Perfil
      return data
  });
}

const getMapaPerfil = function (datos) {
  const { id, data, nivel } = datos[0];
  const { customLabels, customBreaks} = datos[1];

  let mapa = mapSpain('#mapPerfil');

  mapa
    .data(data)
    .escala(nivel)
    .customBreaks(customBreaks)
    .customLabels(customLabels)
    .variabilidad('Perfil') //Annadido 
    .title('Poblacion %')
    .opacity(1)
    .paint();
}

//$(getData3("indicadores", "escala").done(getMapa3)) -----> Esta función se ejecuta dentro de los subscribe



function parseador(escala, datos) {
  //console.log('datos inicio',datos)
  //console.log(escala)
  const arrayDatos = []
  if(escala == 'as') {
    datos.forEach(element => {
      arrayDatos.push({codigo: element.code_as, nombre: element.snombre, value: element.values})
    });
    //console.log('parseador',arrayDatos)
    return arrayDatos
  }
  
  if(escala == 'zbs') {
    datos.forEach(element => {
      arrayDatos.push({codigo: element.code_zbs, nombre: element.znombre, value: element.values})
    });
    //console.log('parseador',arrayDatos)
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
}*/

/*function getData3(escala, indicador) {
  //llamada a los datos del indicador
  const url = 'https://gist.githubusercontent.com/AleOG/901f1108a75cc98f5cd1f0c08ee3248f/raw/d6651d6115aec035da19c9e8f1c9e8bf277065fc/Profile_hpe-zbs_2018-2020_leyenda.csv';

  const datos = d3.csv(url).then(function (datos) {
    //console.log(datos)
    const indicadores = [
      "HPE por cualquier causa en mayores de 40 años",
      "Deshidratación en mayores de 65 años",
      "Insuficiencia Cardiaca Congestiva en mayores de 40 años",
      "Complicaciones Agudas de la Diabetes en mayores de 40 años",
      "Asma en mayores de 40 años",
      "Enfermedad Pulmonar Obstructiva Crónica en mayores de 40 años",
      "Angina sin procedimiento en mayores de 40 años"
    ]

    let jsonIndicadores = []

    indicadores.forEach(function (indicadorItem, index) {

      let indicador = {
        "id": "",
        "breaks": [],
        "customBreaks": [],
        "customLabels": []
      }

      let quintil = datos.filter(dato => dato.Element == indicadorItem)

      //console.log('quintil', quintil)

      indicador.id = (index + 92) +""

      quintil[0].Value.split(';').forEach(function(element) {
        indicador.breaks.push(+element.replace(',', '.'))
      })

      quintil[2].Value.split(';').forEach(function(element) {
        indicador.customBreaks.push(+element.replace(',', '.'))
      })
      indicador.customLabels = quintil[3].Value.split(';')


      jsonIndicadores.push(indicador)

    })

    console.log(jsonIndicadores)

    //getMapa3(escala)
  })
}
getData3()*/

/*function getData4(escala, indicador) {
  //llamada a los datos del indicador
  const url = 'https://gist.githubusercontent.com/AleOG/b9657e0885f64e9979c4fe4ca3de2893/raw/204d3658b37f10c6a189d727118154a181285fe2/Profile_hpe-zbs_2018-2020-Angina%2520sin%2520procedimiento%2520en%2520mayores%2520de%252040%2520a%25C3%25B1os.csv';

  const datos = d3.csv(url).then(function (datos) {

    //console.log('datitos',datos)
    const indicadores =
    [
      //"HPE por cualquier causa en mayores de 40 años",
      //"Deshidratación en mayores de 65 años",
      //"Insuficiencia Cardiaca Congestiva en mayores de 40 años",
      //"Complicaciones Agudas de la Diabetes en mayores de 40 años",
      //"Asma en mayores de 40 años",
      //"Enfermedad Pulmonar Obstructiva Crónica en mayores de 40 años",
      "Angina sin procedimiento en mayores de 40 años"
  ]

    let jsonIndicadores = []

    indicadores.forEach(function (indicadorItem, index) {

      let indicador = {
        "id": "",
        "indicador": "",
        "ambito": "España",
        "nivel": "ZBS",
        "distintivo": "Perfil",
        "anno_inicial": "",
        "anno_final": "",
        "data": [],
      }

      indicador.id = (index + 98)+""
      indicador.indicador = indicadorItem

      

      datos.forEach(function (itemDato, index) {

        let values = []

        values.push(+itemDato.numeric , +itemDato.poblacion, +itemDato.number, itemDato.significance, itemDato.evolucion, +itemDato.national)

        indicador.data.push({"code_zbs": itemDato.codes, "values": values})
      })

      

      console.log(indicador)

      

      //getMapa3(escala)
    })
  })
}
getData4()*/
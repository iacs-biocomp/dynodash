//JavaScript perteneciente al widget de mapa/gráfico
myViewModel.globalIndicador.subscribe(function () {

    if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {
  
      let escala = myViewModel.globalAggLevel();
      let indicador = myViewModel.globalIndicador();
      myViewModel.setVariabilidad('{{{label}}}')
      
      Promise.all([getData{{{frame_id}}}(indicador), getLeyenda{{{frame_id}}}(indicador)]).then(values => {
  
        const datos = values[0].filter(dato => dato.distintivo == '{{{label}}}')[0]
        let valores = [datos, values[1]]
  
        const datosParse = parseador(escala, datos.data)
        myViewModel.setData('{{{label}}}', datosParse)
  
        getMapa{{{frame_id}}}(valores)   
      })
    };
  });
  
  
  //estas son las funciones adecuadas que se utilizan para obtener data code 471
  //JavaScript perteneciente al widget de mapa/gráfico
  function getLeyenda{{{frame_id}}}(indicador) {
    return $.ajax({
      dataType: 'json',
      type: 'GET',
      //La url del widget de mapa
      url: "{{{url}}}leyenda/" + indicador,
    });
  }
  
  //JavaScript perteneciente al widget de mapa/gráfico
  function getData{{{frame_id}}}(indicador) {
    return $.ajax({
      dataType: 'json',
      type: 'GET',
      url: "{{{url}}}data/" + indicador,
    }
    ).then(function(data) {
        return data
    });
  }
  
  //estas son las funciones adecuadas que se utilizan para obtener data
  //JavaScript perteneciente al widget de mapa/gráfico
  const getMapa{{{frame_id}}} = function (datos) {
    const { id, data, nivel } = datos[0];
    const { customLabels, customBreaks} = datos[1];
  
    let mapa = mapSpain('#map{{{frame_id}}}');
  
    mapa
      .data(data)
      .escala(nivel)
      .customBreaks(customBreaks)
      .customLabels(customLabels)
      .variabilidad('{{{label}}}')
      .title('')
      .opacity(1)
      .paint();
  }

  
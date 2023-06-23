
/**
 * JavaScript perteneciente al widget Tabla del perfil de desempeño.
 */

function getDataIndicadores() {
    return $.ajax({
      dataType: 'json',
      type: 'GET',
      url: '{{{url}}}indicadores/444' 
    })
  }
  
  function callbackDataIndicadores(data) {
    myViewModel.setDataIndicadores(data)
  }
  $(getDataIndicadores().done(callbackDataIndicadores))

function getDataTabla(indicador, sectores) {
    return $.ajax({
        dataType: 'json',
        type: 'GET',
        url: '{{{url}}}perfil/'+indicador.id,
        data: {sectores: sectores}
    }).then(function(data) {
        return {'idIndicador': indicador.id,'nombreIndicador': indicador.nombre, 'data': data[0]}
    })
}

function getLeyendaPerfilDesempenno(HTMLelement, values) {

    const idLeyenda = values[8]

    return $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '{{{url}}}leyenda/' + idLeyenda
    }).then(function(data) {
        return {'HTMLelement': HTMLelement, 'values': values, 'data': data}
    })
}

function leyendaTendencia(HTMLelement, value) {

    let container = d3.select(HTMLelement)
    let svg = null;
    let pathArroyDown = 'M5.5 11 L11 5.5 L8.25 5.5 L8.25 0 L2.75 0 L2.75 5.5 L0 5.5 L5.5 11' //flecha hacia abajo
    let pathArrowUp = 'M5.5 0 L11 5.5 L8.25 5.5 L8.25 11 L2.75 11 L2.75 5.5 L0 5.5 L5.5 0' //flecha hacia arriba
    let pathLine = 'M0 3.85 L0 7.15 L11 7.15 L11 3.85 Z';

    svg = container
        .selectAll('svg')
        .data([null])
        .join('svg')
        .attr('width', '11px')
        .attr('height', '11px')
        .style('overflow', 'hidden')


    if (value == 'P') {
        let leyenda = svg.append('path').attr('d', pathArrowUp).attr('fill', '#55ce6f')
        leyenda.append('title').text('Mejor que el periodo anterior')
    }

    if (value == 'I') {
        let leyenda = svg.append('path').attr('d', pathLine).attr('fill', '#eac260')
        leyenda.append('title').text('Igual que el periodo anterior')
    }

    if (value == 'M') {
        let leyenda = svg.append('path').attr('d', pathArroyDown).attr('fill', '#e95858')
        leyenda.append('title').text('Peor que el periodo anterior')
    }
}

function leyendaPerfilDesempenno(datos) {

    const colors = ['#eeeeee', '#dddddc', '#c8c8c8', '#b7b6b6', '#919191']

    const { HTMLelement, values, data } = datos;

    const { breaks, customBreaks, customLabels } = data;

    const P25 = values[5]

    const tasa_estandarizada = values[0]

    const colorBola = values[3]

    let datosBarLeyenda = []
    let widthTotal = 0

    let posicionLinea = (P25 * 100) / breaks[5]

    let posicionBola = (tasa_estandarizada * 100) / breaks[5]

    $.each(customLabels, function (indexInArray, valueOfElement) {

        let objetoDato = {
            x: undefined,
            width: undefined,
            fill: undefined,
            title: undefined
        }

        objetoDato.x = breaks[indexInArray]
        objetoDato.width = breaks[indexInArray + 1] - breaks[indexInArray]
        objetoDato.fill = colors[indexInArray]
        objetoDato.title = 'Q' + (indexInArray + 1) + ' : ' + breaks[indexInArray] + ' - ' + breaks[indexInArray + 1]
        widthTotal += breaks[indexInArray + 1] - breaks[indexInArray]
        datosBarLeyenda.push(objetoDato)
    });

    //console.log(HTMLelement)
    console.log(widthTotal)
    console.log(breaks)
    //console.log(customBreaks)
    console.log(customLabels)
    //console.log(datosBarLeyenda)
    console.log('------------------------------------')

    let container = d3.select(HTMLelement)
    let div = null;

    div = container
        .selectAll('div')
        .data([null])
        .join('div')
        //.attr('width', '11px')
        //.attr('height', '11px')
        .style('position', 'relative')
        //.style('overflow', 'hidden')



    let barra = div
        .append('svg')
        .style('overflow', 'hidden')
        .style('position', 'absolute')
        .style('left', '0px')
        .style('top', '50%')
        .style('margin-top', '-5px')
        .style('width', '100%')
        .style('height', '20px')
        .attr('viewBox', [0, 0, breaks[5], 20])
        .attr('preserveAspectRatio', 'none')


    barra
        .selectAll('rect')
        .data(datosBarLeyenda)
        .join('rect')
        .attr('x', (d) => d.x)
        .attr('y', 0)
        .attr('width', (d) => d.width)
        .attr('height', 20)
        .attr('fill', (d) => d.fill)
        .append('title')
        .text((d) => d.title)

    let minRango = div
        .append('svg')
        .style('overflow', 'hidden')
        .style('position', 'absolute')
        .style('left', `0%`)
        .style('top', '-20%')
        .style('margin-left', '-10px')
        .style('margin-top', '-3px')
        .style('width', '55px')
        .style('height', '20px')
        .attr('preserveAspectRatio', 'none')

    minRango.append('text')
        .attr('font-size', 15)
        .attr('x', 15)
        .attr('y', 15)
        .attr('fill', 'black')
        .text(breaks[0])

    const linea = 'M9 3 L11 3 L11 17 L9 17 Z'

    let lineaBaja = div
        .append('svg')
        .style('overflow', 'hidden')
        .style('position', 'absolute')
        .style('left', `${posicionLinea}%`)
        .style('top', '50%')
        .style('margin-left', '-10px')
        .style('margin-top', '-5px')
        .style('width', '20px')
        .style('height', '20px')
        .attr('preserveAspectRatio', 'none')

    lineaBaja.append('path')
        .attr('d', linea)
        .style('fill', '#999999')

    lineaBaja
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill-opacity', '0')
        .attr('width', 20)
        .attr('height', 20)
        .append('title')
        .text(P25)


    const bola = 'M10,10m-5.5,0a5.5,5.5 0 1,0 11,0a5.5,5.5 0 1,0 -11,0'

    let bolaMarcador = div
        .append('svg')
        .style('overflow', 'hidden')
        .style('position', 'absolute')
        .style('left', `${posicionBola}%`)
        .style('top', '50%')
        .style('margin-left', '-10px')
        .style('margin-top', '-5px')
        .style('width', '20px')
        .style('height', '20px')
        .attr('preserveAspectRatio', 'none')

    bolaMarcador.append('path')
        .attr('d', bola)
        .style('fill', getColor(colorBola))

    bolaMarcador
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill-opacity', '0')
        .attr('width', 20)
        .attr('height', 20)
        .append('title')
        .text(function () {

            let diferencia = P25 - tasa_estandarizada

            if (diferencia > 0.5) {
                return 'Valores por debajo del valor P25 : ' + tasa_estandarizada
            }
            if ((diferencia <= 0.5) && (diferencia >= -0.5)) {
                return 'Valores no significativamente distintos del valor P25 : ' + tasa_estandarizada
            }
            if (diferencia < -0.5) {
                return 'Valores por encima del valor P25 : ' + tasa_estandarizada
            }
        })


    const lineaColor = 'M9 0 L11 0 L11 20 L9 20 Z'

    let lineaMarcador = div
        .append('svg')
        .style('overflow', 'hidden')
        .style('position', 'relative')
        .style('left', `${posicionLinea}%`)
        .style('top', '50%')
        .style('margin-left', '-10px')
        .style('margin-top', '10px')
        .style('width', '20px')
        .style('height', '20px')
        .attr('preserveAspectRatio', 'none')

    lineaMarcador.append('path')
        .attr('d', lineaColor)
        .style('fill', '#fd3b3b')

    lineaMarcador
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill-opacity', '0')
        .attr('width', 20)
        .attr('height', 20)
        .append('title')
        .text('Valor P25 : ' + P25)

    let maxRango = div
        .append('svg')
        .style('overflow', 'hidden')
        .style('position', 'absolute')
        .style('left', `80%`)
        .style('top', '-20%')
        .style('margin-left', '-10px')
        .style('margin-top', '-3px')
        .style('width', '60px')
        .style('height', '20px')
        .attr('preserveAspectRatio', 'none')

    maxRango.append('text')
        .attr('font-size', 15)
        .attr('text-anchor', 'start')
        .attr('x', 15)
        .attr('y', 15)
        .attr('fill', 'black')
        .text(breaks[5])
}

function getColor(color) {

    if (color == 'Rojo')
        return '#cc0000'

    if (color == 'Verde')
        return '#55ce6f'

    if (color == 'Naranja')
        return '#e9bb4c'
}


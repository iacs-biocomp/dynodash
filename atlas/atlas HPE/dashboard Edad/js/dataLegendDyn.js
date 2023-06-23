
/*

JavaScript perteneciente al widget de leyenda

*/
myViewModel.globalIndicador.subscribe(function () {

    if (myViewModel.globalAggLevel() && myViewModel.globalIndicador()) {

        let indicador = myViewModel.globalIndicador();

        Promise.all([getLeyenda{{{frame_id}}}(indicador)]).then(values => {

            let valores = values[0]

            paintLeyenda{{{frame_id}}}(valores)
        })
    };
});

//estas son las funciones adecuadas que se utilizan para obtener data de la leyenda
function getLeyenda{{{frame_id}}}(indicador) {
    return $.ajax({
        dataType: 'json',
        type: 'GET',
        //La url del widget de mapa
        url: "{{{url}}}leyenda/" + indicador,
    });
}

//funcion para pintar la leyenda
const paintLeyenda{{{frame_id}}} = function (datos) {
    const { customLabels, customBreaks } = datos;

    let legend = leyenda('#legend{{{frame_id}}}');

    legend
        .customBreaks(customBreaks)
        .customLabels(customLabels)
        .paint();
}

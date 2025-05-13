document.addEventListener('DOMContentLoaded', function () {
    // Configuración básica del gráfico
    Highcharts.chart('chart', {
        title: {
            text: 'Gráfico de Ejemplo'
        },
        subtitle: {
            text: 'Datos de ejemplo'
        },
        xAxis: {
            categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
        },
        yAxis: {
            title: {
                text: 'Valores'
            }
        },
        series: [{
            name: 'Ventas',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
        }]
    });
});


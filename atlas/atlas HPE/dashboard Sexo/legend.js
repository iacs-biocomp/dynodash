
function leyenda(frame_map) {
    let padding = 20;
    let container = d3.select(frame_map);
    let width = 200;
    let height = 150;
    let title = 'leyenda'; //titulo por defecto
    let opacity = 0.7; //opacidad del mapa
    let customBreaks = [];
    let customLabels = [];

    let color = null
    let colorLegend = null;

    var instance = {
        showLegend: true,
        colorArray: [
            '#f7e2d1',
            '#e3b18c',
            '#df7a2c',
            '#b75e1a',
            '#834313',
        ]
    };

    // Accesor para los customBreaks
    instance.customBreaks = function (cb) {
        if (!arguments.length) return cb;
        else {
            customBreaks = cb;
            return instance;
        }
    };

    // Accesor para las customLabels
    instance.customLabels = function (cl) {
        if (!arguments.length) return cl;
        else {
            customLabels = cl;
            return instance;
        }
    };

    // SVG del mapa
    let svg = null;

    var initialize = function (results) {
        //console.log('topojson', results);

        // Función para determinar el color de cada territorio
        //scaleThreshold es ideal para pintar leyendas de colores continuos
        color = d3.scaleThreshold()
            .domain(customBreaks)
            .range(instance.colorArray);

        colorLegend = d3.scaleOrdinal()
            .domain(customLabels)
            .range(instance.colorArray);


        if (instance.showLegend) {
            console.log(container)

            console.log('customLabels', customLabels)
            console.log('customBreaks', customBreaks)

            var legendSvg = container.selectAll('svg')
                .data([null])
                .join('svg')
            //.style('height', 150)
            //.style('width', 200);

            var legend = legendSvg.selectAll(".legend-item")
                .data(customLabels);

            // Update existing legend items
            legend.select("text")
                .text((d) => d);

            // Enter new legend items
            var legendEnter = legend.enter().append("g")
                .attr("class", "legend-item")
                .attr("transform", function (d, i) {
                    return "translate(10," + (i * 25 + 10) + ")";
                });

            legendEnter.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", (d) => colorLegend(d));

            legendEnter.append("text")
                .attr("x", 30)
                .attr("y", 15)
                .text((d) => d);

            // Remove exited legend items
            legend.exit().remove();

            // Resize SVG width based on content
            var legendWidth = legendSvg.node().getBBox().width;
            legendSvg.style("width", legendWidth + 20); // Add some padding if needed

        }

        //repaint();
    };

    // Redibuja el mapa a la nueva escala
    let repaint = function () {
        width = 200
        height = 150

    };


    // Carga los topojson y pinta el mapa
    instance.paint = function () {

        var urls = [
            'https://gist.githubusercontent.com/AleOG/1ea3da77ddbc4f8085a012a76ccadde8/raw/88f79d2102a8597f52209c998015c24da5b3f0e5/AREA_ESP_WGS84.json',
            'https://gist.githubusercontent.com/AleOG/f7bfa242f4534e806cf24c29677586fd/raw/0b18b9aa2e7bf56e5557c9af06bf7d3f31ce3735/ZBS_ESP_WGS84.json',
        ];

        //En D3.js v5 se sustituye queue por Promise.all
        Promise.all(urls.map((url) => d3.json(url)))
            .then(initialize)
            .catch((error) => {
                console.log(error);
            });

        return instance;
    };

    return instance;
}


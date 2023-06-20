/**
 * Visualiza mapa de Aragón por sectores, 
 * y líneas de evolución por años.
 * Todas ellas vinculadas a BiganStructure con 
 * conexión por sector y año.
 */

/* Formato de los datos recibidos:
 * [
    {
        'id': 1,
        'valor': 8.22,
        'sector': '11',
        'snombre': 'HUESCA',
        'zona': null,
        'znombre': null,
        'year': 2003
    }, ...
   ]
 */

var mapResults{{{frame_id}}};
// Chart para visualizar lines
var chart{{{frame_id}}};
// mapa dinámico
var map{{{frame_id}}} = 
    new biganMapAragonS('#map{{{frame_id}}}');



// Get graph data from query
function getData{{{frame_id}}}() {
    return $.ajax({
        dataType:'json',
        type: 'GET',
        url: '{{{url}}}'
    });
} 


// Callback function
// Gestiona la serie temporal y el movimiento dinámico
var getDataCB{{{frame_id}}} = function(rows) {
    
    mapResults{{{frame_id}}} = rows;

    // Current year
    var yr = Math.max.apply(Math, rows.map(function(o) { return o.year; }));	   

    // Global max value
    var m = Math.max.apply(Math, rows.map(function(o) { return o.valor;}));
    
    filteredRows = rows.filter(row => row.year == yr);

    map{{{frame_id}}}.data(filteredRows)
        .title(null)
        .opacity(1)
        .domainMax(m)
        .colorArray(getBiganColorList(biganColors.NEGATIVE,5));
    
    map{{{frame_id}}}.paint();		


    
    
    
    var lineStruc = { 'options': 
    { 'title': '','xAxisType': 'linear','valueSuffix': '%'}, 
        'own': [], 
        'lines': [], 
        'ranges': [] 
    } 
    
    sectores = ['11','12','21','31','32','41','42','51'];
    
    sectores.forEach(function(sector){
        lineRows = mapResults{{{frame_id}}}.filter(row => row.sector == sector);
        var serie = { 
                'name': lineRows[0].snombre, 
                'code': sector,
                'defaultVisible': true, 
                'values': []
        }	
        lineRows.forEach(function(element){
            serie.values.push([element.year, element.valor]);
        });
        lineStruc.lines.push(serie);
    });

    
    // Create chart
    chart{{{frame_id}}} = 
        biganShowHighChartLineGraph(lineStruc, 'hc{{{frame_id}}}', {title:null,height:'120%'});
    
    
    // Set click event to select year
    chart{{{frame_id}}}.update({
        plotOptions: {
            series: {
                point: {
                    events: {
                        click:function(){
                            console.log(this);
                            BiganStructure.globalYear(this.category);
                        }
                    }
                }
            }
        }
    });
    

    // bind BiganStructure observable for sector change
    BiganStructure.globalSector.subscribe(function () {
        if(typeof BiganStructure.globalSector() != 'undefined') {
            map{{{frame_id}}}.sectorZoom(BiganStructure.globalSector().codigo);
            s = BiganStructure.globalSector();
            sectores.forEach(function(element, index){
                chart{{{frame_id}}}.series[index].setVisible((s.codigo == element), false);
            });
            chart{{{frame_id}}}.redraw();
        }
        else {
            map{{{frame_id}}}.aragonZoom();
            chart{{{frame_id}}}.series.forEach(function(element){
                element.setVisible(true, false);
            });
            chart{{{frame_id}}}.redraw();			   
        }
    });
    
    
    // Interacción cambio de año
    BiganStructure.globalYear.subscribe(function () {
        var y = BiganStructure.globalYear()
        
        // select data
        filteredRows = mapResults{{{frame_id}}}.filter(row => row.year == y);

        // update map
        map{{{frame_id}}}.data(filteredRows);
        map{{{frame_id}}}.recolor(2000);
        
        // Update band marker
        chart{{{frame_id}}}.xAxis[0].removePlotBand('yband');
        chart{{{frame_id}}}.xAxis[0].addPlotBand({color: 'rgba(68, 170, 213, 0.3)', from: y-0.5, to: y+0.5, id: 'yband'});
    });		
};   



$(getData{{{frame_id}}}()
        .done(getDataCB{{{frame_id}}}));



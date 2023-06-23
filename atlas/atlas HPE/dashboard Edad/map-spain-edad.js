
function mapSpain(frame_map) {
  let padding = 20;
  let container = d3.select(frame_map);
  let width =
    parseInt(container.style('width')) -
    2 * padding;
  let height = (3 * width) / 2;
  //console.log(width)
  //console.log(height/3)
  let data = null; //datos recibidos para pintar el mapa
  let sectores = null; //sectores geográficos contenidos en el topojson
  let zonas = null; //zonas geográficas contenidas en el topojson
  let sectorPaths = null; // componente que dibuja los sectores en función de los datos del topojson
  let zonaPaths = null; //componene que dibuja las zonas en el mapa en función de los datos del topojon
  let title = 'leyenda'; //titulo por defecto
  let opacity = 0.7; //opacidad del mapa
  let escala = null;
  let mode = 'spain';
  let selected = '0'; //id de la zona/sector seleccionada
  let sectoresSeleccionados = []; //array que almacena el codigo de los sectores seleccionados
  let customBreaks = [];
  let customLabels = [];
  let variabilidad = null

  let color = null
  let colorLegend = null;

  container
    .attr('width', width)
    .attr('height', height / 3);

  //constructor

  var instance = {
    showLegend: true,
    colorArray: [
      '#f7e2d1',
      '#e3b18c',
      '#df7a2c',
      '#b75e1a',
      '#834313',
    ],
    /*legendArray: [
      '0-20 %',
      '20 - 40 %',
      '40 - 60 %',
      '60 - 80 %',
      '80 - 100 %',
    ],*/
    //colordomain: [11.88, 31.29, 38.11, 44.59, 54.74, 135.63],
  };


  // Accesor para data
  instance.data = function (d) {
    if (!arguments.length) return data;
    else {
      data = d;
      return instance;
    }
  };

  // Accesor para title
  instance.title = function (t) {
    if (!arguments.length) return title;
    else {
      title = t;
      return instance;
    }
  };

  // Accesor para opacity
  instance.opacity = function (o) {
    if (!arguments.length) return o;
    else {
      opacity = o;
      return instance;
    }
  };

  // Accesor para escala
  instance.escala = function (e) {
    if (!arguments.length) return e;
    else {
      escala = e;
      return instance;
    }
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


  // Accesor para la variabilidad
  instance.variabilidad = function (v) {
    if (!arguments.length) return v;
    else {
      variabilidad = v;
      return instance;
    }
  };


  // Proyección mercator escalada y trasladada para centrar Aragon en el mapa
  let projection = d3.geoMercator()
    .scale((width * 5) / 3)
    .translate([(3 * width) / 5, height]);

  const originalProjection = projection;
  // Ajustar la imagen a escala y posición por defecto
  function setNormalScale() {
    projection
      .scale((width * 5) / 3)
      .translate([(3 * width) / 5, height]);
  }
  //console.log('map', width)
  //console.log('map', height)
  //console.log('map', (width*5)/3)
  //console.log('map',(width) / 5)
  //console.log('map', height)
  //console.log('map')


  // Path base del mapa
  let path = d3.geoPath().projection(projection);

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

    //Array de features geograficas de los sectores
    sectores = topojson.feature(
      results[0],
      results[0].objects.AREA_ESP_WGS84
    ).features;

    //console.log('sectores geojson', sectores);

    //Array de features geograficas de las zonas
    zonas = topojson.feature(
      results[1],
      results[1].objects.ZBS_ESP_WGS84
    ).features;

    //console.log('zonas geojson', zonas);

    //console.log('datos', data)

    //Combinacion de geojson con data
    if (escala === 'AS') {
      //console.log('datos en mapa',data)
      sectores.forEach(function (f) {
        //console.log(f)
        //console.log(data)
        ////Hacemos que el properties de cada sector sea el registro data correspondiente
        f.properties = data.find(function (d) {
          if (
            d.code_as == f.properties.IDN &&
            (!d.zona || d.zona == '')
          ) {
            d.snombre = f.properties.M3D;
            return true;
          } else {
            return false;
          }
          //return d.sector == f.properties.COD_SECTOR && d.zona == ""
        });
      });
    }


    if (escala === 'ZBS') {
      //console.log(data)
      //console.log(zonas)

      zonas.forEach(function (f) {
        //Hacemos que el properties de cada zona sea el registro data correspondiente

        f.properties = data.find(function (d) {
          if (d.code_zbs == f.properties.codatzbs) {
            d.znombre = f.properties.n_zbs;
            return true;
          } else {
            return false;
          }
        });
        //f.properties = _self.data.find(function (d) { return d.zona == f.properties.CODIGO }) || {}
      });
      //console.log('zonitas', zonas)
    }


    if (instance.showLegend) {
      svg.select('.legend').remove()
      let legend = svg
        .append('g')
        .classed('legend', true)
        .attr('transform', `translate(${(3 * width) / 5}, ${(width) / 5})`);

      let groups = legend
        .selectAll('g')
        .data(customLabels);

      //console.log('grupos', groups)

      const groupsEnter = groups.join('g').attr(
        'transform',
        (d, i) => `translate(60,${i * 25 + 170})`
        // `translate(0,${i * spacing})`
      )

      /*const groupsEnter = groups
        .enter()
        .append('g')

      groupsEnter.merge(groups).attr(
        'transform',
        (d, i) => `translate(60,${i * 25 + 170})`
        // `translate(0,${i * spacing})`
      );
      groups.exit().remove();*/

      groupsEnter
        .append('circle')
        .merge(groups.select('circle'))
        .attr('r', 10)
        .style('stroke', 'black')
        .style('fill', (d) => colorLegend(d));

      groupsEnter
        .append('text')
        .merge(groups.select('text'))
        .text((d) => d)
        .attr('dy', '0.32em')
        .attr('x', 40)
        .append('br');
    }

    repaint();

    d3.select('#icon-aragon')
      .style('position', 'absolute')
      .style('left', '90%')
      .style('height', '40px')
      .style('width', '30px')
      .style('z-index', 1000);
    //.on('click', instance.aragonZoom);
  };

  // Redibuja el mapa a la nueva escala
  let repaint = function () {
    width =
      parseInt(container.style('width')) -
      2 * padding;
    height = (3 * width) / 2;

    //     if (svg != null) {
    //       svg.remove();
    //     }

    setNormalScale();

    //      svg = container
    //       .append('svg')
    //       .attr('width', width)
    //       .attr('height', height);
    if (escala === 'AS') {

      svg.selectAll('.zona').remove()

      sectorPaths = svg
        .selectAll('.sector')
        .data(sectores)
        .join('path')
        .attr('class', (d) => 'sector ' + d.properties.code_as)
        .attr('d', path)
        .style('fill', function (d) {

          if (variabilidad == 'Perfil') {
            return 'grey'
          } else {
            return color(d.properties.value);
          }

        })
        .style('opacity', opacity)
        //.style('stroke', 'black')
        .on('click', function (d) {
          let id = +d.properties.code_as
          //selected = id;
          instance.setSector(
            id
          );

        })
        .on('mouseover', function (d) {
          let id = +d.properties.code_as
          if (!myViewModel.selectedSectores().includes(id))
            d3.select(this).style('stroke', "aqua").style('stroke-width', '2')
        })
        .on('mouseleave', function (d) {
          let id = +d.properties.code_as
          if (!myViewModel.selectedSectores().includes(id))
            d3.select(this).style('stroke', "gray").style('stroke-width', '0.1')
        });

      sectorPaths
        .selectAll('title')
        .remove()

      sectorPaths.append('title')
        .text(function (d) {

          if (variabilidad == 'Perfil') {
            return (d.properties.snombre)
          } else {
            return (
              d.properties.snombre +
              '\n' +
              d.properties.value
            );
          }

        });
    }
    else if (escala === 'ZBS') {

      svg.selectAll('.sector').remove()

      zonaPaths = svg
        .selectAll('.zona')
        .data(zonas)
        .join('path')
        .attr('class', (d) => 'zona ' + d.properties.code_zbs)
        .attr('d', path)
        .style('fill', function (d) {

          if (variabilidad == 'Perfil') {
            return 'grey'
          } else {
            return color(d.properties.value);
          }

        })
        .style('opacity', opacity)
        //.style('stroke', 'black')
        .on('click', function (d) {
          let id = +d.properties.code_zbs
          instance.setSector(
            id
          );
        })
        .on('mouseover', function (d) {
          let id = +d.properties.code_zbs
          if (!myViewModel.selectedSectores().includes(id))
            d3.select(this).style('stroke', "aqua").style('stroke-width', '2')
        })
        .on('mouseleave', function (d) {
          let id = +d.properties.code_zbs
          if (!myViewModel.selectedSectores().includes(id))
            d3.select(this).style('stroke', "gray").style('stroke-width', '0.1')
        });



      zonaPaths
        .selectAll('title')
        .remove()

      zonaPaths
        .append('title')
        .text(function (d) {
          if (variabilidad == 'Perfil') {
            return (d.properties.znombre)
          } else {
            return (
              d.properties.znombre +
              '\n' +
              d.properties.value
            );
          }

        });
    }

  };


  // Carga los topojson y pinta el mapa
  instance.paint = function () {
    svg = container
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', width)
      .attr('height', height / 3)
      .call(zoom);

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

    $(window).on('resize', function () {
      repaint();
    });

    return instance;
  };

  //set area o zona 

  instance.setSector = function (id) {
    console.log("Id", id)
    selected = id;
    if (myViewModel)
      myViewModel.setSector(id);
    else
      console.log("BiganStructure no está definido")
    //instance.sectorZoom(id)

    /*if (mode == "spain" && selected == id) {
      return
    }
    else {
      selected = id;
      if (myViewModel)
        myViewModel.setSector(id);
      else
        console.log("BiganStructure no está definido")
      //instance.sectorZoom(id)
    }*/
  };

  //event
  const zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .on('zoom', zoomed);

  // Zoom centrado a todo Aragon
  // 	instance.aragonZoom = function () {
  //         var t = d3.transition().duration(800)

  //         mode = "aragon";
  // 		selected = "0";
  //         if (BiganStructure)
  //         	BiganStructure.setSector(undefined);

  // 		//projection.scale(_self.height*12).translate([3*_self.width / 4, _self.height*10])
  //         setNormalScale()

  //         sectorPaths.transition(t)
  //             .attr('d', path)
  //             .style('fill', function (d) { return color(d.properties.valor) })

  //         svg.selectAll('.zona')
  //             .data([])
  //             .exit().transition(t)
  //             .attr('d', path)
  //             .style('opacity', 0)
  //             .remove()

  //         select("#icon-aragon")
  //         	.style("display", "none")
  // 	}

  //Move map and zoom in/out map
  function zoomed() {
    const { transform } = d3.event;
    svg.attr('transform', transform);
    svg.attr('stroke-width', 1 / transform.k);
  }

  // Zoom al sector seleccionado .sectorZoom()

  // Zoom al sector seleccionado
  instance.sectorZoom = function (id) {
    console.log(id);
    let t = d3.transition().duration(800);
    /*
     * Control en caso de trabajar con BiganStructure
     */
    if (mode == 'sector' && selected == id) {
      console.log('entra');
      projection.fitExtent(
        [
          [0, 0],
          [width, height],
        ],
        sectores
      );
      console.log(sectorPaths)
      //sectorPaths.transition(t).attr('d', path);
      return;
    }

    selected = id;
    mode = 'sector';

    // 		// if (BiganStructure)
    // 		// BiganStructure.setSector(id);

    // 		/*
    // 		 * Fin BiganStructure
    // 		 */

    // seleccionamos el sector con codigo id
    let sector = sectores.find(function (d) {
      return d.properties.codeSector === id;
    });
    console.log(sector);

    //seleccionamos las zonas de dicho sector
    // let sectorZonas = sectores.filter(function (
    //   d
    // ) {
    //   return d.properties.codeSector === id;
    // });
    // console.log(sectorZonas);

    // var zonaPaths = svg
    //   .selectAll('.zona')
    //   .data(sectorZonas, function (d) {
    //     return d.properties.codeSector;
    //   });

    //       console.log(zonaPaths);
    //       enterZonaPaths = zonaPaths
    //         .join('path')
    //         .attr('class', 'zona')
    //         .attr('d', path)
    //         .style('fill', function (d) {
    //           return color(d.properties.value);
    //         })
    //         .style('opacity', 0);
    //.on('click', function (d) { instance.zonaZoom(d.properties.zona) })

    // enterZonaPaths
    //   .selectAll('.zona')
    //   .data(sectorZonas)
    //   .join('path')
    //   .attr('class', 'zona')
    //   .attr('d', path)
    //   .style('fill', function (d) {
    //     return color(d.properties.value);
    //   })
    //   .style('opacity', 0);
    // //         enterZonaPaths.append('title').text( function (d) { return d.properties.znombre + "\n" + d.properties.valor } )

    projection.fitExtent(
      [
        [padding, padding],
        [width + padding, height + padding],
      ],
      sector
    );
    console.log(sectorPaths);
    sectorPaths.transition(t).attr('d', path);
    //.style('fill', '#444');

    //         zonaPaths.exit().transition(t)
    //             .attr('d', path)
    //             .style('opacity', 0)
    //         zonaPaths.remove()

    //         enterZonaPaths.transition(t)
    //             .attr('d', path)
    //             .style('opacity', opacity)

    d3.select('#icon-aragon').style(
      'display',
      'block'
    );
  };

  // Zoom al sector seleccionado .zonaZoom()

  return instance;
}



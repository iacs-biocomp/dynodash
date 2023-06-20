
//funcion para llamar los datos de las zonas
//ModelView para el binding

let myViewModel = new function () {

    //Variable para el contexto
    let self = this

    //Varibles para registrar las as, zbs, año, día, escala, indicadores
    let globalAS = ko.observable();
    let globalZBS = ko.observable();
    let globalYear = ko.observable();
    let globalDate = ko.observable();
    let globalDetail = ko.observable("global");

    let globalAggLevel = ko.observable();
    let globalIndicador = ko.observable();

    let selectedSectores = ko.observableArray([]);
    let opcionesIndicadores = ko.observableArray([]);
    let datos = ko.observableArray([])
    let perfil = ko.observableArray([])

    let datos_object = {
        datos_G: [],
        datos_H: [],
        datos_M: [],
        datos_65_79: [],
        datos_80: [],
        datos_Perfil: []
    }

    let variabilidad_object = {
        general: undefined,
        hombre: undefined,
        mujer: undefined,
        edad_65_79: undefined,
        edad_80: undefined,
        perfil: undefined
    }

    let totalidadIndicadores = [];


    const DETAIL1 = "global";
    const DETAIL2 = "as";
    const DETAIL3 = "zbs";
    const DETAIL4 = "hospital";


    //Variable para registrar el nivel de agregación
    let aggLevel = { codigo: "", descripcion: "" };
    let aggLevels = ko.observableArray([]);

    let indicador = { id: "", nombre: "" }
    let indicadores = ko.observableArray([]);

    let setVariabilidad = function (variabilidad) {
        if (variabilidad == 'General') {
            variabilidad_object.general = variabilidad
        }
        if (variabilidad == 'Hombre') {
            variabilidad_object.hombre = variabilidad
        }
        if (variabilidad == 'Mujer') {
            variabilidad_object.mujer = variabilidad
        }
        if (variabilidad == 'Edad_65_79') {
            variabilidad_object.edad_65_79 = variabilidad
        }
        if (variabilidad == 'Edad_80') {
            variabilidad_object.edad_80 = variabilidad
        }
        if (variabilidad == 'Perfil') {
            variabilidad_object.perfil = variabilidad
        }
        //console.log(variabilidad_object)
    }

    let setData = function (variabilidad, data) {
        if (variabilidad == 'General') {
            datos_object.datos_G = [];
            datos_object.datos_G.push(...data)
            datos(data)
        }
        if (variabilidad == 'Hombre') {
            datos_object.datos_H = [];
            datos_object.datos_H.push(...data)
            datos(data)
        }
        if (variabilidad == 'Mujer') {
            datos_object.datos_M = [];
            datos_object.datos_M.push(...data)
            datos(data)

        }
        if (variabilidad == 'Edad_65_79') {
            datos_object.datos_65_79 = []
            datos_object.datos_65_79.push(...data)
            datos(data)
        }
        if (variabilidad == 'Edad_80') {
            datos_object.datos_80 = []
            datos_object.datos_80.push(...data)
            datos(data)
        }
        if (variabilidad == 'Perfil') {
            datos_object.datos_Perfil = []
            datos_object.datos_Perfil.push(...data)
            datos(data)
        }
        //console.log('data object', datos_object.datos_G, datos_object.datos_H, datos_object.datos_M)
    }


    let setIndicador = function (indicador) {
        //console.log('en setIndicador', indicador)
        if (indicador != undefined) {
            globalIndicador(indicador.id)
        }
    }
    let getIndicador = function () {
        let indicador = globalIndicador();
        //console.log('en getIndicador', indicador)
        return indicador ? indicador : '';
    }

    let setAggLevel = function (aggLevel) {
        if (aggLevel != undefined) {
            globalAggLevel(aggLevel.codigo)
        }
    }

    let getAggLevel = function () {
        let aggLevel = globalAggLevel();
        return aggLevel ? aggLevel : '';
    };

    function addAggLevel(c, d) {
        aggLevels.push({ codigo: c, descripcion: d })
    }

    //en esta funcion se añadiran los distintos niveles al array de aggLevels
    let setDataAggLevels = function (response) {
        let data = response.aggLevels
        aggLevels.removeAll();
        //
        $.each(data, function (index, aggLevel) {
            addAggLevel(aggLevel.codigo, aggLevel.descripcion)
        });
        globalAggLevel(aggLevels()[0].codigo)
    };

    /**
     * En esta función se añaden los indicadores a un observableArray
     * También se añaden todos los subindicadores a otro array 
    */
    let setDataIndicadores = function (response) {
        opcionesIndicadores(response);

        totalidadIndicadores = response.flatMap((item) =>
            item.indicadores.flatMap((indicador) => indicador.subindicadores)
        );

    }

    function addIndicador(i) {
        indicadores.push(i)
    }

    /*function addSubindicador(si) {
        let array = []
        array.push(si.id)
        array.push(si.nombre)
        perfil.push(array)
    }*/

    let elegirIndicadores = ko.computed(function () {
        if (opcionesIndicadores().length != 0) {
            indicadores.removeAll()
            perfil.removeAll()
            console.log('opcionesIndicadores', opcionesIndicadores())

            let data = opcionesIndicadores().find(element => element.escala === globalAggLevel()).indicadores

            console.log('datos en indicadores', data)
            $.each(data, function (index, indicador) {
                addIndicador(indicador)
            })

            /*let dataSubindicadores = data[0].subindicadores;

            $.each(dataSubindicadores, function (index, subindicador) {
                addSubindicador(subindicador)
            })*/

            return indicadores;
        }

    });


    /**
     * Este método actúa de la siguiente manera:
     *  Si el indicador global no está definido entonces lo define añadiendo el primer valor de la lista.
     *  Cuando el indicador ya está seleccionado y se cambia de escala, se asigna el valor de este indicador pero para la otra escala 
    */
    elegirIndicadores.subscribe(function () {
        console.log('se ejecuta')
        if (!globalIndicador()) {
            globalIndicador(indicadores()[0].subindicadores[0].id)
        } else {

            let namePreviosIndicador = totalidadIndicadores.find(item => item.id == globalIndicador()).nombre

            let idCurrentIndicador;

            indicadores().some((indicador) =>
                indicador.subindicadores.some((subindicador) => {
                    if (subindicador.nombre === namePreviosIndicador) {
                        idCurrentIndicador = subindicador.id;
                        return true;
                    }
                })
            );

            globalIndicador(idCurrentIndicador)
        }
    })

    //Variables para registrar las areas sanitarias
    let area_sanitaria = { codigo: undefined, nombre: "", value: undefined };
    let areas_sanitarias = ko.observableArray([]);

    let areas_sanitarias_object = {
        general: ko.observableArray([]),
        hombre: ko.observableArray([]),
        mujer: ko.observableArray([]),
        edad_65_79: ko.observableArray([]),
        edad_80: ko.observableArray([]),
        perfil: ko.observableArray([])
    }

    //add area sanitaria
    function addAS(c, d, v) {
        areas_sanitarias.push({ codigo: c, nombre: d, value: v })
    }

    //add area sanitaria
    function addASG(c, d, v) {
        areas_sanitarias_object.general.push({ codigo: c, nombre: d, value: v })
    }

    function addASH(c, d, v) {
        areas_sanitarias_object.hombre.push({ codigo: c, nombre: d, value: v })
    }

    function addASM(c, d, v) {
        areas_sanitarias_object.mujer.push({ codigo: c, nombre: d, value: v })
    }

    function addAS_65_79(c, d, v) {
        areas_sanitarias_object.edad_65_79.push({ codigo: c, nombre: d, value: v })
    }

    function addAS_80(c, d, v) {
        areas_sanitarias_object.edad_80.push({ codigo: c, nombre: d, value: v })
    }

    function addAS_Perfil(c, d, v) {
        areas_sanitarias_object.perfil.push({ codigo: c, nombre: d, value: v })
    }

    //obtener las areas sanitarias
    function getAS() {
        return $.ajax({
            dataType: "json",
            type: "GET",
            url: "https://gist.githubusercontent.com/AleOG/1ea3da77ddbc4f8085a012a76ccadde8/raw/88f79d2102a8597f52209c998015c24da5b3f0e5/AREA_ESP_WGS84.json",
        }).then(function (data) {
            return data.objects.AREA_ESP_WGS84.geometries;
        })
    }

    var callbackAS = function (response) {
        areas_sanitarias.removeAll();
        areas_sanitarias_object.general.removeAll();
        areas_sanitarias_object.hombre.removeAll();
        areas_sanitarias_object.mujer.removeAll();
        areas_sanitarias_object.edad_65_79.removeAll();
        areas_sanitarias_object.edad_80.removeAll();
        areas_sanitarias_object.perfil.removeAll();
        $.each(response, function (index, item) {
            addAS(item.properties.IDN, item.properties.M3D)
            addASG(item.properties.IDN, item.properties.M3D)
            addASH(item.properties.IDN, item.properties.M3D)
            addASM(item.properties.IDN, item.properties.M3D)
            addAS_65_79(item.properties.IDN, item.properties.M3D)
            addAS_80(item.properties.IDN, item.properties.M3D)
            addAS_Perfil(item.properties.IDN, item.properties.M3D)
        });
        //console.log('callback areas', areas_sanitarias_object.mujer())
        //setAS(false)
    };

    //No se usa todavía
    var setAS = function (s) {
        if (!s) {
            globalSector(undefined)
        }
        else {
            var t = ko.utils.arrayFirst(areas_sanitarias(), function (f) {
                return f.codigo == s
            });

            if (t && (!globalSector() || s != globalSector().codigo)) {
                globalSector(t)
            }
        }
    };

    //Variables para registrar las zonas básicas de salud
    let zona_bas_salud = { codigo: undefined, nombre: "", value: undefined };
    let zonas_bas_salud = ko.observableArray([])

    let zonas_bas_salud_object = {
        general: ko.observableArray([]),
        hombre: ko.observableArray([]),
        mujer: ko.observableArray([]),
        edad_65_79: ko.observableArray([]),
        edad_80: ko.observableArray([]),
        perfil: ko.observableArray([])
    };

    //add zona basica
    function addZBS(c, d, v) {
        zonas_bas_salud.push({ codigo: c, nombre: d, value: v })
    }

    function addZBSG(c, d, v) {
        zonas_bas_salud_object.general.push({ codigo: c, nombre: d, value: v })
    }

    function addZBSH(c, d, v) {
        zonas_bas_salud_object.hombre.push({ codigo: c, nombre: d, value: v })
    }

    function addZBSM(c, d, v) {
        zonas_bas_salud_object.mujer.push({ codigo: c, nombre: d, value: v })
    }

    function addZBS_65_79(c, d, v) {
        zonas_bas_salud_object.edad_65_79.push({ codigo: c, nombre: d, value: v })
    }

    function addZBS_80(c, d, v) {
        zonas_bas_salud_object.edad_80.push({ codigo: c, nombre: d, value: v })
    }

    function addZBS_Perfil(c, d, v) {
        zonas_bas_salud_object.perfil.push({ codigo: c, nombre: d, value: v })
    }

    function getZBS() {
        //console.log('llamaada a zonas')
        return $.ajax({
            dataType: "json",
            type: "GET",
            url: "https://gist.githubusercontent.com/AleOG/f7bfa242f4534e806cf24c29677586fd/raw/0b18b9aa2e7bf56e5557c9af06bf7d3f31ce3735/ZBS_ESP_WGS84.json",
        }).then(function (data) {
            return data.objects.ZBS_ESP_WGS84.geometries
        })
    }

    let callbackZBS = function (response) {
        zonas_bas_salud.removeAll();
        zonas_bas_salud_object.general.removeAll()
        zonas_bas_salud_object.hombre.removeAll()
        zonas_bas_salud_object.mujer.removeAll()
        zonas_bas_salud_object.edad_65_79.removeAll()
        zonas_bas_salud_object.edad_80.removeAll()
        zonas_bas_salud_object.perfil.removeAll()
        $.each(response, function (index, item) {
            //console.log(item.properties.codatzbs)
            addZBS(item.properties.codatzbs, item.properties.n_zbs)
            addZBSG(item.properties.codatzbs, item.properties.n_zbs)
            addZBSH(item.properties.codatzbs, item.properties.n_zbs)
            addZBSM(item.properties.codatzbs, item.properties.n_zbs)
            addZBS_65_79(item.properties.codatzbs, item.properties.n_zbs)
            addZBS_80(item.properties.codatzbs, item.properties.n_zbs)
            addZBS_Perfil(item.properties.codatzbs, item.properties.n_zbs)
        });
        //console.log('callback zonas', zonas_bas_salud())
        //setZBS(false)
    };

    //No se usa todavía
    var setZBS = function (s) {
        if (!s) {
            globalSector(undefined)
        }
        else {
            var t = ko.utils.arrayFirst(zonas_bas_salud(), function (f) {
                return f.codigo == s
            });

            if (t && (!globalSector() || s != globalSector().codigo)) {
                globalSector(t)
            }
        }
    };

    ko.observableArray.fn.pushAll = function (valuesToPushed) {
        var underlyingArray = this();
        this.valueWillMutate();
        this.removeAll();
        this.push(...valuesToPushed)
        this.valueHasMutated();
        return this;
    };

    function annadirValueSectores() {
        if (variabilidad_object.general == 'General') {
            if (globalAggLevel() === "as") {
                if ((areas_sanitarias_object.general().length == datos_object.datos_G.length) && areas_sanitarias_object.general().length > 0) {

                    $.each(datos_object.datos_G, function (index, item) {
                        let area = areas_sanitarias_object.general().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre
                    })

                    areas_sanitarias_object.general.pushAll(datos_object.datos_G)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.general().length == datos_object.datos_G.length) && zonas_bas_salud_object.general().length > 0) {

                    $.each(datos_object.datos_G, function (index, item) {
                        let zona = zonas_bas_salud_object.general().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.general.pushAll(datos_object.datos_G)
                }
            }
        }

        if (variabilidad_object.hombre == 'Hombre') {
            if (globalAggLevel() === "as") {
                if ((areas_sanitarias_object.hombre().length == datos_object.datos_H.length) && areas_sanitarias_object.hombre().length > 0) {

                    $.each(datos_object.datos_H, function (index, item) {
                        let area = areas_sanitarias_object.hombre().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre
                    })

                    areas_sanitarias_object.hombre.pushAll(datos_object.datos_H)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.hombre().length == datos_object.datos_H.length) && zonas_bas_salud_object.hombre().length > 0) {

                    $.each(datos_object.datos_H, function (index, item) {
                        let zona = zonas_bas_salud_object.hombre().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.hombre.pushAll(datos_object.datos_H)
                }
            }
        }

        if (variabilidad_object.mujer == 'Mujer') {
            if (globalAggLevel() === "as") {

                if ((areas_sanitarias_object.mujer().length == datos_object.datos_M.length) && areas_sanitarias_object.mujer().length > 0) {

                    $.each(datos_object.datos_M, function (index, item) {
                        let area = areas_sanitarias_object.mujer().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre

                    })

                    areas_sanitarias_object.mujer.pushAll(datos_object.datos_M)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.mujer().length == datos_object.datos_M.length) && zonas_bas_salud_object.mujer().length > 0) {

                    $.each(datos_object.datos_M, function (index, item) {
                        let zona = zonas_bas_salud_object.mujer().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.mujer.pushAll(datos_object.datos_M)
                }
            }
        }

        if (variabilidad_object.edad_65_79 == 'Edad_65_79') {
            if (globalAggLevel() === "as") {

                if ((areas_sanitarias_object.edad_65_79().length == datos_object.datos_65_79.length) && areas_sanitarias_object.edad_65_79().length > 0) {

                    $.each(datos_object.datos_65_79, function (index, item) {
                        let area = areas_sanitarias_object.edad_65_79().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre

                    })

                    areas_sanitarias_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.edad_65_79().length == datos_object.datos_65_79.length) && zonas_bas_salud_object.edad_65_79().length > 0) {

                    $.each(datos_object.datos_65_79, function (index, item) {
                        let zona = zonas_bas_salud_object.edad_65_79().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }
            }
        }

        if (variabilidad_object.edad_80 == 'Edad_80') {
            if (globalAggLevel() === "as") {

                if ((areas_sanitarias_object.edad_80().length == datos_object.datos_80.length) && areas_sanitarias_object.edad_80().length > 0) {

                    $.each(datos_object.datos_80, function (index, item) {
                        let area = areas_sanitarias_object.edad_80().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre

                    })

                    areas_sanitarias_object.edad_80.pushAll(datos_object.datos_80)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.edad_80().length == datos_object.datos_80.length) && zonas_bas_salud_object.edad_80().length > 0) {

                    $.each(datos_object.datos_80, function (index, item) {
                        let zona = zonas_bas_salud_object.edad_80().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.edad_80.pushAll(datos_object.datos_80)
                }
            }
        }

        if (variabilidad_object.perfil == 'Perfil') {
            if (globalAggLevel() === "as") {
                if ((areas_sanitarias_object.perfil().length == datos_object.datos_Perfil.length) && areas_sanitarias_object.perfil().length > 0) {

                    $.each(datos_object.datos_Perfil, function (index, item) {
                        let area = areas_sanitarias_object.perfil().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre
                    })

                    areas_sanitarias_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.perfil().length == datos_object.datos_Perfil.length) && zonas_bas_salud_object.perfil().length > 0) {

                    $.each(datos_object.datos_Perfil, function (index, item) {
                        let zona = zonas_bas_salud_object.perfil().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }
        }
    }


    datos.subscribe(function () {

        annadirValueSectores()

    })


    //Se muestran las zonas o las areas con sus valores de indicadores dependiendo del nivel de agregación seleccionado

    let getAreasZonasGeneral = ko.computed(function () {

        if ((areas_sanitarias_object.general().length == datos_object.datos_G.length) &&
            areas_sanitarias_object.general().length > 0 &&
            globalAggLevel() == 'as') {

            return areas_sanitarias_object.general
        }

        if ((zonas_bas_salud_object.general().length == datos_object.datos_G.length) &&
            zonas_bas_salud_object.general().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.general
        }

    }, this)

    let getAreasZonasHombre = ko.computed(function () {

        if ((areas_sanitarias_object.hombre().length == datos_object.datos_H.length) &&
            areas_sanitarias_object.hombre().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.hombre())
            //console.log(areas_sanitarias_object.hombre())

            return areas_sanitarias_object.hombre
        }

        if ((zonas_bas_salud_object.hombre().length == datos_object.datos_H.length) &&
            zonas_bas_salud_object.hombre().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.hombre
        }

    }, this)

    let getAreasZonasMujer = ko.computed(function () {

        if ((areas_sanitarias_object.mujer().length == datos_object.datos_M.length) &&
            areas_sanitarias_object.mujer().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.mujer())
            return areas_sanitarias_object.mujer
        }

        if ((zonas_bas_salud_object.mujer().length == datos_object.datos_M.length) &&
            zonas_bas_salud_object.mujer().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.mujer
        }

    }, this)

    let getAreasZonasEdad_65_79 = ko.computed(function () {

        if ((areas_sanitarias_object.edad_65_79().length == datos_object.datos_65_79.length) &&
            areas_sanitarias_object.edad_65_79().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.mujer())
            return areas_sanitarias_object.edad_65_79
        }

        if ((zonas_bas_salud_object.edad_65_79().length == datos_object.datos_65_79.length) &&
            zonas_bas_salud_object.edad_65_79().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.edad_65_79
        }

    }, this)

    let getAreasZonasEdad_80 = ko.computed(function () {

        if ((areas_sanitarias_object.edad_80().length == datos_object.datos_80.length) &&
            areas_sanitarias_object.edad_80().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.mujer())
            return areas_sanitarias_object.edad_80
        }

        if ((zonas_bas_salud_object.edad_80().length == datos_object.datos_80.length) &&
            zonas_bas_salud_object.edad_80().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.edad_80
        }

    }, this)


    let getAreasZonasPerfil = ko.computed(function () {

        if ((areas_sanitarias_object.perfil().length == datos_object.datos_Perfil.length) &&
            areas_sanitarias_object.perfil().length > 0 &&
            globalAggLevel() == 'as') {

            return areas_sanitarias_object.perfil
        }

        if ((zonas_bas_salud_object.perfil().length == datos_object.datos_Perfil.length) &&
            zonas_bas_salud_object.perfil().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.perfil
        }

    }, this)

    globalAggLevel.subscribe(function () {
        //console.log("en subscribe aggLevel", globalAggLevel())
        selectedSectores.removeAll()
    })

    selectedSectores.subscribe(function () {
        perfil.removeAll()
        if (opcionesIndicadores().length > 0 && selectedSectores().length > 0 && variabilidad_object.perfil=='Perfil') {

            console.log('perfil',perfil())
            let datosIndicadores = opcionesIndicadores().find(element => element.escala == globalAggLevel()).indicadores[0].subindicadores

            console.log('sectores seleccionados', selectedSectores())

            $.each(datosIndicadores, function (index, indicador) {
                //console.log(selectedSectores())
                getDataTabla(indicador, selectedSectores()).done(annadirPerfil)
            })

            console.log('totalidad', datosIndicadores)
            console.log('perfil', perfil())
        }
    })



    function annadirPerfil(datos) {
        const {idIndicador, nombreIndicador, data: dataPerfil} = datos;
        //console.log('indicador id', idIndicador)
        //console.log('perfil en cliente',dataPerfil)
        let perfilSector = []
        dataPerfil.data.forEach(element => {
            //console.log(element)
            let nombre = null;
            if(element.code_as) {
                nombre = datos_object.datos_Perfil.find(dato => dato.codigo == element.code_as).nombre;
            }
            if(element.code_zbs) {
                nombre = datos_object.datos_Perfil.find(dato => dato.codigo == element.code_zbs).nombre;
            }
            //console.log('nombre sector', nombre)
            element.values.push(nombre)
            element.values.push(nombreIndicador)
            element.values.push(idIndicador)
            perfilSector.push(element.values)
        });
        //console.log('perfilSector', perfilSector)
        perfil.push(perfilSector)
    }

    function seleccionSector(sectorId, sectoresSeleccionados) {
        //console.log(selectedSectores())
        if (selectedSectores().includes(sectorId)) {
            //console.log('Lo incluye')
            $.each(sectoresSeleccionados, function () {
                //console.log('sector', this)
                d3.select(this).style('stroke', "gray").style('stroke-width', '0.1')
            })
            let index = selectedSectores.indexOf(sectorId)
            selectedSectores.splice(index, 1)
        } else {
            //console.log(sectorSeleccionado)
            //console.log('No lo inluye')
            $.each(sectoresSeleccionados, function () {
                //console.log('sector', this)
                d3.select(this).style('stroke', "aqua").style('stroke-width', '2')
            })
            selectedSectores.push(sectorId)
            if (globalAggLevel() === "as") {
                let sectorG = areas_sanitarias_object.general().find(sector => sector.codigo == sectorId)
                let indexG = areas_sanitarias_object.general().indexOf(sectorG)
                areas_sanitarias_object.general.splice(indexG, 1)
                areas_sanitarias_object.general.unshift(sectorG)

                let sectorH = areas_sanitarias_object.hombre().find(sector => sector.codigo == sectorId)
                let indexH = areas_sanitarias_object.hombre().indexOf(sectorH)
                areas_sanitarias_object.hombre.splice(indexH, 1)
                areas_sanitarias_object.hombre.unshift(sectorH)

                let sectorM = areas_sanitarias_object.mujer().find(sector => sector.codigo == sectorId)
                let indexM = areas_sanitarias_object.mujer().indexOf(sectorM)
                areas_sanitarias_object.mujer.splice(indexM, 1)
                areas_sanitarias_object.mujer.unshift(sectorM)

                let sector65_79 = areas_sanitarias_object.edad_65_79().find(sector => sector.codigo == sectorId)
                let index65_79 = areas_sanitarias_object.edad_65_79().indexOf(sector65_79)
                areas_sanitarias_object.edad_65_79.splice(index65_79, 1)
                areas_sanitarias_object.edad_65_79.unshift(sector65_79)

                let sector80 = areas_sanitarias_object.edad_80().find(sector => sector.codigo == sectorId)
                let index80 = areas_sanitarias_object.edad_80().indexOf(sector80)
                areas_sanitarias_object.edad_80.splice(index80, 1)
                areas_sanitarias_object.edad_80.unshift(sector80)


                let sectorP = areas_sanitarias_object.perfil().find(sector => sector.codigo == sectorId)
                let indexP = areas_sanitarias_object.perfil().indexOf(sectorP)
                areas_sanitarias_object.perfil.splice(indexP, 1)
                areas_sanitarias_object.perfil.unshift(sectorP)
            }
            if (globalAggLevel() === "zbs") {
                let sectorG = zonas_bas_salud_object.general().find(sector => sector.codigo == sectorId)
                let indexG = zonas_bas_salud_object.general().indexOf(sectorG)
                zonas_bas_salud_object.general.splice(indexG, 1)
                zonas_bas_salud_object.general.unshift(sectorG)

                let sectorH = zonas_bas_salud_object.hombre().find(sector => sector.codigo == sectorId)
                let indexH = zonas_bas_salud_object.hombre().indexOf(sectorH)
                zonas_bas_salud_object.hombre.splice(indexH, 1)
                zonas_bas_salud_object.hombre.unshift(sectorH)

                let sectorM = zonas_bas_salud_object.mujer().find(sector => sector.codigo == sectorId)
                let indexM = zonas_bas_salud_object.mujer().indexOf(sectorM)
                zonas_bas_salud_object.mujer.splice(indexM, 1)
                zonas_bas_salud_object.mujer.unshift(sectorM)

                let sector65_79 = zonas_bas_salud_object.edad_65_79().find(sector => sector.codigo == sectorId)
                let index65_79 = zonas_bas_salud_object.edad_65_79().indexOf(sector65_79)
                zonas_bas_salud_object.edad_65_79.splice(index65_79, 1)
                zonas_bas_salud_object.edad_65_79.unshift(sector65_79)

                let sector80 = zonas_bas_salud_object.edad_80().find(sector => sector.codigo == sectorId)
                let index80 = zonas_bas_salud_object.edad_80().indexOf(sector80)
                zonas_bas_salud_object.edad_80.splice(index80, 1)
                zonas_bas_salud_object.edad_80.unshift(sector80)

                let sectorP = zonas_bas_salud_object.perfil().find(sector => sector.codigo == sectorId)
                let indexP = zonas_bas_salud_object.perfil().indexOf(sectorP)
                zonas_bas_salud_object.perfil.splice(indexP, 1)
                zonas_bas_salud_object.perfil.unshift(sectorP)
            }
        }
    }

    let setSector = function (s) {
        //console.log("sector en biganStructure ", s)
        let sectoresSeleccionados = $(`.${s}`)
        //console.log('sectores seleccionados en click mapa', sectoresSeleccionados)
        seleccionSector(s, sectoresSeleccionados)
    }

    function ordenarAlfabeticamente(element) {
        let id = $(element).attr('id')

        if (!$(element).hasClass('fa-arrow-circle-down')) {
            if (globalAggLevel() == 'as') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }

            if (globalAggLevel() == 'zbs') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }
        }
        else {
            if (globalAggLevel() == 'as') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }

            if (globalAggLevel() == 'zbs') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }
        }
    }

    ko.bindingHandlers.bindingTendencia = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            let value = ko.unwrap(valueAccessor());

            leyendaTendencia(element, value)

        }
    };

    ko.bindingHandlers.bindingPerfilDesempenno = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            let values = ko.unwrap(valueAccessor());

            //const {color, id, P25} = value;
            //console.log('hsa')
            getLeyendaPerfilDesempenno(element, values).done(leyendaPerfilDesempenno)

        }
    }


    var init = function () {

        //se cargan las zonas básicas de salud
        Promise.all([getZBS(), getAS()]).then(values => {
            callbackZBS(values[0])
            callbackAS(values[1])
            annadirValueSectores()
        })


        $(".str-bindable").each(function () {

            ko.applyBindings(myViewModel, this)
        })

        $(this).on('click', 'i[title="Ordenar alfabéticamente"]', function () {
            ordenarAlfabeticamente(this)
            $(this).toggleClass('fa-arrow-circle-up fa-arrow-circle-down')
        })

        $(this).on('click', '#table-item', function () {
            let idSector = +$(this).find('p').text()
            let sectoresSeleccionados = $(`.${idSector}`)
            //console.log('sectores seleccionados', sectoresSeleccionados)
            seleccionSector(idSector, sectoresSeleccionados)
        })

        $(this).on('click', '#Limpiar', function() {
            selectedSectores.removeAll()
            let sectores = $('path')
            $.each(sectores, function(index, sector) {
                d3.select(sector).style('stroke', "gray").style('stroke-width', '0.1')
            })
        })

    };

    $(init);


    return {
        aggLevels: aggLevels,
        globalAggLevel: globalAggLevel,
        setAggLevel: setAggLevel,
        getAggLevel: getAggLevel,
        indicadores: indicadores,
        setIndicador: setIndicador,
        globalIndicador: globalIndicador,
        getIndicador: getIndicador,
        setDataAggLevels: setDataAggLevels,
        setDataIndicadores: setDataIndicadores,
        opcionesIndicadores: opcionesIndicadores,
        elegirIndicadores: elegirIndicadores,
        setSector: setSector,
        selectedSectores: selectedSectores,
        getAreasZonasGeneral: getAreasZonasGeneral,
        getAreasZonasHombre: getAreasZonasHombre,
        getAreasZonasMujer: getAreasZonasMujer,
        getAreasZonasEdad_65_79: getAreasZonasEdad_65_79,
        getAreasZonasEdad_80: getAreasZonasEdad_80,
        getAreasZonasPerfil: getAreasZonasPerfil,
        setVariabilidad,
        setData,
        perfil: perfil
    }
}();
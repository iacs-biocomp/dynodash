import { Injectable } from "@nestjs/common";
import * as Handlebars from "handlebars";

import { PlantillasService } from "src/plantillas/plantillas.service";


export class Funciones {

  constructor(
    //private appService: AppService,
    private plantillaService: PlantillasService
    ) { }

    /**
     * 
     * Funcion que recibe una plantilla HTML con etiquetas {{{etiqueta}}}.
     * 
     * Localiza las etiquetas únicas.
     * 
     * Devuelve un array con los nombres de las etiquetas.
     * 
     * @param plantilla 
     * @returns 
     */
  buscadorEtiquetas(plantilla: string): string[] {
    const re = /\{[{]+([^{}][^{}]*)\}/g;

    //regex to find #each
    //const reEach = /\{#each([^{}][^{}]*)\}/g;

    //obtiene la etiqueta entre llaves y se devuelve un array con las etiquetas
    const matches = [...plantilla.matchAll(re)].flat();

    //[{etiqueta}, etiqueta]
    const etiquetasMatched = matches.filter(item => matches.indexOf(item) % 2 != 0);

    //Solo se guardan las etiquetas únicas
    const etiquetasUnicas = etiquetasMatched.filter( (value, index, self) => self.indexOf(value) == index);

    return etiquetasUnicas;
  }

  /**
   * 
   * Esta funcion construye un JSON especifico para compilar cada template de Handlebars.
   * 
   * Un campo del JSON tendra como clave el nombre de la etiqueta y como valor el contenido del map con el mismo nombre que la etiqueta.
   * 
   * El map contiene todos los campos de un Widget del arrayWidgets.
   * 
   * @param etiquetas 
   * @param map 
   * @returns 
   */

  crearJSON( etiquetas : string[], map : Map<string, string>) {
    
    let data = "";

    //Si no hay etiquetas se devuelve un json vacio
    if(etiquetas.length==0) {

      return JSON.parse("{" + data + "}");
    }

    //Se construye el JSON
    for(let i = 0; i< etiquetas.length; i++) {
      if(i==0) {
        data += '{"' + etiquetas[i] + '" : "' + map.get(etiquetas[i]) + '"'
      }
      else {
        data += ', "' + etiquetas[i] + '" : "' + map.get(etiquetas[i]) + '"'
      }
    }  
    
    data += "}"
    //console.log("DAtos..................")
    //console.log(data)
    const json = JSON.parse(data)
    //console.log("JSON..................")
    //console.log(json)
    return json;
  }

  crearJSONnull(etiquetas: string[]) {
    //Se usan las etiquetas para buscar las plantillas en la base de datos, se crea un JSON con ellas y se devuelve el JSON
    let data = "";
    for (let i = 0; i < etiquetas.length; i++) {

      const datos = ""
      //this.appService.getData(etiquetas[i]);

      console.log("Datos en crearJSON")
      console.log(datos)

      if (i == etiquetas.length - 1) {
        data += datos
      } else {
        data += datos + ",";
      }

    }
    console.log("{" + data + "}")

    const json = JSON.parse("{" + data + "}");

    return json;
  }

  /**
   * 
   * Se recibe el array de widgets. 
   * 
   * Si el array está vacío entonces se devuelve un array sin elementos ["",""].
   * 
   * Si el array tiene widgets se creará un array que en la posicion 0 tendrá el HTML y en la posicion 1 tendrá el JAVASCRIPT. ["HTML", "JS"]
   * 
   * @param widgets 
   * @returns string[]
   */

  async constructorDashboard(arrayWidgets : Record<string, any>[]) : Promise<string[]> {

    let arrayHTML_JS = ["",""];

    if(arrayWidgets.length==0) {
      return arrayHTML_JS;
    }

    //Se ordenan los elementos dentro del array por su atributo "order" de manera ascendente
    let arrayWidgetsOrdenado = this.ordenarWidgetsPorOrder(arrayWidgets);

    //Pasar el widget a un bucle que contendrá la funcion contruirHTML y construirScript
    for (let index = 0; index < arrayWidgetsOrdenado.length; index++) {

      arrayHTML_JS[0] +=  await this.construirFrame(arrayWidgetsOrdenado[index]);

      arrayHTML_JS[1] += this.construirScript(arrayWidgetsOrdenado[index])
      
    }

    
    return arrayHTML_JS;
  }

  async construirFrame(widget : Record<string, any>) : Promise<string> {

    let documentDecoded = "";

    const { frame, order, type, url, doc, title, info } = widget;


    //Se encuentra el widget en la coleccion Widgets y se destructura el template y el js
    const { template, js} = await this.plantillaService.obtenerWidget(type);

    //se encuentra el template en la coleccion Templates y se devuelve el HTML decodificado
    const templateDecoded = await this.plantillaService.obtenerTemplateContent(template);

    //se encuentra el doc en la coleccion Documentos y se devuelve el HTML decodificado. 
    //Si doc es null, es decir, no existe, no se realiza la busqueda
    if(doc) {
      documentDecoded = await this.plantillaService.obtenerDocumentoContent(doc)
    }

    //construccion del frame_id
    const frame_id = frame + "_" + order

    console.log("--------------------------------")
    console.log(templateDecoded)

    //Se localizan las etiquetas
    const etiquetas = this.buscadorEtiquetas(templateDecoded)

    //*****************Esta creaciond el map podría ser una funcion
    const map = new Map<string, string>();

    map.set("frame_id", frame_id )
    map.set("doc", documentDecoded)
    map.set("title", title)
    map.set("info", info)

    //se ejecuta la funcion crearJSON que toma como parametros el array de etiquetas y el map y devolvera un JSON
    //console.log("Mapa -------------------------------------")
    //console.log(map)
    //console.log("Etiquetas-------------------------------------")
    //console.log(etiquetas)

    //Se aplica la funcion de crear JSON
    const json = this.crearJSON(etiquetas, map);
    console.log("JSON -------------------------------------")
    console.log(json)

    //Se compila la templateDecoded con el JSON
    console.log('Plantilla compilada-----------------------------------------')
    const compiledTemplate = Handlebars.compile(templateDecoded);
    //console.log(compiledTemplate)

    const  html = compiledTemplate(json)
    console.log(html)

    //Se devuelve una template compilada

    return type;

  }

  construirScript(widget : Record<string, any>) : string {

    const { frame, order, url, js } = widget;

    return js;

  }

  /**
   * 
   * Esta funcion se encarga de ordenar los widgets dentro del array por su atributo "order" de forma ascendente.
   * 
   * @param arrayWidgets 
   * @returns 
   */
  ordenarWidgetsPorOrder(arrayWidgets : Record<string, any>[]) : Record<string, any>[] {

    let arrayWidgetsOrdenado = arrayWidgets.sort(function (a, b) {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })

    return arrayWidgetsOrdenado;

  }


}




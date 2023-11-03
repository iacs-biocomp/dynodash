import { Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { PlantillasService } from 'src/plantillas/plantillas.service';


/**
 * 
 */
export class Functions {
  // Logger de Nest
  private readonly logger = new Logger('Funciones');
  constructor(
    private plantillaService: PlantillasService,
  ) {}

  // Este array es estatico y solo se modificará cuando se refresque la página del buscador y se encuentren agumentos "type" nuevos.
  private scriptTypes = [];



  /**
   * Returns an array set of unique tags in the form {{{tag}}}
   * on a given text
   *
   * @param text
   * @returns
   */
  findTags(text: string): string[] {
    const re = /\{[{]+([^{}][^{}]*)\}/g;

    //obtiene la etiqueta entre llaves y se devuelve un array con las etiquetas
    const matches = [...text.matchAll(re)].flat();

    //[{etiqueta}, etiqueta]
    const tagMatched = matches.filter(
      (item) => matches.indexOf(item) % 2 != 0,
    );
    //Solo se guardan las etiquetas únicas
    const singleTags = [ ... new Set(tagMatched)]
    return singleTags;
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
  crearJSON(etiquetas: string[], map: Map<string, string>) {
    let data = '';

    //Si no hay etiquetas se devuelve un json vacio
    if (etiquetas.length == 0) {
      return JSON.parse('{' + data + '}');
    }

    //Se construye el JSON
    for (let i = 0; i < etiquetas.length; i++) {
      if (i == 0) {
        data += '{"' + etiquetas[i] + '" : "' + map.get(etiquetas[i]) + '"';
      } else {
        data += ', "' + etiquetas[i] + '" : "' + map.get(etiquetas[i]) + '"';
      }
    }

    data += '}';

    const json = JSON.parse(data);

    return json;
  }

  //Function deprecated
  crearJSONnull(etiquetas: string[]) {
    //Se usan las etiquetas para buscar las plantillas en la base de datos, se crea un JSON con ellas y se devuelve el JSON
    let data = '';
    for (let i = 0; i < etiquetas.length; i++) {
      const datos = '';

      if (i == etiquetas.length - 1) {
        data += datos;
      } else {
        data += datos + ',';
      }
    }

    const json = JSON.parse('{' + data + '}');

    return json;
  }



  /**
   *
   * Se recibe el array de widgets.
   *
   * Si el array está vacío entonces se devuelve un array sin elementos ["","", []].
   *
   * Si el array tiene widgets se creará un array que en la posicion 0 tendrá el HTML, en la posicion 1 tendrá el JAVASCRIPT y en la posicion 2 tendrá el array con los nombres únicos de los Widgets
   *
   * Ejemplo: ["HTML", "JS", [ 'INFO-PANEL-O', 'DATE_SLIDER', 'MAP_ARAGON_S' ]]
   *
   * @param widgets
   * @returns string[]
   */
  async constructorDashboard(
    arrayWidgets: Record<string, any>[],
  ): Promise<any> {
    const arrayHTML_JS = ['', '', []];

    let scriptTypes: string[] = [];

    if (arrayWidgets.length == 0) {
      return arrayHTML_JS;
    }

    //Se ordenan los elementos dentro del array por su atributo "order" de manera ascendente
    const arrayWidgetsOrdenado = this.ordenarWidgetsPorOrder(arrayWidgets);

    //Pasar el widget a un bucle que contendrá la funcion contruirHTML y construirScript
    for (let index = 0; index < arrayWidgetsOrdenado.length; index++) {
      arrayHTML_JS[0] += await this.construirFrame(arrayWidgetsOrdenado[index]);

      arrayHTML_JS[1] += await this.construirScriptSpecific(
        arrayWidgetsOrdenado[index],
      );

      scriptTypes = this.obtenerScriptTypes(arrayWidgetsOrdenado[index]);
    }

    arrayHTML_JS[2] = scriptTypes;

    return arrayHTML_JS;
  }



  /**
   *
   * Esta funcion recibe como parametro un array de widgets.
   *
   * Contruye la plantilla Frame añadiendole sus caracteristicas propias como son el frame_id, documentos, titles e infos.
   *
   * Se devuelve la plantilla Frame compilada.
   *
   * @param widget
   * @returns
   */
  async construirFrame(widget: Record<string, any>): Promise<string> {
    let documentDecoded = '';

    const { frame, order, type, url, doc, title, info, label } = widget;

    //Se encuentra el widget en la coleccion Widgets y se destructura el template y el js
    const { template } = await this.plantillaService.obtenerWidget(type);

    //se encuentra el template en la coleccion Templates y se devuelve el HTML decodificado
    const templateDecoded = await this.plantillaService.getTemplateContent(
      template,
    );

    //se encuentra el doc en la coleccion Documentos y se devuelve el HTML decodificado.
    //Si doc es null, es decir, no existe, no se realiza la busqueda
 //   if (doc) {
 //     documentDecoded = await this.plantillaService.obtenerDocumentoContent(
 //       doc,
 //     );
 //   }

    //construccion del frame_id
    const frame_id = frame + '_' + order;

    //Se localizan las etiquetas
    const etiquetas = this.findTags(templateDecoded);

    //*****************Esta creacion del map podría ser una funcion
    const map = new Map<string, string>();

    const nombresEtiquetas = ['title', 'info', 'label', 'url'];

    for (let i = 0; i < nombresEtiquetas.length; i++) {
      const propiedad = widget[nombresEtiquetas[i]];

      if (Array.isArray(propiedad) && propiedad.length > 1) {
        for (let j = 0; j < propiedad.length; j++) {
          map.set(nombresEtiquetas[i] + '_' + (j + 1), propiedad[j]);
        }
      } else {
        map.set(nombresEtiquetas[i], propiedad);
      }
    }

    map.set('frame_id', frame_id);
    map.set('doc', documentDecoded);

    //se ejecuta la funcion crearJSON que toma como parametros el array de etiquetas y el map y devolvera un JSON
    const json = this.crearJSON(etiquetas, map);

    //Se compila la templateDecoded con el JSON
    const compiledTemplate = Handlebars.compile(templateDecoded);

    const html = compiledTemplate(json);

    return html;
  }

  /**
   *
   * Esta funcion recibe como parametro un array de widgets.
   *
   * Contruye el javaScript específico para cada frame incluyendo su frame_id y url.
   *
   * @param widget
   * @returns
   */
  async construirScriptSpecific(widget: Record<string, any>): Promise<string> {
    let script = '';
    let javaScriptSpecific = '';

    const { frame, order, url, js, label } = widget;

    //construir el javascript especifico de los templates
    if (js) {
      javaScriptSpecific = await this.plantillaService.obtenerScript(js);

      const etiquetas = this.findTags(javaScriptSpecific);

      //construccion del frame_id
      const frame_id = frame + '_' + order;

      const map = new Map<string, string>();

      map.set('frame_id', frame_id);
      map.set('url', url);
      map.set('label', label);

      //Se aplica la funcion de crear JSON
      const json = this.crearJSON(etiquetas, map);

      //Se compila la javaScriptSpecific con el JSON
      const compiledScript = Handlebars.compile(javaScriptSpecific);

      script = compiledScript(json);

      return script;
    }

    return script;
  }

  /**
   * Esta funcion recibe el array estatico de los tipos de widget.
   * Se relizan peticones a la coleccion Widgets para extraer el el argumento "js". Este argumento contiene la URL donde está localizada la librería JavaScript necesaria.
   *
   * Al funcion devuelve las etiquetas script con la src = URL
   *
   * @param scriptGeneric
   * @returns
   */
  async construirScriptGeneric(scriptTypes: string[]): Promise<string> {
    let javaScriptGeneric = '';

    if (scriptTypes.length != 0) {
      for (let index = 0; index < scriptTypes.length; index++) {
        //se obtiene el js localizado en el widget de la coleccion Widgets
        const { js: javas } = await this.plantillaService.obtenerWidget(
          scriptTypes[index],
        );
        //contruir etiqueta de javascript
        if (javas) {
          const script = await this.plantillaService.obtenerScript(javas);
          javaScriptGeneric += '<script>' + script + '</script>\n';
        }
      }
    }
    return javaScriptGeneric;
  }

  /**
   *
   * Esta funcion extrae el argumento "type" de un widget y los añade a un array si no ha sido añadido previamente.
   *
   * Lo añade al array estático scriptTypes
   *
   * @param widget
   * @returns
   */
  obtenerScriptTypes(widget: Record<string, any>): string[] {
    const { type } = widget;

    if (!this.scriptTypes.includes(type)) {
      this.scriptTypes.push(type);
    }
    return this.scriptTypes;
  }

  /**
   *
   * Esta funcion se encarga de ordenar los widgets dentro del array por su atributo "order" de forma ascendente.
   *
   * @param arrayWidgets
   * @returns
   */
  ordenarWidgetsPorOrder(
    arrayWidgets: Record<string, any>[],
  ): Record<string, any>[] {
    const arrayWidgetsOrdenado = arrayWidgets.sort(function (a, b) {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return arrayWidgetsOrdenado;
  }
}

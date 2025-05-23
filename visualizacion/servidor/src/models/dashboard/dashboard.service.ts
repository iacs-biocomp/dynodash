import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buffer } from 'buffer';
import { Dashboard, DashboardType } from './schemas/dashboard.schema';
import { ScriptType } from '../scripts/script.schema';
import { TemplateType } from '../template/template.schema';
import { Widget, WidgetType } from '../widgets/widget.schema';


@Injectable()
export class DashboardService {
  // Logger de Nest
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel('Dashboard') private dashboardModel: Model<DashboardType>,
    @InjectModel('Script') private scriptModel: Model<ScriptType>,
    @InjectModel('Template') private templateModel: Model<TemplateType>,
    @InjectModel('Widget') private widgetModel: Model<WidgetType>,
  ) {}

  // Este array es estatico y solo se modificará cuando se refresque la página del buscador y se encuentren agumentos "type" nuevos.
  private scriptTypes = [];

  /**
   * Gets the list of all dashboards
   * @returns
   */
  async getDashboardList(): Promise<Dashboard[]> {
    return await this.dashboardModel.find().lean();
  }

  /**
   * Esta funcion busca un objeto template por el atributo code
   *
   * @param dashboardId
   */
  async getHTML(dashboardId: string) {
    this.logger.debug("Recuperando dashboard " + dashboardId)
    //Localiza el dashboard en la DB y se extrae el campo 'template'
    const { template, widgets } = await this.dashboardModel.findOne({
      id_dashboard: dashboardId,
    });
    //Se localiza el template en la DB y se devuelve el HTML decodificado
    const HTMLdecoded = await this.getTemplateContent(template);
    //this.logger.log(HTMLdecoded);

    //Se encuentran las etiquetas contenidas por la template
    const tags = this.findTags(HTMLdecoded);
    //this.logger.debug(tags)

    const map = new Map();
    let arrayWidgets: Record<string, any>[];
    //Esta variable almacena todo el código javaScript que le da dinamismo al dashboard.
    let javaScriptSpecific = ' ';
    //Esta variable almacena las URL que llaman a librerías de javaScript.
    let javaScriptGeneric = ' ';
    /*Esta variable contiene el argumento "type" de los widgets utilizados para contruir el dashboard. El array es de elementos únicos.
      ejemplo: [ 'INFO-PANEL-O', 'DATE_SLIDER', 'MAP_ARAGON_S' ]
    */
    let namesScriptGeneric = [];


    for (const tag of tags) { //let index = 0; index < tags.length; index++) {
      //this.logger.debug("tag " + tag)
      
      //Se recoge el id del frame
      const id = tag.split('_')[1];
      //this.logger.debug("id " + id)

      //Se seleccionan los widgets cuyo frame coincide con el id del frame del dashboard
      arrayWidgets = widgets.filter((widget) => widget.frame == id);

      const dashboardStruct = await this.buildDashboard ( arrayWidgets );
      javaScriptSpecific += dashboardStruct.script;
      //Solo es valido el array obtenido el el último loop, ya que el array estará completo con todos los nombres de widgets.
      namesScriptGeneric = dashboardStruct.libs;
      //Se introducen en una coleccion clave/value siendo la clave el frame:x y el valor el html a introducir en ese frame
      map.set(tag, dashboardStruct.html);
    }

    javaScriptGeneric = await this.buildGlobalScript( namesScriptGeneric );

    //construccion del JSON
    const frameMap = this.buildFrameMap(tags, map);

    //Compilacion de la HTMLdecoded
    const compiledDashboard = Handlebars.compile(HTMLdecoded);
    const html =
      compiledDashboard(frameMap) +
      '\n<script>' +
      javaScriptSpecific +
      '</script>\n' +
      javaScriptGeneric;
    return html;
  }

  /**
   * 
   * @param scriptName 
   * @returns 
   */
  async getScript(scriptName: string): Promise<string> {
    //this.logger.debug("scriptName to retrieve: " + scriptName);
    const { content } = await this.scriptModel.findOne({ name: scriptName });
    let scriptDecoded = '';
    if (content) {
       scriptDecoded = Buffer.from(content, 'base64').toString('utf-8');
    }
   return scriptDecoded;
  }


  /**
   * 
   * @param name 
   * @returns 
   */
  async getWidget(name: string): Promise<Widget> {
    const widget = await this.widgetModel.findOne({ type: name });
    return widget;
  }


  /**
   * 
   * @param templateName 
   * @returns 
   */
  async getTemplateContent(templateName: string): Promise<string> {
    const { content } = await this.templateModel.findOne({ code: templateName });
    const HTMLdecoded = Buffer.from(content, 'base64').toString('utf-8');
    return HTMLdecoded;
  }
  /**
   * Returns an array set of unique tags in the form {{{tag}}}
   * on a given text
   *
   * @param text
   * @returns
   */
    findTags(text: string): string[] {
      const re = /\{[{]+([^{}][^{}]*)\}\}\}/g;
      const matches = [...text.matchAll(re)];
      const tagMatched = matches.map(m => m[1])
      //console.log("tagMatched: ", tagMatched)
      // Each label only once
      const singleTags = [ ... new Set(tagMatched)]
      //console.log("singleTags: ", singleTags)
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
  buildFrameMap(tags: string[], map: Map<string, string>) {
    let data = {};

    //Si no hay etiquetas se devuelve un json vacio
    if (tags.length == 0) {
      return data;
    }

    //Se construye el JSON
    for (let [index,tag] of tags.entries()) {
      let t = map.get(tag)
      if (t) t=t.replace(/(\r\n|\n|\r|\t)/gm, "")  //delete CR/LF in Json
      if (t) t=t.replace(/([ ]+)/gm, " ")  //delete CR/LF in Json
      data[tag] = t;
    }
    return data;
  }



  /**
   *
   * Se recibe el array de widgets.
   *
   * Si el array está vacío entonces se devuelve un array sin elementos ["","", []].
   *
   * Si el array tiene widgets se creará un array que en la posicion 0 tendrá el HTML, en la posicion 1 
   * tendrá el JAVASCRIPT y en la posicion 2 tendrá el array con los nombres únicos de los Widgets
   *
   * Ejemplo: ["HTML", "JS", [ 'INFO-PANEL-O', 'DATE_SLIDER', 'MAP_ARAGON_S' ]]
   *
   * @param widgets
   * @returns string[]
   */
  async buildDashboard (
    arrayWidgets: Record<string, any>[],
  ): Promise<any> {
    
    const content = {
      html: '', 
      script: '', 
      libs: []
    };
    let scriptTypes: string[] = [];
    if (arrayWidgets.length == 0) {
      return content;
    }

    const arrayWidgetsOrdenado = this.sortWidgets(arrayWidgets); //Se ordenan los elementos dentro del array
    //Pasar el widget a un bucle que contendrá la funcion contruirHTML y construirScript
    //for (let index = 0; index < arrayWidgetsOrdenado.length; index++) {
    for (let name in arrayWidgetsOrdenado) {
      content.html += await this.buildFrame(arrayWidgetsOrdenado[name]);
      content.script += await this.buildWidgetScript(arrayWidgetsOrdenado[name]);
      scriptTypes = this.getScriptTypes(arrayWidgetsOrdenado[name]);
    }

    content.libs = scriptTypes;
    return content;
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
  async buildFrame(widget: Record<string, any>): Promise<string> {
    const { frame, order, type, url, doc, title, info, label } = widget;
    const { template } = await this.getWidget(type);
    const templateDecoded = await this.getTemplateContent(template);

    // Look for tags in template
    const tags = this.findTags(templateDecoded);

    // Building tag/value map from widget definition
    const map = new Map<string, string>();
    map.set("frame_id", frame + '_' + order) // unique frame id

    //const tagNames = ['title', 'info', 'label', 'url', 'doc'];
    const tagNames = Object.keys(widget._doc);
    // this.logger.debug("tagNames", tagNames);

    
    for (let tag of tagNames) {
      let value = widget[tag];
      // console.log ("tag_value: ", tag, widget[tag]);
      if (Array.isArray(value) && value.length > 1) {
        for (let j = 0; j < value.length; j++) {
          map.set(tag + '_' + (j + 1), value[j]);
        }
      } else {
        if (tag == 'doc' && value)
          value = Buffer.from(value, 'base64').toString('utf-8');
        map.set(tag, value);
      }
    }

    //se ejecuta la funcion crearJSON que toma como parametros el array de etiquetas y el map y devolvera un JSON
    const frameMap = this.buildFrameMap(tags, map);
    // console.log ("map to hbs: ", json);

    //Se compila la templateDecoded con el JSON
    const compiledTemplate = Handlebars.compile(templateDecoded);
    const html = compiledTemplate(frameMap);
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
    async buildWidgetScript(widget: Record<string, any>): Promise<string> {
      let script = '';
      let javaScriptSpecific = '';
  
      const { frame, order, url, js, label } = widget;
      
      //this.logger.log("buildWidgetScript:")
      //this.logger.log(widget)
  
      //construir el javascript especifico de los templates
      if (js) {
        javaScriptSpecific = await this.getScript(js);
        // in js we can refer a stored script, or store inline script
        if (!javaScriptSpecific) {
          javaScriptSpecific = js;
        }

        //this.logger.debug("Script del widget:")
        //this.logger.debug(javaScriptSpecific)
        const scriptTags = this.findTags(javaScriptSpecific);
  
        const map = new Map<string, string>();
        map.set('frame_id', frame + '_' + order);
        map.set('url', url);
        map.set('label', label);
  
        //Se aplica la funcion de crear JSON
        const frameMap = this.buildFrameMap(scriptTags, map);
  
        //Se compila la javaScriptSpecific con el JSON
        const compiledScript = Handlebars.compile(javaScriptSpecific);
        script = compiledScript(frameMap);
      }
  
      //this.logger.debug(`Construyendo script de widget ${frame} ${order}: ${url}, ${label}`)
      //console.log(script)
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
  async buildGlobalScript(scriptTypes: string[]): Promise<string> {
    let javaScriptGeneric = '';

    if (scriptTypes && scriptTypes.length > 0) {
      for (let widgetType of scriptTypes) {
        const { js: javas } = await this.getWidget( widgetType );
        //contruir etiqueta de javascript
        if (javas) {
          if (javas.startsWith('/')) {
            // Is a reference to load a script from static or CDN
          } else {
            const script = await this.getScript(javas);
            javaScriptGeneric += '<script>' + script + '</script>\n';
          }
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
  getScriptTypes(widget: Record<string, any>): string[] {
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
    sortWidgets(
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

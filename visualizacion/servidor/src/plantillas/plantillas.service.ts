import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buffer } from 'buffer';
import { Funciones } from '../common/funciones/funciones';
import {
  Dashboard,
  DashboardType,
  Documento,
  DocumentoType,
  Script,
  ScriptType,
  Template,
  TemplateType,
  Widget,
  WidgetType,
} from './schemas';
import {
  CrearDashboardDTO,
  CrearDocumentDTO,
  CrearScriptDTO,
  CrearTemplateDTO,
  CrearWidgetDTO,
} from './dto';

@Injectable()
export class PlantillasService {
  //Se instancia un objeto de la clase Funciones que recibe como parametro el contexto PlantillasService
  funciones = new Funciones(this);
  // Logger de Nest
  private readonly logger = new Logger(PlantillasService.name);

  constructor(
    @InjectModel('Dashboard') private dashboardModel: Model<DashboardType>,
    @InjectModel('Documento') private documentoModel: Model<DocumentoType>,
    @InjectModel('Script') private scriptModel: Model<ScriptType>,
    @InjectModel('Template') private templateModel: Model<TemplateType>,
    @InjectModel('Widget') private widgetModel: Model<WidgetType>,
  ) {}



  /**
   * Esta funcion inserta un documento Dashboard en la coleccion Dashboards
   *
   * @param insertarDashboard
   * @returns
   */
  async insertarDashboard(
    insertarDashboard: CrearDashboardDTO,
  ): Promise<Dashboard> {
    const dashboardInsertado = new this.dashboardModel(insertarDashboard);
    return dashboardInsertado.save();
  }

  /**
   * Esta funcion inserta un documento Documento en la coleccion Documentos
   *
   * @param insertarDocumento
   * @returns
   */
  async insertarDocumento(
    insertarDocumento: CrearDocumentDTO,
  ): Promise<Documento> {
    const documentoInsertado = new this.documentoModel(insertarDocumento);
    return documentoInsertado.save();
  }

  /**
   * Esta funcion inserta un documento Script en la coleccion Scripts
   *
   * @param insertarScript
   * @returns
   */
  async insertarScript(insertarScript: CrearScriptDTO): Promise<Script> {
    const scriptInsertado = new this.scriptModel(insertarScript);
    return scriptInsertado.save();
  }

  /**
   * Esta funcion inserta un documento Template en la coleccion Templates
   *
   * @param insertarTemplate
   * @returns
   */
  async insertarTemplate(
    insertarTemplate: CrearTemplateDTO,
  ): Promise<Template> {
    const templateInsertado = new this.templateModel(insertarTemplate);
    return templateInsertado.save();
  }

  /**
   * Esta funcion inserta un documento Widget en la coleccion Widgets
   *
   * @param insertarWidget
   * @returns
   */
  async insertarWidget(insertarWidget: CrearWidgetDTO): Promise<WidgetType> {
    const widgetInsertado = new this.widgetModel(insertarWidget);
    return widgetInsertado.save();
  }

  
  
  /**
   * Esta funcion busca un objeto template por el atributo code
   *
   * @param parametro
   */
  async obtenerHTML(parametro: string) {
    //Localiza el dashboard en la DB y se extrae el campo 'template'
    const { template, widgets } = await this.dashboardModel.findOne({
      id_dashboard: parametro,
    });

    //Se localiza el template en la DB y se devuelve el HTML decodificado
    const HTMLdecoded = await this.obtenerTemplateContent(template);

    //this.logger.log(HTMLdecoded);

    //Se encuentran las etiquetas contenidas por la template
    const etiquetas = this.funciones.buscadorEtiquetas(HTMLdecoded);

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

    for (let index = 0; index < etiquetas.length; index++) {
      //Se recoge el id del frame
      const id = etiquetas[index].split('_')[1];

      //Se seleccionan los widgets cuyo frame coincide con el id del frame del dashboard
      arrayWidgets = widgets.filter((widget) => widget.frame == id);

      const htmlConScript = await this.funciones.constructorDashboard(
        arrayWidgets,
      );

      const html = htmlConScript[0];
      javaScriptSpecific += htmlConScript[1];
      //Solo es valido el array obtenido el el último loop, ya que el array estará completo con todos los nombres de widgets.
      namesScriptGeneric = htmlConScript[2];

      //Se introducen en una coleccion clave/value siendo la clave el frame:x y el valor el html a introducir en ese frame
      map.set(etiquetas[index], html);
    }

    javaScriptGeneric = await this.funciones.construirScriptGeneric(
      namesScriptGeneric,
    );

    //construccion del JSON
    const json = this.funciones.crearJSON(etiquetas, map);

    //Compilacion de la HTMLdecoded
    const dashboardCompilado = Handlebars.compile(HTMLdecoded);

    const html =
      dashboardCompilado(json) +
      '\n<script>' +
      javaScriptSpecific +
      '</script>\n' +
      javaScriptGeneric;

    //El return es para visualizar el resultado por postman. Devolvera todo el html + javascript completo
    return html;
  }

  
  /**
   * 
   * @param scriptName 
   * @returns 
   */
  async obtenerScript(scriptName: string): Promise<string> {
    const { content } = await this.scriptModel.findOne({ name: scriptName });
    const scriptDecoded = Buffer.from(content, 'base64').toString('utf-8');

    return scriptDecoded;
  }


  /**
   * 
   * @param typeTemplate 
   * @returns 
   */
  async obtenerWidget(typeTemplate: string): Promise<Widget> {
    const widget = await this.widgetModel.findOne({ type: typeTemplate });

    return widget;
  }


  /**
   * 
   * @param codeTemplate 
   * @returns 
   */
  async obtenerTemplateContent(codeTemplate: string): Promise<string> {
    const { content } = await this.templateModel.findOne({
      code: codeTemplate,
    });
    //Se decodifica a utf-8
    const HTMLdecoded = Buffer.from(content, 'base64').toString('utf-8');
    return HTMLdecoded;
  }



  /**
   * 
   * @param codeDoc 
   * @returns 
   */
  async obtenerDocumentoContent(codeDoc: number): Promise<string> {
    const { content } = await this.documentoModel.findOne({ code: codeDoc });

    //Se decodifica a utf-8
    const HTMLdecoded = Buffer.from(content, 'base64').toString('utf-8');

    return HTMLdecoded;
  }

}

import { Injectable } from '@nestjs/common';


import { PlantillaType } from "./schemas/plantilla.schema"

import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { Buffer } from "buffer";

import { Funciones} from "../common/funciones/funciones"

import {
  Dashboard, DashboardType, 
  Documento, DocumentoType, 
  Script, ScriptType, 
  Template, TemplateType, 
  Widget, WidgetType
} from './schemas';

import { CrearDashboardDTO, CrearDocumentDTO, CrearScriptDTO, CrearTemplateDTO, CrearWidgetDTO } from './dto';



@Injectable()
export class PlantillasService {

  constructor(
    @InjectModel('Plantilla') private plantillaModel: Model<PlantillaType>,
    @InjectModel('Dashboard') private dashboardModel: Model<DashboardType>,
    @InjectModel('Documento') private documentoModel: Model<DocumentoType>,
    @InjectModel('Script') private scriptModel: Model<ScriptType>,
    @InjectModel('Template') private templateModel: Model<TemplateType>,
    @InjectModel('Widget') private widgetModel: Model<WidgetType>,
  ) { }

  //Se instancia un objeto de la clase Funciones que recibe como parametro el contexto PlantillasService
  funciones = new Funciones(this)


  /**
   * Esta funcion inserta un documento Dashboard en la coleccion Dashboards
   * 
   * @param insertarDashboard 
   * @returns 
   */
  async insertarDashboard(insertarDashboard: CrearDashboardDTO): Promise<Dashboard> {
    const dashboardInsertado = new this.dashboardModel(insertarDashboard);
    return dashboardInsertado.save();
  }


  /**
   * Esta funcion inserta un documento Documento en la coleccion Documentos
   * 
   * @param insertarDocumento 
   * @returns 
   */
  async insertarDocumento(insertarDocumento: CrearDocumentDTO): Promise<Documento> {
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
  async insertarTemplate(insertarTemplate: CrearTemplateDTO): Promise<Template> {
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

  async obtenerHTML(parametro :string)  {

    //Localiza el dashboard en la DB y se extrae el campo 'template'
    const {template, widgets} = await this.dashboardModel.findOne({ "_id" : parametro});

    //Se localiza el template en la DB y se devuelve el HTML decodificado
    const HTMLdecoded = await this.obtenerTemplateContent(template);

    //Se encuentran las etiquetas contenidas por la template
    const etiquetas = this.funciones.buscadorEtiquetas(HTMLdecoded);

    const map = new Map();

    let arrayWidgets;

    for (let index = 0; index < etiquetas.length; index++) {

      //Se recoge el id del frame
      let id = etiquetas[index].split(":")[1];
      
      //Se seleccionan los widgets cuyo frame coincide con el id del frame del dashboard
      arrayWidgets = widgets.filter(widget => widget.frame == id)

      
      let algo = await this.funciones.constructorDashboard(arrayWidgets)

      console.log("array ", index)
      console.log(algo)
      
      //Se introducen en una coleccion clave/value siendo la clave el frame:x y el valor un array de widgets
      map.set(etiquetas[index], arrayWidgets);

    }

    //El return es para visualizar el resultado por postman
    return map.get("frame:2");
  }

  async obtenerScript(parametro :string) : Promise<Record<string, any>[]> {

    const { widgets} = await this.dashboardModel.findOne({ "template" : parametro});
    //let HTMLdecoded = Buffer.from(widgets., "base64").toString("utf-8");

    return widgets;
  }

  async obtenerWidget(typeTemplate : string) : Promise<Widget> {

    const widget = await this.widgetModel.findOne({ "type" : typeTemplate })

    return widget;

  }

  async obtenerTemplateContent( codeTemplate : string ) : Promise<string> {

    const { content } = await this.templateModel.findOne({ "code" : codeTemplate })

    //Se decodifica a utf-8
    const HTMLdecoded = Buffer.from(content, "base64").toString("utf-8");

    return HTMLdecoded;

  }

  async obtenerDocumentoContent( codeDoc : number) : Promise<string> {

    const { content } = await this.documentoModel.findOne({ "code" : codeDoc })

    //Se decodifica a utf-8
    const HTMLdecoded = Buffer.from(content, "base64").toString("utf-8");

    return HTMLdecoded;
  }



  async obtenerPlantilla(parametro: string) {

    console.log(parametro)

    let object = (await this.plantillaModel.findById({ '_id': parametro }));
    console.log(object)

    if (!object) {
      object = await this.plantillaModel.findOne({ "_name": parametro });
      console.log('aqui');
      let HTMLdecoded = Buffer.from(object._html, "base64").toString("utf-8");
      return HTMLdecoded;
    }
    let HTMLdecoded = Buffer.from(object._html, "base64").toString("utf-8");
    console.log(HTMLdecoded);
    return HTMLdecoded;

  }

  /**
   * Metodo para hacer la llamada a la coleccion Gatos que contiene todos los datos sobre los gatos
   * @returns Devuelve toda la coleccion Gatos
   */
  async opcions() {
    const data = [
      {
        "name": "Purrsloud",
        "species": "Cat",
        "birthYear": 2016,
        "photo": "https://learnwebcode.github.io/json-example/images/cat-2.jpg"
      },
      {
        "name": "Barksalot",
        "species": "Dog",
        "birthYear": 2008,
        "photo": "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
      },
      {
        "name": "Miguel",
        "species": "Cat",
        "favFoods": ["tuna", "catnip", "celery"],
        "birthYear": 2012,
        "photo": "https://learnwebcode.github.io/json-example/images/cat-1.jpg"
      },
      {
        "name": "Ramon",
        "species": "Dog",
        "favFoods": ["meat", "bones"],
        "birthYear": 2001,
        "photo": "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
      }
    ];

    const datos = [
      {
        "id": 1,
        "nombre": "Situación",
        "opciones": [
          {
            "id": 13,
            "nombre": "Situación y perfil poblacional"
          }
        ]
      },
      {
        "id": 5,
        "nombre": "Uso racional de recursos",
        "opciones": [
          {
            "id": 14,
            "nombre": "Atención especializada"
          },
          {
            "id": 29,
            "nombre": "Procedimiento de dudoso valor"
          },
          {
            "id": 30,
            "nombre": "Hospitalizaciones"
          },
          {
            "id": 31,
            "nombre": "Cirugía ortopédica"
          }
        ]
      },
      {
        "id": 6,
        "nombre": "Recomendaciones",
        "opciones": [
          {
            "id": 63,
            "nombre": "Hacer/No hacer"
          },
          {
            "id": 64,
            "nombre": "Consulta global"
          }
        ]
      }
    ]

    /**
     * Si no hay datos devuelve un empty
     */
    const dataempty = {};

    return data;
  }

  /**
   * Metodo para seleccionar un gato en concreto de la coleccion Gatos
   * @returns objeto Gato
   */
  async buscarMascota(paramentro: string) {

    const data = [
      {
        "name": "Purrsloud",
        "species": "Cat",
        "birthYear": 2016,
        "photo": "https://learnwebcode.github.io/json-example/images/cat-2.jpg"
      },
      {
        "name": "Barksalot",
        "species": "Dog",
        "birthYear": 2008,
        "photo": "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
      },
      {
        "name": "Miguel",
        "species": "Cat",
        "favFoods": ["tuna", "catnip", "celery"],
        "birthYear": 2012,
        "photo": "https://learnwebcode.github.io/json-example/images/cat-1.jpg"
      },
      {
        "name": "Ramon",
        "species": "Dog",
        "favFoods": ["meat", "bones"],
        "birthYear": 2001,
        "photo": "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
      }
    ];

    const gato = data.find(gato => gato.name === paramentro);

    return gato;
  }


  /*plantilla: Plantilla[] = 
      [
          {
              id: 1,
              name: "plantilla1",
              html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAxPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5TZWxlY2Npb25hIGVsIHBvc3RyZTwvaDI+CiAgICA8bGFiZWw+CiAgICAgICAgPGlucHV0IHR5cGU9ImNoZWNrYm94IiBpZCA9ICJjaGVjazEiIHZhbHVlID0gInByaW1lcl9jaGVjayI+TmF0aWxsYXMKICAgIDwvbGFiZWw+PGJyPgogICAgPGxhYmVsPgogICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImNoZWNrMiIgdmFsdWU9InNlZ3VuZG9fY2hlY2siPkZsYW4KICAgIDwvbGFiZWw+PGJyPgogICAgPGxhYmVsPgogICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImNoZWNrMyIgdmFsdWU9InRlcmNlcl9jaGVjayI+WW9ndXJ0CiAgICA8L2xhYmVsPjxicj4KPC9ib2R5Pgo8L2h0bWw+Cg=="
          },
          {
              id: 2,
              name: "plantilla2",
              html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAyPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5SZWxsZW5lIGNvbiBzdXMgZGF0b3M8L2gyPgogICAgPHA+Tm9tYnJlOiA8bGFiZWw+PGlucHV0IHR5cGU9InRleHQiIGlkPSJub21icmUiIHZhbHVlPSIiPjwvbGFiZWw+PC9wPgogICAgPHA+QXBlbGxpZG86IDxsYWJlbD48aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImFwZWxsaWRvIiB2YWx1ZSA9IiI+PC9sYWJlbD48L3A+CiAgICA8cD5TZXhvPC9wPgogICAgPGlucHV0IHR5cGU9InJhZGlvIiBpZD0iaG9tYnJlIiBuYW1lPSJzZXhvIiB2YWx1ZT0iSG9tYnJlIj4KICAgIDxsYWJlbCBmb3I9ImhvbWJyZSI+SG9tYnJlPC9sYWJlbD48YnI+CiAgICA8aW5wdXQgdHlwZT0icmFkaW8iIGlkPSJtdWplciIgbmFtZT0ic2V4byIgdmFsdWU9Ik11amVyIj4KICAgIDxsYWJlbCBmb3I9Im11amVyIj5NdWplcjwvbGFiZWw+PGJyPgogICAgPGlucHV0IHR5cGU9InJhZGlvIiBpZD0ib3RybyIgbmFtZT0ic2V4byIgdmFsdWU9Ik90cm8iPgogICAgPGxhYmVsIGZvcj0ib3RybyI+T3RybzwvbGFiZWw+PGJyPgo8L2JvZHk+CjwvaHRtbD4="
          }
      ];

  obtenerPlantilla(name) : string {
      const HTMLencoded = this.plantilla.find(plantilla => plantilla.name.match(name)).html;
      const HTMLdecoded = atob(HTMLencoded);
      return HTMLdecoded;
  }

  obtenerPlantillas() {
      return this.plantilla;
  }*/


}

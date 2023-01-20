import { Injectable, Logger, ArgumentsHost } from '@nestjs/common';
import { RequestService } from './request.service';




@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly requestService : RequestService) {}


  /**
   * Funcion que recupera los datos de la DB de Datos.
   */
  getData(param : string): {} {

    const plantillas = [
      {
        "name": "listaPerros",
        "content": `{"listaPerros" : "<div id = 'listaPerros' method='get' action='/data/listaPerros'>{{{tituloPerro}}}</div>"}`
      },
      {
        "name": "listaGatos",
        "content": `{"listaGatos": "<div id = 'listaGatos' method='get' action='/data/listaGatos'>{{{tituloGato}}}</div>"}`
      },
      {
        "name": "tituloGato",
        "content": `{"tituloGato": "<a href= '/templates/Miguel'>Gatos</a>"}`
      },
      {
        "name": "tituloPerro",
        "content": `{"tituloPerro": "<a href= '/templates/Barksalot'>Perros</a>"}`
      },
    ];

    const plantilla = plantillas.find(plantilla => plantilla.name===param)
    const contenido = plantilla.content;
    console.log(contenido)
    return JSON.parse(contenido);

    /*if(param === 'listaPerros'){
      return {"listaPerros" : `<div id = "listaPerros" method="get" action="/data/listaPerros">
                          {{{tituloPerro}}}
                        </div>`}
    }
    if(param==='listaGatos') {
      return {"listaGatos": `<div id = "listaGatos" method="get" action="/data/listaGatos">
                                {{{tituloGato}}}
                            </div>`}
    }
    if(param === 'tituloGato') {
        return {"tituloGato": `<a href= "/templates/Miguel">Gatos</a>`}
    }
    if(param === 'tituloPerro') {
        return {"tituloPerro": `<a href= "/templates/Barksalot">Perros</a>`}
    }*/

    /*if(param == "mensaje"){
      return {mensaje: "Opciones"};
    }
    if(param == "otroMensaje") {
      return {otroMensaje: "Lago"}
    }
    if(param == "Referencia"){
      return {Referencia : '<a class="btn btn-primary btn-lg" href="/templates" role="button">{{{otroMensaje}}}</a>'}
    }*/
  }

  /**
   * Funcion que recupera los datos de la DB de Plantillas
   */
  getPlantilla() : string {

  return `<div class="card card-body p-5 mt-4">
              <h1 class="display-4">Gaticos</h1>
                <p class="lead">En esta web se visualizaran los gatos que usted elija.</p>
              <hr class="my-4" />
              </br>
              <div id="listas">
                  {{{listaPerros}}}
                  {{{listaGatos}}}
              </div>
          </div>`;
    /*return `<div class="card card-body p-5 mt-4">
    <h1 class="display-4">Gaticos</h1>
    <p class="lead">En esta web se visualizaran los gatos que usted elija.</p>
    <hr class="my-4" />
    </br>
    <div id="basic-template1">
      <a
        class="btn btn-primary btn-lg"
        href="/templates"
        role="button"
      >{{{mensaje}}}</a>
    </div>
    <div id="{{{otroMensaje}}}">
      {{{Referencia}}}
    </div>
    
  </div>`;*/
  }

}

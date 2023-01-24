import { Injectable, Logger, ArgumentsHost } from '@nestjs/common';

import * as Handlebars from "handlebars";


@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);


    /**
   * Funcion que devuelve la plantilla iniciadora
   */
    getPlantilla() : string {

      return `<div class="card card-body p-5 mt-4">
                  <h1 class="display-4">Mascotas</h1>
                    <p class="lead">En esta web se visualizaran las mascotas que usted elija.</p>
                  <hr class="my-4" />
                  </br>
                  <div id="listas">
                      {{{lista}}}
                      {{{menu}}}
                  </div>
              </div>`;
      }

  /**
   * Funcion que recupera los datos de la DB de Datos.
   */
  getData(param : string): {} {

    const plantillas = [
      {
        "name" : "lista",
        "content" : `{{#each data}}\
        <div id='{{nombre}}' method='get' action='/data/{{nombre}}'>\\n\
        {{inner}}\\n\
        </div>\\n\
      {{/each}}\
      `,
        "data" : [
          {
            "nombre": "listaPerros",
            "inner" : "{{{tituloPerro}}}"
          },
          {
            "nombre": "listaGatos",
            "inner" : "{{{tituloGato}}}"
          }
        ]
      },
      {
        "name": "tituloGato",
        "content": `{{#each data}}\
        <h2>{{nombre}}</h2>\\n\
        <ul id='{{nombre}}'>{{inner}}</ul>\
        {{/each}}\
        `,
        "data" : [{"nombre" : "Gatos", "inner" : "{{{gatosVarios}}}"}]
      },
      {
        "name": "tituloPerro",
        "content": `{{#each data}}\
        <h2>{{nombre}}</h2>\\n\
        <ul id='{{nombre}}'>\\n\
        {{inner}}\\n\
        </ul>\
        {{/each}}\
        `,
        "data" : [{"nombre" : "Perros", "inner" : "{{{perrosVarios}}}"}]
      },
      {
        "name" : "menu",
        "content" : `<h2>Menu</h2>\\n\
        <ul id='side-nav' class='main-menu navbar-collapse collapse'>\\n\
        {{#each data}}\
          <li id={{id}} class='has-sub'><a href=''><i class='fas fa-street-view'></i><span class='title'>{{nombre}}</span></a>\\n\
          {{#if opciones}}\
          <ul class='nav collapse'>\\n\
            {{#each opciones}}\
            <li id={{id}} class=''><a href='{{enlace}}' target='_self'><span class='title'>{{nombre}}</span></a></li>\\n\
            {{/each}}\
          </ul>\\n\
          {{/if}}\
          </li>\\n\
        {{/each}}\
        </ul>\\n\
        `,
        "data" : [
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
      },
      {
        "name" :"perrosVarios",
        "content": "<p>Un buen perro</p>"
      }
    ];

    let html;

    /**
     * try/catch  para capturar el error en caso de que no exista la plantilla
     */
    try {

      const plantilla = plantillas.find(plantilla => plantilla.name===param)
      const {name, content, data} = plantilla;

      html = content;

    //Si el objeto tiene datos se deben inyectar en la plantilla del content
    if(data) {
      const compiledTemplate = Handlebars.compile(content);
      console.log("Datos")
      console.log(data)

      //Obtención del HTML
      html = compiledTemplate({data})

    }

    console.log(html)

    //De esta forma se da forma al contenido del JSON que será generado por la funcion crearJSON() 
    const datos = '"' +name +'"' + ":" + '"' + html +'"';

    return datos;

    }catch(Error) {
      console.log("No hay datos.")

      //Si no existe la plantilla el contenido del JSON estara vacio
      return '"":""'
    }

  }


}

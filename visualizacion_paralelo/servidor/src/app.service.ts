import { Injectable, Logger, ArgumentsHost } from '@nestjs/common';

import * as Handlebars from "handlebars";


@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);


    /**
   * Funcion que devuelve la plantilla iniciadora
   */
    getPlantilla(param :string) : string {

      const plantillas = [
        {
          "name" : "Inicio",
          "content": `{{{containerMenu}}}
          {{{containerInicio}}}`
        },
        {
          "name" : "Barksalot",
          "content": `{{{containerMenu}}}
          {{{containerBarksalot}}}`
        },
        {
          "name" : "Miguel",
          "content": `{{{containerMenu}}}
          {{{containerMiguel}}}`
        },
        {
          "name" : "Ramon",
          "content": `{{{containerMenu}}}
          {{{containerRamon}}}`
        },
        {
          "name" : "Purrsloud",
          "content": `{{{containerMenu}}}
          {{{containerPurrsloud}}}`
        },
      ]


      /**
       * Si el parametro no existe es porque se está haciendo una llamada desde el root
       */
      let html;
      if(param) {
        html = plantillas.find(plantilla => plantilla.name===param).content
      }else {
        html = plantillas.find(plantilla => plantilla.name==="Inicio").content
        console.log(html)
      }


      return html;

  }

  /**
   * Funcion que recupera los datos de la DB de Datos.
   */
  getData(etiqueta : string): {} {

    const plantillas = [
      {
        "name" : "containerMenu",
        "content" : `<div class='split left'>\\n\
        <div class='centered'>\\n\
        <h1 class='display-4'>Mascotas</h1>\\n\
                      <p class='lead'>En esta web se visualizaran las mascotas que usted elija.</p>\\n\
                    <hr class='my-4' />\\n\
                    </br>\\n\
                    <div id='listas'>\\n\
                        {{{lista}}}\
                        {{{menu}}}\
                    </div>\\n\
                </div>\\n\
        </div>\\n\
      </div>`
      },
      {
        "name" : "containerVisual",
        "content" : `<div class='split right'>\\n\
        <div class='centered1'>\\n\
          {{{inner}}}\
        </div>\\n\
      </div>`,
      "eleccionPlantilla" : true,
        "subcontent" : [
          {
            "name": "inicio",
            "inner": "{{{inicio}}}"
          },
          {
            "name": ["Barksalot", "Miguel", "Ramon", "Purrsloud"],
            "inner" : "{{{contenidoVisual}}}"
          },
        ]
      },
      {
        "name" : "containerInicio",
        "content" : `<div class='split right'>\\n\
        <div class='centered1'>\\n\
          {{{inicio}}}\
        </div>\\n\
      </div>`
      },
      {
        "name" : "containerBarksalot",
        "content" : `<div class='split right'>\\n\
        <div class='centered1'>\\n\
          {{{Barksalot}}}\
        </div>\\n\
      </div>`
      },
      {
        "name" : "containerMiguel",
        "content" : `<div class='split right'>\\n\
        <div class='centered1'>\\n\
          {{{Miguel}}}\
        </div>\\n\
      </div>`
      },
      {
        "name" : "containerRamon",
        "content" : `<div class='split right'>\\n\
        <div class='centered1'>\\n\
          {{{Ramon}}}\
        </div>\\n\
      </div>`
      },
      {
        "name" : "containerPurrsloud",
        "content" : `<div class='split right'>\\n\
        <div class='centered1'>\\n\
          {{{Purrsloud}}}\
        </div>\\n\
      </div>`
      },
      {
        "name" : "lista",
        "content" : `{{#each subcontent}}\
        <div id='{{nombre}}' method='get' action='/data/{{nombre}}'>\\n\
        {{inner}}\\n\
        </div>\\n\
      {{/each}}\
      `,
        "subcontent" : [
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
        "content": `{{#each subcontent}}\
        <h2>{{nombre}}</h2>\\n\
        <ul id='{{nombre}}'>\\n\
        {{inner}}\\n\
        </ul>\
        {{/each}}\
        `,
        "subcontent" : [
          {
            "nombre" : "Gatos",
            "inner" : "{{{gatosVarios}}}"
          }
        ]
      },
      {
        "name": "tituloPerro",
        "content": `{{#each subcontent}}\
        <h2>{{nombre}}</h2>\\n\
        <ul id='{{nombre}}'>\\n\
        {{inner}}\\n\
        </ul>\
        {{/each}}\
        `,
        "subcontent" : [{"nombre" : "Perros", "inner" : "{{{perrosVarios}}}"}]
      },
      {
        "name" : "menu",
        "content" : `<h2>Menu</h2>\\n\
        <ul id='side-nav' class='main-menu navbar-collapse collapse'>\\n\
        {{#each data}}\
          <li id='{{id}}' class='has-sub'><a href=''><i class='fas fa-street-view'></i><span class='title'>{{nombre}}</span></a>\\n\
          {{#if opciones}}\
          <ul class='nav collapse'>\\n\
            {{#each opciones}}\
            <li id='{{id}}' class=''><a href='{{enlace}}' target='_self'><span class='title'>{{nombre}}</span></a></li>\\n\
            {{/each}}\
          </ul>\\n\
          {{/if}}\
          </li>\\n\
        {{/each}}\
        </ul>\\n\
        `,
        "data" : "plantillaDatos.name===menu"
      },
      {
        "name" :"perrosVarios",
        "content": `{{#each data}}\
        <li id='{{name}}'><a class='btn btn-primary btn-lg' role='button' href='/templates/{{name}}'>{{name}}</a></li>\\n\
        {{/each}}`,
        "data": [
          {
            "name" : "Barksalot",
            "species" : "Dog",
            "birthYear" : 2008,
            "photo" : "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
          },
          {
            "name" : "Ramon",
            "species" : "Dog",
            "favFoods" : ["meat", "bones"],
            "birthYear" : 2001,
            "photo" : "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
          }
        ]
      },
      {
        "name" :"gatosVarios",
        "content": `{{#each data}}\
        <li id='{{name}}'><a class='btn btn-primary btn-lg' role='button' href='/templates/{{name}}'>{{name}}</a></li>\\n\
        {{/each}}`,
        "data": [
          {
            "name" : "Purrsloud",
            "species" : "Cat",
            "birthYear" : 2016,
            "photo" : "https://learnwebcode.github.io/json-example/images/cat-2.jpg"
          },
          {
            "name" : "Miguel",
            "species" : "Cat",
            "favFoods" : ["tuna", "catnip", "celery"],
            "birthYear" : 2012,
            "photo" : "https://learnwebcode.github.io/json-example/images/cat-1.jpg"
          },
        ]
      },
      {
        "name" : "inicio",
        "content" : `<div class = 'Inicio'>\\n\
        <h2>Muestra info sobre la mascota</h2>\\n\
        <p>Clica en los nombres del menu para mostrar informacion.</p>\\n\
        <div>`
      },
      {
        "name" : "contenidoVisual",
        "content" : `{{#each data}}\
        <div class='{{name}}'>\\n\
            <div class='photo-column'>\\n\
              <img src='{{photo}}'>\\n\
            </div>\\n\
            <div class='info-column'>\\n\
              <h2>{{name}} <span class='species'>({{species}})</span></h2>\\n\
              {{#if favFoods}}\
              <h4 class='headline-bar'>Favorite Foods</h4>\\n\
              <ul class='favorite-foods'>\\n\
                {{#each favFoods}}\
                  <li>{{{this}}}</li>\\n\
                {{/each}}\
              </ul>\\n\
              {{/if}}\
            </div>\\n\
          </div>\\n\
        {{/each}}`,
        "data": 
      },
      {
        "name" : "Barksalot",
        "content" : `{{#each data}}\
        <div class='{{name}}'>\\n\
            <div class='photo-column'>\\n\
              <img src='{{photo}}'>\\n\
            </div>\\n\
            <div class='info-column'>\\n\
              <h2>{{name}} <span class='species'>({{species}})</span></h2>\\n\
              {{#if favFoods}}\
              <h4 class='headline-bar'>Favorite Foods</h4>\\n\
              <ul class='favorite-foods'>\\n\
                {{#each favFoods}}\
                  <li>{{{this}}}</li>\\n\
                {{/each}}\
              </ul>\\n\
              {{/if}}\
            </div>\\n\
          </div>\\n\
        {{/each}}`,
        "data" : [
          {
            "name" : "Barksalot",
            "species" : "Dog",
            "birthYear" : 2008,
            "photo" : "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
          }
        ]
      },
      {
        "name" : "Miguel",
        "content" : `{{#each data}}\
        <div class='{{name}}'>\\n\
            <div class='photo-column'>\\n\
              <img src='{{photo}}'>\\n\
            </div>\\n\
            <div class='info-column'>\\n\
              <h2>{{name}} <span class='species'>({{species}})</span></h2>\\n\
              {{#if favFoods}}\
              <h4 class='headline-bar'>Favorite Foods</h4>\\n\
              <ul class='favorite-foods'>\\n\
                {{#each favFoods}}\
                  <li>{{{this}}}</li>\\n\
                {{/each}}\
              </ul>\\n\
              {{/if}}\
            </div>\\n\
          </div>\\n\
        {{/each}}`,
        "data" : [
          {
            "name" : "Miguel",
            "species" : "Cat",
            "favFoods" : ["tuna", "catnip", "celery"],
            "birthYear" : 2012,
            "photo" : "https://learnwebcode.github.io/json-example/images/cat-1.jpg"
          }
        ]
      },
      {
        "name" : "Purrsloud",
        "content" : `{{#each data}}\
        <div class='{{name}}'>\\n\
            <div class='photo-column'>\\n\
              <img src='{{photo}}'>\\n\
            </div>\\n\
            <div class='info-column'>\\n\
              <h2>{{name}} <span class='species'>({{species}})</span></h2>\\n\
              {{#if favFoods}}\
              <h4 class='headline-bar'>Favorite Foods</h4>\\n\
              <ul class='favorite-foods'>\\n\
                {{#each favFoods}}\
                  <li>{{{this}}}</li>\\n\
                {{/each}}\
              </ul>\\n\
              {{/if}}\
            </div>\\n\
          </div>\\n\
        {{/each}}`,
        "data" : [
          {
            "name" : "Purrsloud",
            "species" : "Cat",
            "birthYear" : 2016,
            "photo" : "https://learnwebcode.github.io/json-example/images/cat-2.jpg"
          }
        ]
      },
      {
        "name" : "Ramon",
        "content" : `{{#each data}}\
        <div class='{{name}}'>\\n\
            <div class='photo-column'>\\n\
              <img src='{{photo}}'>\\n\
            </div>\\n\
            <div class='info-column'>\\n\
              <h2>{{name}} <span class='species'>({{species}})</span></h2>\\n\
              {{#if favFoods}}\
              <h4 class='headline-bar'>Favorite Foods</h4>\\n\
              <ul class='favorite-foods'>\\n\
                {{#each favFoods}}\
                  <li>{{{this}}}</li>\\n\
                {{/each}}\
              </ul>\\n\
              {{/if}}\
            </div>\\n\
          </div>\\n\
        {{/each}}`,
        "data" : [
          {
            "name" : "Ramon",
            "species" : "Dog",
            "favFoods" : ["meat", "bones"],
            "birthYear" : 2001,
            "photo" : "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
          }
        ]
      }
    ];

    const dataMenu = [
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

    const dataPets = [
        {
          "name" : "Purrsloud",
          "species" : "Cat",
          "birthYear" : 2016,
          "photo" : "https://learnwebcode.github.io/json-example/images/cat-2.jpg"
        },
        {
          "name" : "Barksalot",
          "species" : "Dog",
          "birthYear" : 2008,
          "photo" : "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
        },
        {
          "name" : "Miguel",
          "species" : "Cat",
          "favFoods" : ["tuna", "catnip", "celery"],
          "birthYear" : 2012,
          "photo" : "https://learnwebcode.github.io/json-example/images/cat-1.jpg"
        },
        {
          "name" : "Ramon",
          "species" : "Dog",
          "favFoods" : ["meat", "bones"],
          "birthYear" : 2001,
          "photo" : "https://learnwebcode.github.io/json-example/images/dog-1.jpg"
        }
      ]
      

    let html;

    /**
     * try/catch  para capturar el error en caso de que no exista la plantilla
     */
    try {

      const plantilla = plantillas.find(plantilla => plantilla.name===etiqueta)
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

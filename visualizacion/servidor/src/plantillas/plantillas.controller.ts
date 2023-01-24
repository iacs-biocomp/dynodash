import {Controller, Get, Render, HttpException, HttpStatus, Param, UseFilters, Request, ForbiddenException, Post, Res } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global.filter';

import { Response } from 'express';
import * as Handlebars from "handlebars";
import { lista } from "../../views/helpers/helpers";


import { PlantillasService } from "./plantillas.service";

@Controller('templates')
export class PlantillasController {

    constructor(private plantillaServicio: PlantillasService) { }

    /*Método Get para recuperar la información de la base de datos*/
    /*@Get(':parametro')
    @UseFilters(new HttpExceptionFilter())
    //@Render('cuerpo.hbs')
    async obtenerPlantilla(@Param('parametro') parametro : string, @Res() res: Response) {
        try {

            return res.render("main",{
                layout: 'index',
                pets : await this.plantillaServicio.obtenerPlantilla(parametro)
            },
              );
            

        } catch (err) {
            if(err instanceof ForbiddenException) {
                throw new HttpException('fallo rol', HttpStatus.FORBIDDEN);
            }else {
                throw new HttpException('fallo ruta', HttpStatus.BAD_REQUEST);
            }
        }

    }*/

    @Get()
    obetenerDatos() {
        return this.plantillaServicio.opcions();
    }

    /*
     * Renderiza el index.hbs con la info contenida en el main.hbs y tambien pasa los datos (pets) al partial opciones que a su vez
     * es introducido en el index.hbs durante el renderizado
     * 
     * @param res 
     * @returns 
     */
    @Get()
    async root(@Res() res: Response) {


        Handlebars.registerHelper('lista', function(items, options) {
        
            
            //Comprobar que se reciben datos para generar el HTML
             
            if(Object.keys(items).length !== 0){
                const h2 = "<h2>Selecciona una opción</h2>\n"
                const itemsAsHtml = items.map(pet => '<a class="btn btn-primary btn-lg" role="button" href="/templates/'+ options.fn(pet.name) +'" '+ 'role="button">' + options.fn(pet.name) + "</a>" +"<br>");
                return h2 + itemsAsHtml.join("\n"); 
            }
            return "<p>No hay opciones disponibles.</p>"
        });
   

        //Recibo la plantilla de la DB Plantillas
        const template = `{{#if pets}}{{#lista pets}}{{this}}{{/lista}}{{/if}}`;

        const compiledTemplate = Handlebars.compile(template, {knownHelpers: {'lista':true}, knownHelpersOnly:true});
        console.log(compiledTemplate)

        //Recibo los datos de la DB Datos
        const pets = await this.plantillaServicio.opcions();
        console.log(pets);

        //Creacion del HTML
        const html = compiledTemplate({pets});
        console.log(html);

        return res.render("main",{
            layout: 'index',
            titulo: "Inicio",
            opciones: html
        },
          );

    }

    /*
     * El layout gato.hbs recibe los datos del gato seleccionado creado asi el HTML.
     * Entonces se renderiza el index.hbs, porque es el default layout indicado en el main.ts, con el layout gato.hbs.
     * 
     * @param gatoName 
     * @param res 
     * @returns 
     */
    @Get(':parametro')
    async buscarGato(@Param('parametro') gatoName : string, @Res() res : Response) {
        try {

            const template = `{{#with gato}}
            <div class="{{name}}">
                <div class="photo-column">
                  <img src="{{photo}}">
                </div>
            
                <div class="info-column">
                  <h2>{{name}} <span class="species">({{species}})</span></h2>
            
                  {{#if favFoods}}
                  <h4 class="headline-bar">Favorite Foods</h4>
                  <ul class="favorite-foods">
                    {{#each favFoods}}
                      <li>{{{this}}}</li>
                    {{/each}}
                  </ul>
                  {{/if}}
            
                </div>
              </div>
            {{/with}}`;

            const compiledTemplate = Handlebars.compile(template);

            const gato = await this.plantillaServicio.buscarGato(gatoName);
            console.log(gato);

            const html = compiledTemplate({gato});

            return res.render("layouts/index",{
                titulo: gato.name,
                body : html
            },
              );

        }catch(err){
            throw new Error("Gato no encontrado.")
        }
    }

}

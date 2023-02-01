import {Controller, Get, Render, HttpException, HttpStatus, Param, UseFilters, Request, ForbiddenException, Post, Res } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global.filter';

import { Response } from 'express';
import * as Handlebars from "handlebars";
import { lista } from "../../views/helpers/helpers";


import { PlantillasService } from "./plantillas.service";
import { AppService } from 'src/app.service';
import { Funciones } from 'src/common/funciones/funciones';

@Controller('templates')
export class PlantillasController {

    constructor(
        private plantillaServicio: PlantillasService,
        private appService : AppService,
        private funciones: Funciones
        ) { }

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
    async buscarMascota(@Param('parametro') mascotaName : string, @Res() res : Response) {
        try {

            let plant = this.appService.getPlantilla(mascotaName);

            let etiquetas = this.funciones.buscadorEtiquetas(plant);

            console.log(etiquetas)

            while(etiquetas.length!==0) {

                const json = this.funciones.crearJSON(etiquetas);
                console.log('Plantilla compilada')
                const compiledTemplate = Handlebars.compile(plant);
                console.log(compiledTemplate)

                plant = compiledTemplate(json)
                console.log(plant)

                etiquetas = this.funciones.buscadorEtiquetas(plant)

            }

            if(etiquetas.length===0) {
                console.log("No hay mas etiquetas")
            }

            return res.render("main",{
                titulo: mascotaName,
                body: plant
              }
            );

        }catch(err){
            throw new Error("Gato no encontrado.")
        }
    }

}

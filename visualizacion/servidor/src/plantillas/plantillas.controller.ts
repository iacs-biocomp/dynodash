import {Controller, Get, Render, HttpException, HttpStatus, Param, UseFilters, Request, ForbiddenException, Post, Res } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global.filter';

import { Response } from 'express';

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

    /*
     * Renderiza el index.hbs con la info contenida en el main.hbs y tambien pasa los datos (pets) al partial opciones que a su vez
     * es introducido en el index.hbs durante el renderizado
     * 
     * @param res 
     * @returns 
     */
    @Get()
    async root(@Res() res: Response) {
        return res.render("main",{
            layout: 'index',
            pets : await this.plantillaServicio.opcions()
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

            return res.render("layouts/gato",{
                gato : await this.plantillaServicio.buscarGato(gatoName)
            },
              );

        }catch(err){
            throw new Error("Gato no encontrado.")
        }
    }

}

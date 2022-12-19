import {Controller, Get, Render, HttpException, HttpStatus, Param, UseFilters, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGard } from 'src/gards/auth.gard';

import { HttpExceptionFilter } from 'src/global.filter';

import { PlantillasService } from "./plantillas.service";

@Controller('templates')
export class PlantillasController {

    constructor(private plantillaServicio: PlantillasService) { }

    /*Método Get para recuperar la información de la base de datos*/
    @Get(':parametro')
    @UseGuards(new AuthGard())
    @UseFilters(new HttpExceptionFilter())
    @Render('index.hbs')
    async obtenerPlantilla(@Param('parametro') parametro) {
        try {
            
            return { message : await this.plantillaServicio.obtenerPlantilla(parametro)};

        } catch (err) {
            if(err instanceof ForbiddenException) {
                throw new HttpException('fallo rol', HttpStatus.FORBIDDEN);
            }else {
                throw new HttpException('fallo ruta', HttpStatus.BAD_REQUEST);
            }
        }

    }

    @Get()
    @Render('index.hbs')
    root() {
        return { message: 'Hola mundo!' };
    }
}

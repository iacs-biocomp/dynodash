import { Body, Controller, Get, Param } from '@nestjs/common';

import { CrearPlantillaDTO } from "./dto/plantillaDTO";
import { Plantilla } from './interfaces/Plantilla';

import { PlantillasService } from "./plantillas.service";

@Controller('templates')
export class PlantillasController {

    constructor(private plantillaServicio: PlantillasService) {}

    /*Método Get para recuperar la información de la base de datos*/
    @Get(':plantillaName')
    obtenerPlantilla(@Param('plantillaName') plantillaName) {
        return this.plantillaServicio.obtenerPlantilla(plantillaName);
    }

    @Get(':id')
    recuperarPlantilla(@Param('id') id: string) {
        return this.plantillaServicio.recuperarPlantilla(id);
    }

}

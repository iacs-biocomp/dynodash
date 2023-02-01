import { Module } from '@nestjs/common';
import { PlantillasController } from "./plantillas.controller";
import { PlantillasService } from "./plantillas.service";

import { MongooseModule } from "@nestjs/mongoose";
import { plantillaSchema } from "./schemas/plantilla.schema";
import { AppService } from 'src/app.service';
import { Funciones } from 'src/common/funciones/funciones';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Template', schema: plantillaSchema}])],
    controllers: [PlantillasController],
    providers: [PlantillasService, AppService, Funciones],
})
export class PlantillasModule {}

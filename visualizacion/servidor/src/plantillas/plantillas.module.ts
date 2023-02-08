import { Module } from '@nestjs/common';
import { PlantillasController } from "./plantillas.controller";
import { PlantillasService } from "./plantillas.service";

import { MongooseModule } from "@nestjs/mongoose";
import { PlantillaSchema } from "./schemas/plantilla.schema";
import { DashboardSchema, DocumentoSchema, ScriptSchema, TemplateSchema, WidgetSchema } from "./schemas"
import { AppService } from 'src/app.service';
import { Funciones } from 'src/common/funciones/funciones';

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Plantilla', schema: PlantillaSchema},
        {name : 'Dashboard', schema: DashboardSchema},
        {name : 'Documento', schema : DocumentoSchema},
        {name : 'Script', schema: ScriptSchema},
        {name: 'Template', schema: TemplateSchema},
        {name: 'Widget', schema: WidgetSchema}
    ])],
    controllers: [PlantillasController],
    providers: [PlantillasService, AppService, Funciones],
})
export class PlantillasModule {}

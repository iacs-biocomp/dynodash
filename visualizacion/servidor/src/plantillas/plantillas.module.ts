import { Module } from '@nestjs/common';
import { PlantillasController } from './plantillas.controller';
import { PlantillasService } from './plantillas.service';

import { MongooseModule } from '@nestjs/mongoose';
import {
  DashboardSchema,
  ScriptSchema,
  TemplateSchema,
  WidgetSchema,
} from './schemas';
import { AppService } from 'src/app.service';
import { Funciones } from 'src/common/functions/functions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dashboard', schema: DashboardSchema },
      { name: 'Script', schema: ScriptSchema },
      { name: 'Template', schema: TemplateSchema },
      { name: 'Widget', schema: WidgetSchema },
    ]),
  ],
  controllers: [PlantillasController],
  providers: [PlantillasService, AppService, Funciones],
})
export class PlantillasModule {}

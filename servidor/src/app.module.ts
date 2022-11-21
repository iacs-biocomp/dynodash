import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantillasController } from './plantillas/plantillas.controller';
import { PlantillasService } from './plantillas/plantillas.service';
import { PlantillasModule } from './plantillas/plantillas.module';

import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [PlantillasModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/test')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

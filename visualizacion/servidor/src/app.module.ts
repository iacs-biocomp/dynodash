import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantillasModule } from './plantillas/plantillas.module';


import { MongooseModule } from "@nestjs/mongoose";
import { Funciones } from './common/funciones/funciones';


@Module({
  imports: [PlantillasModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/atlas_vpm')],
  controllers: [AppController],
  providers: [AppService,Funciones],
})
export class AppModule {}

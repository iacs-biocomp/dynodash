import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

// modules
import { PlantillasModule } from './plantillas/plantillas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatosModule } from './datos/datos.module';

// Controllers
import { AppController } from './app.controller';

// providers
import { AppService } from './app.service';
import { Funciones } from './common/functions/functions';

const db_hostname = '1.44.4.42';
const db_port = '27018';
const db_database = 'dynodash';

@Module({
  imports: [
    PlantillasModule,
    MongooseModule.forRoot(`mongodb://${db_hostname}:${db_port}/${db_database}`),
    DatosModule,
  ],
  controllers: [AppController],
  providers: [AppService, Funciones],
})
export class AppModule {}

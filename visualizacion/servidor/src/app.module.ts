import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantillasModule } from './plantillas/plantillas.module';


import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { RequestService } from './request.service';
import { PlantillasService } from './plantillas/plantillas.service';
import { plantillaSchema } from './plantillas/schemas/plantilla.schema';


@Module({
  imports: [PlantillasModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/test')],
  controllers: [AppController],
  providers: [AppService, RequestService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("*")
  }
}

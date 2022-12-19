import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantillasController } from './plantillas/plantillas.controller';
import { PlantillasService } from './plantillas/plantillas.service';
import { PlantillasModule } from './plantillas/plantillas.module';



import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { RequestService } from './request.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PlantillasModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'), AuthModule, UsersModule],
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

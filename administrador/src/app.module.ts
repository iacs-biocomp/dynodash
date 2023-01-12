import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { ServeStaticModule, serveStaticProviders } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from "@nestjs/mongoose";
import { TemplatesModule } from "./models/templates/templates.module";
import { fastifyStatic } from "@fastify/static";
import { errorMiddleware } from './common/middleware/errors';



@Module({
  imports: [AuthModule, UsersModule, TemplatesModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test')],

  controllers: [AppController],

  providers: [AppService],
})

//el middleware se ejecutaria antes de los gards por lo que no cumpliria su funcion de capturar los errores.
//Pensar si el futuro se prescinde de los gards y se sustituyen por middlewares

/*export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(errorMiddleware)
      .forRoutes('/');
  }
}*/

export class AppModule {}
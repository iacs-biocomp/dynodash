import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesModule } from './models/templates/templates.module';
import { ImageSchema } from './models/images/imagesSchema';


const db_hostname = 'localhost';
const db_port = '27017';
const db_database = 'dynodash';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TemplatesModule,
    MongooseModule.forRoot(`mongodb://${db_hostname}:${db_port}/${db_database}`),
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }])
  ],

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

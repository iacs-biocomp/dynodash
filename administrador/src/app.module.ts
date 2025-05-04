import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesModule } from './models/templates/templates.module';
import { ScriptsModule } from './models/scripts/scripts.module';
import { ImageSchema } from './models/images/imagesSchema';
import { WidgetsModule } from './models/widgets/widgets.module';
import { DashboardsModule } from './models/dashboards/dashboard.module';
import { DatosModule } from './models/datos/datos.module';
import { DataModule } from './models/data/data.module';
import { MongoDbDriverModule } from 'nest-mongodb-driver';

const db_port = '27017';
const db_user = "uavlgiy7kswrhkaidzmv";
const db_database = 'bnbgibg44u4ayfh';
const db_password = "GW2p5KpliWY5kz3R03DX";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TemplatesModule,
    ScriptsModule,
    WidgetsModule,
    DashboardsModule,
    DatosModule,
    DataModule,
    MongooseModule.forRoot(
      `mongodb://${db_user}:${db_password}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${db_port},n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${db_port}/${db_database}?replicaSet=rs0`,
    ),
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
    MongoDbDriverModule.forRoot({
      url: `mongodb://${db_user}:${db_password}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${db_port},n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${db_port}/${db_database}?replicaSet=rs0`,
    }),
    DataModule,
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

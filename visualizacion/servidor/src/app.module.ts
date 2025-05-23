import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

// modules
import { DashboardModule } from './models/dashboard/dashboard.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatosModule } from './models/datos/datos.module';

// Controllers
import { AppController } from './app.controller';

// providers
import { AppService } from './app.service';
import { DashboardService } from './models/dashboard/dashboard.service';

const db_port = '27017';
const db_user = "uavlgiy7kswrhkaidzmv";
const db_database = 'bnbgibg44u4ayfh';
const db_password = "GW2p5KpliWY5kz3R03DX";

const url = "mongodb://uavlgiy7kswrhkaidzmv:GW2p5KpliWY5kz3R03DX@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bnbgibg44u4ayfh?replicaSet=rs0";
@Module({
  imports: [
    DashboardModule,
    MongooseModule.forRoot(`mongodb://${db_user}:${db_password}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${db_port},n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${db_port}/${db_database}?replicaSet=rs0`),
    DatosModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

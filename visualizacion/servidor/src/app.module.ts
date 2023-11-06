import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

// modules
import { DashboardModule } from './dashboard/dashboard.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatosModule } from './datos/datos.module';

// Controllers
import { AppController } from './app.controller';

// providers
import { AppService } from './app.service';

const db_hostname = 'localhost';
const db_port = '27017';
const db_database = 'dynodash';

@Module({
  imports: [
    DashboardModule,
    MongooseModule.forRoot(`mongodb://${db_hostname}:${db_port}/${db_database}`),
    DatosModule,
  ],
  controllers: [AppController]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from "./sockets-gateway/gateway.module";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from "@nestjs/mongoose";
import { TemplatesModule } from "./models/templates/templates.module";




@Module({
  imports: [GatewayModule, AuthModule, UsersModule, TemplatesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test')],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}

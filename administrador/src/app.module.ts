import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { ServeStaticModule, serveStaticProviders } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from "@nestjs/mongoose";
import { TemplatesModule } from "./models/templates/templates.module";
import { fastifyStatic } from "@fastify/static";



@Module({
  imports: [AuthModule, UsersModule, TemplatesModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test')],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}

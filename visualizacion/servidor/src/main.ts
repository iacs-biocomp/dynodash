import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as exphbs from 'express-handlebars';
//import * as hbs from 'express-handlebars';
import * as hbs from 'hbs';
import * as helpers from '../views/helpers/helpers';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //allow resources to be requested from different domains
  //app.enableCors();

  app.useStaticAssets(join(__dirname, '..', '..', 'public'));

  app.set('views', join(__dirname, '..', '..', 'views'));

  // config view engine
  const hbs = exphbs.create({
    defaultLayout: 'index',
    layoutsDir: join(__dirname, '..', '..', 'views', 'layouts'),
    partialsDir: join(__dirname, '..', '..', 'views', 'partials'),
    helpers: helpers,
    extname: '.hbs',
  });
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');



  /*app.setBaseViewsDir(join(__dirname, '..','..', 'views/layouts'));

  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..','..', '/views/partials'));

  app.engine(
    'hbs',
    () => hbs.create({
      extname: 'hbs',
      defaultLayout: 'index',
      layoutsDir: join(__dirname, '..','..','views', 'layouts'),
      partialsDir: join(__dirname, '..','..', 'views', 'partials'),
      //helpers
    }),
  );*/

  const port = 8080;



  /*Solo mantener en desarrollo. 
  Permite solicitudes HTTP realizadas desde un origen (dominio, protocolo y puerto) diferente al origen del recurso solicitado.
  */
   // Enable CORS
   const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.enableCors(corsOptions);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(port);

  console.log(`app running at http://localhost:${port}/`);
}
bootstrap();


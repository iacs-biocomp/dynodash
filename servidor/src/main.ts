import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { AuthGard } from './gards/auth.gard';
import { HttpExceptionFilter } from "./global.filter";


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //app.useGlobalGuards(new AuthGard());
  app.useGlobalFilters(new HttpExceptionFilter());

  //allow resources to be requested from different domains
  app.enableCors();

  app.useStaticAssets(join(__dirname, '..','public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.engine(
    'hbs',
    hbs.create({
      extname: 'hbs',
      defaultLayout: 'layout_main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
      //helpers
    }),
  );

  app.setViewEngine('hbs');

  const port = 3000;

  await app.listen(port);

  console.log(`app running at http://localhost:${port}/`);
}
bootstrap();

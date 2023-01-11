import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as exphbs from "express-handlebars";
//import * as hbs from 'express-handlebars';
import { HttpExceptionFilter } from "./global.filter";
import * as hbs from 'hbs';


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  //allow resources to be requested from different domains
  //app.enableCors();

  app.useStaticAssets(join(__dirname, '..','..','public'));

  app.set("views", join(__dirname,'..','..', "views"));

// config view engine
const hbs = exphbs.create({
  defaultLayout: "index",
  layoutsDir: join(__dirname,'..','..', "views", "layouts"),
  partialsDir: join(__dirname,'..','..', "views", "partials"),
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

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

  await app.listen(port);

  console.log(`app running at http://localhost:${port}/`);
}
bootstrap();

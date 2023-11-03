import { Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import * as Handlebars from 'handlebars';
import { Funciones } from './common/functions/functions';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private funciones: Funciones,
  ) {}

  /*
   * Se renderiza el index.hbs con el main.hbs
  
   * @param res 
   * @returns 
   */
  @Get()
  root(@Req() req: Request, @Res() res: Response) {
    return res.render('layouts/inicio.hbs', {
      layout: 'index.hbs',
    });
  }
}

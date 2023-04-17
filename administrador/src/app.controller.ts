import {
  Controller,
  Render,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
  UseFilters,
  Res,
} from '@nestjs/common';
import * as secureSession from '@fastify/secure-session';

import { AppService } from './app.service';
import { LocalAuthGuard, AthenticatedSession, DeletedSession } from './gards';
import { AuthService } from './auth/auth.service';

import { HttpExceptionFilter } from './common/exceptionFilters/globalFilterExpress';
import { Response, Request } from 'express';
import { ImageType } from './models/images/imagesSchema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('images')
  async insertarImagen(@Req() req: Request) {
    await this.appService.insertarImagen(req);
  }

  @Get('images')
  async obtenerImagenes(): Promise<ImageType[]> {
    return await this.appService.obtenerImages();
  }

  @Get()
  @Render('main.hbs')
  root(@Session() session: secureSession.Session) {
    console.log('En root');
    console.log(session);
    return { title: 'Pagina web' };
  }

  @Get('error400')
  @Render('error400.hbs')
  error400() {
    return { title: 'Error 400' };
  }

  @Get('error401')
  @Render('error401.hbs')
  error401() {
    return { title: 'Error 401' };
  }

  @Get('error403')
  @Render('error403.hbs')
  error403() {
    return { title: 'Error 403' };
  }

  @Get('error404')
  @Render('error404.hbs')
  error404() {
    return { title: 'Error 404' };
  }

  @UseGuards(LocalAuthGuard)
  @UseGuards(DeletedSession)
  @UseFilters(new HttpExceptionFilter())
  @Post('auth/creador-dashboards')
  @Render('layouts/creador-dashboards.hbs')
  async login(
    @Req() req,
    @Session() session: secureSession.Session,
    @Res() resp: Response,
  ) {
    const visits = session.get('visits');
    session.set('visits', visits ? visits + 1 : 1);
    session.authenticated = true;
    const username = req.body.username;
    session.user = username;

    console.log('En login');
    console.log(session);

    return { title: username };
  }

  @UseGuards(AthenticatedSession)
  @UseGuards(DeletedSession)
  @UseFilters(new HttpExceptionFilter())
  @Get('profile')
  @Render('layouts/profile.hbs')
  async getProfile(@Req() req) {
    return { nombre: req.session.user, title: req.session.user };
  }

  @Post('logout')
  async logout(
    @Session() session: secureSession.Session,
    @Res() resp,
    @Req() req,
  ) {
    session.delete();
    console.log('En logout');
    console.log(session);
    resp.status(302).redirect('/');
    return resp.send({ session: session.deleted });
  }
}

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
  Param
} from '@nestjs/common';
import * as secureSession from '@fastify/secure-session';

import { AppService } from './app.service';
import { LocalAuthGuard, AthenticatedSession, DeletedSession } from './gards';
import { AuthService } from './auth/auth.service';
import { HttpExceptionFilter } from './common/exceptionFilters/globalFilterExpress';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  plantillaServicio: any;
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) { }

  @Get()
  @Render('login_form.hbs')
  getLoginForm() {
    return { title: 'Login' };
  }

  /*@Get('second')
   second(@Session() session: secureSession.Session, @Res() response) {
     console.log('Second');
     return response.second('main.hbs',{ title: 'Segunda'});
   }*/

  @UseGuards(LocalAuthGuard, DeletedSession)
  @UseGuards(DeletedSession)
  @UseFilters(new HttpExceptionFilter())
  @Post('auth/login')
  async login(@Req() req, @Res() res: Response, @Session() session) {
    session.visits = (session.visits || 0) + 1;
    session.authenticated = true;
    const username = req.body.username;
    session.user = username;
    return res.status(302).redirect('/home');
  }


  @Get('home')
  @Render("main.hbs")
  getHome(@Session() session: secureSession.Session, @Res() res: Response) {
    console.log("access home")
    if (!session.authenticated) {
      return res.status(400).redirect('/error400.hbs');
    }
    return { title: 'Home', username: session.user };
  }


  /*@UseGuards(AthenticatedSession)
  @UseGuards(DeletedSession)
  @UseFilters(new HttpExceptionFilter())
  @Get('profile')
  @Render('layouts/profile.hbs')
  async getProfile(@Req() req) {
    return { nombre: req.session.user, title: req.session.user };
  }*/


  @Post('/logout')
  async logout(
    @Session() session: secureSession.Session,
    @Res() resp: Response,
    @Req() req: Request,
  ) {
    session.delete();
    console.log('En logout');
    console.log(session);
    resp.status(302).redirect('/');
    return resp.send({ session: session.deleted });
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
}



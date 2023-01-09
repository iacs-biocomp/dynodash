import { Controller, Render, Get, Post, Req, Session, UseGuards, UseFilters, HttpException, HttpStatus, Res, ForbiddenException } from '@nestjs/common';
import * as secureSession from '@fastify/secure-session';

import { AppService } from './app.service';
import {
  LocalAuthGuard,
  AthenticatedSession
} from "./gards";
import { AuthService } from './auth/auth.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpExceptionFilter } from './common/exceptionFilters/globalFilter';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) { }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  @Render('index.hbs')
  root() {
    return {
      message: `<div class="row mt-5">
  
    <div class="col-sm-6">
        <h1>Login manual</h1>
        <hr>

        <form action="/auth/login" method="post" class="d-grid">
            <input type="text" name="username" class="form-control mb-2" placeholder="Name" />
            <input type="text" name="password" class="form-control mb-2" placeholder="Password" />

            <button type="submit" class="btn btn-primary">
                Ingresar
            </button>
        </form>

    </div>
</div>` };
  }

  @UseGuards(LocalAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @Post('auth/login')
  @Render('index.hbs')
  async login(@Req() req, @Session() session: secureSession.Session,@Res() resp: Response) {
    try {

      const visits = session.get('visits');
      session.set('visits', visits ? visits + 1 : 1);
      session.authenticated = true;
      session.user = req.body.username;
      console.log(session)

      return {
        message: `<div class="row mt-5">
  
                  <div class="col-sm-6">
                      <h1>Login manual</h1>
                      <hr>

                      <form action="/profile" method="post" class="d-grid">
                          <button type="submit" class="btn btn-primary">
                              WhoIam
                          </button>
                      </form>

                  </div>
              </div>`};

    }catch(err) {
      if(err instanceof ForbiddenException) {
        throw new HttpException('fallo rol', HttpStatus.FORBIDDEN);
    }else {
        throw new HttpException('fallo ruta', HttpStatus.BAD_REQUEST);
    }
    }

  }

  @UseGuards(AthenticatedSession)
  @Post('profile')
  @UseFilters(new HttpExceptionFilter())
  @Render('index.hbs')
  async getProfile(@Req() req) {
    return { message: req.session.user };
  }

  @Get('logout')
  async eleiminarSesion(@Session() session: secureSession.Session) {
    session.delete();
  }


}

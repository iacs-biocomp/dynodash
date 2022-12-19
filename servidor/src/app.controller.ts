import { Controller, Get, Render, UseFilters, UseGuards, HttpException, HttpStatus, Post, Request, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/global.filter';
import { response } from 'express';
import { 
  LocalAuthGuard,
  JwtAuthGuard,
 } from './gards';
import { AuthService } from './auth/auth.service';
import { myStorage } from "./common/interfaces/window";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService, 
    private authService: AuthService,
    ) {}
  

  private readonly window : myStorage;

  @Get()
  @Render('index.hbs')
  async getHello(){
    this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {

    const { access_token} = await this.authService.login(req.user);
    //this.window.localStorage.setItem('token', access_token);
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    try {
      return req.user;
    }catch(error){
      throw new HttpException('no token', HttpStatus.UNAUTHORIZED);
    }
    
  }
  
}

import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from "express";


@Controller()
export class AppController {
  

  constructor(
    private readonly appService: AppService, 
    ) {}
  
  /*
   * Se renderiza el index.hbs con el main.hbs
  
   * @param res 
   * @returns 
   */
  @Get()
  root(@Res() res: Response) {
    return res.render(
      "main",
    );

}

}

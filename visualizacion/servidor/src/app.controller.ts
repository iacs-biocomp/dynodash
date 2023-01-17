import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from "express";
import * as Handlebars from "handlebars";

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

    /**
     * Handlebars compila la plantilla e introduce los datos en ella para contruir el HTML.
     */
    const template = this.appService.getPlantilla();
    const compiledTemplate = Handlebars.compile(template);
    const data = this.appService.getData();
    const html = compiledTemplate(data);
    console.log(html)
    return res.render("layouts/index",{
      titulo: "Inicio",
      body: html
    }
    );

  }

}

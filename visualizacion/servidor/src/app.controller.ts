import { Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from "express";
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
  root(@Req() req: Request, @Res() res: Response) {
    /**
     * Handlebars compila la plantilla e introduce los datos en ella para contruir el HTML.
     */
    const template = this.appService.getPlantilla();
    const compiledTemplate = Handlebars.compile(template);
    //const data = this.appService.getData();
    //const html = compiledTemplate(data);
    //console.log(html)
    return res.render("main",{
      titulo: "Inicio",
      body: template
    }
    );

  }

  @Post('renderizar')
  renderizado(@Req() req: Request, @Res() resp: Response) {

    const {etiqueta, html} = req.body;

    console.log(req.body)

    //HTML es la template de handlebars

    const compiledTemplate = Handlebars.compile(html);
    console.log(compiledTemplate)
    const data = this.appService.getData(etiqueta)
    const htmlResponse = compiledTemplate(data);

    return resp.json({
      "html" : htmlResponse
    })

  }

}

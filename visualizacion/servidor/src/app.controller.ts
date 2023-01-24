import { Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from "express";
import * as Handlebars from "handlebars";
import { Funciones } from "./common/funciones/funciones";


@Controller()
export class AppController {
  

  constructor(
    private readonly appService: AppService,
    private funciones: Funciones 
    ) {}
  
  /*
   * Se renderiza el index.hbs con el main.hbs
  
   * @param res 
   * @returns 
   */
  @Get()
  async root(@Req() req: Request, @Res() res: Response) {

    let html;
    /**
     * Handlebars compila la plantilla e introduce los datos en ella para contruir el HTML.
     */
    console.log('Plantilla data')
    html = this.appService.getPlantilla();
    console.log(html)

    let etiquetas = this.funciones.buscadorEtiquetas(html);

    console.log(etiquetas)

    while(etiquetas.length!==0) {

      const json = this.funciones.crearJSON(etiquetas);
      console.log('Plantilla compilada')
      const compiledTemplate = Handlebars.compile(html);
      console.log(compiledTemplate)

      html = compiledTemplate(json)
      console.log(html)

      etiquetas = this.funciones.buscadorEtiquetas(html)

    }

    if(etiquetas.length===0) {
      console.log("No hay mas etiquetas")
    }

    return res.render("main",{
      titulo: "Inicio",
      body: html
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

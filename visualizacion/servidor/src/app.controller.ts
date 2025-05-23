import { Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import * as Handlebars from 'handlebars';
import { DashboardService } from './models/dashboard/dashboard.service';

@Controller()
export class AppController {
  constructor(
    private dashboardService: DashboardService,
  ) { }

  @Get()
  @Render('layouts/lista_atlas.hbs')
  async getHome(@Req() req: Request, @Res() res: Response) {
    //Obtener todos los atlas que hay en base de datos
    try {
      const dashboardsList = await this.dashboardService.getDashboardList();

      return {
        dashboards: dashboardsList,
        pageName: "Atlas VPM"
      }
    } catch (error) {
      //TODO - REDIRIGIR AL ERROR CORRECTO
      console.log("error al cargar los dashboards")
      return res.status(500).render('layouts/error.hbs', {
        layout: 'index.hbs',
        message: "Ocurrió un error al cargar los dashboards"
      });
    }
  }
  /*
   * Se renderiza el index.hbs con el main.hbs
  
   * @param res 
   * @returns 
   */
  /*@Get()
  async root(@Req() req: Request, @Res() res: Response) {

    //Obtener todos los atlas que hay en base de datos
    try {
      const dashboardsList = await this.dashboardService.getDashboardList();
      return res.render('layouts/lista_atlas.hbs', {
        layout: 'index.hbs',
        dashboards: dashboardsList,
        pageName: "Atlas VPM"
      });
    } catch (error) {
      console.log("error al cargar los dashboards")
    }
  }*/
}

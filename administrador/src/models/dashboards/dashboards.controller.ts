import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Render, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
//import { HttpExceptionFilterDB } from 'src/common/exceptionFilters/globalFilterExpress';
import { Dashboard } from './dashboard.schema';
import { DashboardsService } from './dashboard.service';
import { TemplatesService } from '../templates//templates.service'
import { DashboardWidgetDTO } from './dashboardWidgetDTO';


@Controller('dashboard')
export class DashboardsController {
  constructor(
    private dashboardService: DashboardsService,
    private templateService: TemplatesService) { }

  //endpoint para obtener todos los dashboards
  @Get()
  async obtenerDashboards() {
    return await this.dashboardService.getDashboardList();
  }

  /**
   * 
   * @returns 
   */
  @Get('list')
  @Render('dashboards/dashboardList.hbs')
  async templateList() {
    console.log('En templateList');
    try {
      const list = await this.dashboardService.getDashboardList();
      return { title: 'List of dashboards',
               items: list
            };     
    } catch (Error) {
      console.log(Error);
    }
  }


 //endpoint para obetener el dashboard principal del dashboard
 @Get('item/:id')
 async getDashboard(@Param('id') dashboardId: string, @Res() res: Response) {

   try {
     const dashboardInstance = await this.dashboardService.getDashboard(dashboardId);
     //console.log(html)
     return res.send(dashboardInstance);
   }catch(error) {
     return res.status(400).send('Dashboard no encontrado.')
   }
 }


  //endpoint para obetener el dashboard principal del dashboard
  @Get('widget/:id/:frame/:order')
  async getDashboardWidget(@Param('id') dashboardId: string,
                           @Param('frame') frame: string, 
                           @Param('order') order: string, 
                           @Res() res: Response) {
     try {
      const dashboardInstance = await this.dashboardService.getDashboard(dashboardId);
      const widgets = dashboardInstance.widgets;
      const w = widgets.find(element => element.frame == frame && element.order == order);
      w.doc = Buffer.from(w.doc, 'base64').toString('utf-8');
      //console.log(w);
      return res.send(w);
    }catch(error) {
      return res.status(400).send('Widget no encontrado.')
    }
  }


  /**
   * 
   * @param id 
   * @returns 
   */
  @Get('editor/:id')
  @Render('dashboards/dashboardEditor.hbs')
  async editor(@Param('id') id: string) {
    try {
        const item = await this.dashboardService.getDashboard(id);
        const templateList = await this.templateService.getTemplateList();
        return { title: 'Editor', dashboard: item, templates: templateList } 
      } catch (Error) {
        console.log(Error);
      }
  }

  //endpoint para insertar un dashboard
  //comprobar que el data no es nulo
  @Post('dashboard')
  //@UseFilters(new HttpExceptionFilterDB)
  async insertarDashboard(@Body() insertarDashboard: Dashboard, @Res() res: Response) {

    if (insertarDashboard == undefined) {
      //console.log('es nulo')
      throw new HttpException('No se han enviado datos para guardar.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(insertarDashboard.name==="") {
      //console.log('no hay code')
      throw new HttpException('Debe asignarle un nombre al dashboard.', HttpStatus.NOT_IMPLEMENTED);
    }

    try {
      const newObject = await this.dashboardService.insertDashboard(insertarDashboard);
      return res.send({msg: 'Guardado con exito'});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }


 

  //endpoint para actualizar un dashboard
  @Put()
  async actualizarDashboard(@Body() dashboard: Dashboard, @Res() res: Response) {
    try {

      await this.dashboardService.updateDashboard(dashboard);
      console.log('ok')
      return res.send('Dashboard actualizado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

  //endpoint para obetener el dashboard principal del dashboard
  @Put('widget/:id/')
  async updateWidget(@Param('id') dashboardId: string,
                     @Body() widget: DashboardWidgetDTO,
                     @Res() res: Response) {
     try {
      //console.log("widget recibido: ", widget);
      await this.dashboardService.updateWidget(dashboardId, widget);
      return res.send('Widget succesfully updated');
    } catch(error) {
      return res.status(400).send('Widget not found')
    }
  }



  //endpoint para eliminar un dashboard
  @Delete(':id')
  async eliminarDashboard(@Param('id') dashboardId: string, @Res() res: Response){
    try {

      await this.dashboardService.deleteDashboard(dashboardId);
      return res.send('Dashboard eliminado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

}

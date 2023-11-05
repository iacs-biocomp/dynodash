import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, Render, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { WidgetsService } from './widgets.service';
import { Widget } from './widget.schema'
import { TemplatesService } from '../templates/templates.service';
import { ScriptsService } from '../scripts/scripts.service';


/**
 * 
 */
@Controller('widget')
export class WidgetsController {
  constructor(
      private widgetService: WidgetsService,
      private templateService: TemplatesService,
      private scriptsService: ScriptsService
  ) { }

  /**
   * 
   * @returns 
   */
  @Get()
  async getWidgets() {
    return await this.widgetService.getWidgetList();
  }


  /**
   * 
   * @returns 
   */
  @Get('list')
  @Render('widgets/widgetList.hbs')
  async widgetList() {
    console.log('En widgetList');
    try {
      const list = await this.widgetService.getWidgetList();
      return { title: 'List of widgets',
               items: list
            };     
    } catch (Error) {
      console.log(Error);
    }
  }


  
  /**
   * 
   * @param id 
   * @returns 
   */
  @Get('item/:id')
  async widgetItem(@Param('id') id: string) {
    console.log('Solicitando widget ' + id);
    try {
      const item = await this.widgetService.getWidget(id);
      return item;
    } catch (Error) {
      console.log(Error);
    }
  }


  /**
   * Gets the template of a given widget
   * @param id 
   * @returns 
   */
    @Get('itemTemplate/:id')
    async widgetItemTemplate(@Param('id') id: string) {
      try {
        const item = await this.widgetService.getWidget(id);
        const template = await this.templateService.getTemplate(item.template)
        return template;
      } catch (Error) {
        console.log(Error);
      }
    }
  
  
  /**
   * 
   * @param id 
   * @returns 
   */
  @Get('editor/:id')
  @Render('widgets/widgetEditor.hbs')
  async editor(@Param('id') id: string) {
    try {
        const item = await this.widgetService.getWidget(id);
        const templateList = await this.templateService.getTemplateList();
        const scriptsList = await this.scriptsService.getScriptList();
        return { title: 'Editor', widget: item, templates: templateList, scripts: scriptsList };
      } catch (Error) {
        console.log(Error);
      }
  }




  /**
   * 
   * @param insertarWidget 
   * @param res 
   * @returns 
   */
  @Post()
  //@UseFilters(new HttpExceptionFilterDB)
  async insertarWidget(@Body() insertarWidget: Widget, @Res() res: Response) {

    const { name, template} = insertarWidget
    if (insertarWidget == undefined) {
      //console.log('es nulo')
      throw new HttpException('No se han enviado datos para guardar.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(name==="") {
      //console.log('no hay code')
      throw new HttpException('Debe asignarle un nombre al widget.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(template === "") {
      //console.log('no hay content')
      throw new HttpException('Debe asignar un template al widget.', HttpStatus.NOT_IMPLEMENTED);
    }
    try {
      const newObject = await this.widgetService.insertWidget(insertarWidget);
      return res.send({msg: 'Guardado con exito'});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }



  /**
   * endpoint para actualizar un dashboard
   * @param widget 
   * @param res 
   * @returns 
   */
  @Put()
  async actualizarWidget(@Body() widget: Widget, @Res() res: Response) {
    try {
      await this.widgetService.updateWidget(widget);
      console.log('Widget actualizado con éxito.')
      return res.send('ok')

    } catch(error) {
      return res.status(400).send('Widget no encontrado.')
    }
  }



  /**
   * endpoint para eliminar un dashboard
   * @param dashboardId 
   * @param res 
   * @returns 
   */
  @Delete(':id')
  async eliminarDashboard(@Param('id') dashboardId: string, @Res() res: Response){
    try {

      await this.widgetService.deleteWidget(dashboardId);
      return res.send('Dashboard eliminado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

}

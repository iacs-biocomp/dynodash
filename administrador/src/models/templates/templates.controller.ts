import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
//import { HttpExceptionFilterDB } from 'src/common/exceptionFilters/globalFilterExpress';
import { CrearTemplateDTO } from './dto';

import { TemplatesService } from './templates.service';

@Controller('dashboard')
export class TemplatesController {
  constructor(private templateService: TemplatesService) { }

  //endpoint para obtener todos los templates
  @Get()
  async obtenerTemplates() {
    return await this.templateService.obtenerTemplates();
  }

  //endpoint para insertar un template
  //comprobar que el data no es nulo
  @Post('template')
  //@UseFilters(new HttpExceptionFilterDB)
  async insertarTemplate(@Body() insertarTemplate: CrearTemplateDTO, @Res() res: Response) {

    const { code, content} = insertarTemplate
    if (insertarTemplate == undefined) {
      //console.log('es nulo')
      throw new HttpException('No se han enviado datos para guardar.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(code==="") {
      //console.log('no hay code')
      throw new HttpException('Debe asignarle un nombre al dashboard.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(content === "") {
      //console.log('no hay content')
      throw new HttpException('Debe crear un dashboard previamente.', HttpStatus.NOT_IMPLEMENTED);
    }
    try {
      const newObject = await this.templateService.insertarTemplate(insertarTemplate);
      return res.send({msg: 'Guardado con exito'});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  //endpoint para obetener el template principal del dashboard
  @Get(':id')
  async obtenerDashboard(@Param('id') dashboardId: string, @Res() res: Response) {

    try {
      const html = await this.templateService.obtenerDashboard(dashboardId);
      //console.log(html)
      return res.send(html);
    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

  //endpoint para actualizar un dashboard
  @Put(':id')
  async actualizarDashboard(@Param('id') dashboardId: string, @Body() template: CrearTemplateDTO, @Res() res: Response) {
    try {

      await this.templateService.actulizarDashboard(dashboardId, template);
      console.log('ok')
      return res.send('Dashboard actualizado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

  //endpoint para eliminar un dashboard
  @Delete(':id')
  async eliminarDashboard(@Param('id') dashboardId: string, @Res() res: Response){
    try {

      await this.templateService.eliminarDashboard(dashboardId);
      return res.send('Dashboard eliminado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

}

/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Render,
} from '@nestjs/common';
import { Response } from 'express';
//import { HttpExceptionFilterDB } from 'src/common/exceptionFilters/globalFilterExpress';
import { CrearTemplateDTO } from './templateDTO';
import { TemplatesService } from './templates.service';

/**
 *
 */
@Controller('template')
export class TemplatesController {
  constructor(private templateService: TemplatesService) {}

  /**
   * Returns the list of templates as JSON 
   * @returns
   */
  @Get()
  async getTemplates() {
    return await this.templateService.getTemplateList();
  }

  
  /**
   * Returns a page with the list of templates
   * @returns
   */
  @Get('list')
  @Render('templates/templateList.hbs')
  async templateList() {
    try {
      const list = await this.templateService.getTemplateList();
      return { title: 'List of templates', items: list };
    } catch (Error) {
      console.log(Error);
    }
  }


  /**
   * Returns a sigle template as JSON
   * @param id
   * @returns
   */
  @Get('item/:id')
  async templateItem(@Param('id') id: string) {
    try {
      const item = await this.templateService.getTemplate(id);
      return item;
    } catch (Error) {
      console.log(Error);
    }
  }


  /**
   * Return an editor page to edit a given template
   * @param id
   * @returns
   */
  @Get('editor/:id')
  @Render('templates/templateEditor.hbs')
  editor(@Param('id') id: string) {
    return { title: 'Editor', template: id };
  }


  /**
   * Renderiza la pagina de creacion de templates
   * @param id
   * @returns
   */
  @Get('add')
  @Render('templates/templateAdd.hbs')
  addTemplate(@Param('id') id: string) {
    return { title: 'Añadir', template: id };
  }


  /**
   * Handler for post request: create/insert a new template
   * @param template
   * @param res
   * @returns
   */
  @Post()
  //@UseFilters(new HttpExceptionFilterDB)
  async insertTemplate(
    @Body() template: CrearTemplateDTO,
    @Res() res: Response,
  ) {
    const { name, content } = template;
    if (template == undefined) {
      //console.log('es nulo')
      throw new HttpException(
        'No se han enviado datos para guardar.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (name === '') {
      //console.log('no hay code')
      throw new HttpException(
        'Debe asignarle un nombre al dashboard.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (content === '') {
      //console.log('no hay content')
      throw new HttpException(
        'Debe crear un dashboard previamente.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      await this.templateService.insertTemplate(
        template,
      );
      return res.send({ msg: 'Guardado con exito' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  /**
   * endpoint para actualizar un dashboard
   * @param template
   * @param res
   * @returns
   */
  @Put()
  async updateTemplate(
    @Body() template: CrearTemplateDTO,
    @Res() res: Response,
  ) {
    try {
      await this.templateService.updateTemplate(template);
      console.log('Template actualizado con éxito.');
      return res.send('ok');
    } catch (error) {
      return res.status(400).send('Template no encontrado.');
    }
  }

  /**
   * endpoint para eliminar un dashboard
   * @param dashboardId
   * @param res
   * @returns
   */
  @Delete(':id')
  async deleteTemplate(
    @Param('id') templateId: string,
    @Res() res: Response,
  ) {
    try {
      await this.templateService.deleteTemplate(templateId);
      return res.send('Template eliminado con éxito.');
    } catch (error) {
      return res.status(400).send('Template no encontrado');
    }
  }
}

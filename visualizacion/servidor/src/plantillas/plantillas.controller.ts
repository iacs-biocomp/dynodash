import {
  Controller,
  Get,
  Render,
  HttpException,
  HttpStatus,
  Param,
  UseFilters,
  Request,
  ForbiddenException,
  Post,
  Res,
  Body,
} from '@nestjs/common';
import { Response } from 'express';

import { PlantillasService } from './plantillas.service';
import { AppService } from 'src/app.service';
/*/import {
  CrearDashboardDTO,
  CrearDocumentDTO,
  CrearScriptDTO,
  CrearTemplateDTO,
  CrearWidgetDTO,
} from './dto';
*/
@Controller('atlas')
export class PlantillasController {
  constructor(
    private plantillaServicio: PlantillasService,
  ) {}

  @Get('id/:parametro')
  async obtenerHTML(
    @Param('parametro') dashboardId: string,
    @Res() res: Response,
  ) {
    try {
      const html = await this.plantillaServicio.obtenerHTML(dashboardId);
      return res.render('main', {
        html: html,
      });
    } catch (Error) {
      console.log(Error);
    }
  }
}

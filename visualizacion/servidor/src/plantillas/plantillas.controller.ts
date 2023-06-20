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
import { HttpExceptionFilter } from 'src/global.filter';

import { Response } from 'express';
import * as Handlebars from 'handlebars';

import { PlantillasService } from './plantillas.service';
import { AppService } from 'src/app.service';
import { Funciones } from 'src/common/funciones/funciones';
import {
  CrearDashboardDTO,
  CrearDocumentDTO,
  CrearScriptDTO,
  CrearTemplateDTO,
  CrearWidgetDTO,
} from './dto';

@Controller('atlas')
export class PlantillasController {
  constructor(
    private plantillaServicio: PlantillasService,
    private appService: AppService,
    private funciones: Funciones,
  ) {}

  @Post('dashboard')
  async insertarDashboard(@Body() insertarDashboard: CrearDashboardDTO) {
    await this.plantillaServicio.insertarDashboard(insertarDashboard);
  }

  @Post('documento')
  async insertarDocumento(@Body() insertarDocumento: CrearDocumentDTO) {
    await this.plantillaServicio.insertarDocumento(insertarDocumento);
  }

  @Post('script')
  async insertarScript(@Body() insertarScript: CrearScriptDTO) {
    await this.plantillaServicio.insertarScript(insertarScript);
  }

  @Post('template')
  async insertarTemplate(@Body() insertarTemplate: CrearTemplateDTO) {
    await this.plantillaServicio.insertarTemplate(insertarTemplate);
  }

  @Post('widget')
  async insertarWidget(@Body() insertarWidget: CrearWidgetDTO) {
    await this.plantillaServicio.insertarWidget(insertarWidget);
  }

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

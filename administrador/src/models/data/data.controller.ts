import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  /**
   * Returns a page with the list of datos
   * @returns
   */
  @Get('list')
  @Render('datos/dataList.hbs')
  async datosList() {
    try {
      const list = await this.dataService.findAll();
      return { title: 'List of datos', items: list };
    } catch (Error) {
      console.log(Error);
    }
  }

  /**
   * Returnos a detailed view of the datos
   * @param id
   * @returns
   */
  @Get('view/:id')
  @Render('datos/dataView.hbs')
  async view(@Param('id') id: string) {
    const datos = await this.dataService.getDatos(id);
    delete datos._id;
    delete datos.data;
    delete datos.__v;
    return {
      title: 'View',
      id: datos.id,
      indicador: datos.indicador,
      data: datos.data,
      campos: datos,
    };
  }

  /**
   * Updates datos
   * @param datos
   * @param res
   * @returns
   */
  @Put()
  async updateDatos(@Body() datos: string, @Res() res: Response) {
    try {
      this.dataService.updateDatos(JSON.parse(datos));
      console.log('Dato actualizado con exito.');
      return res.send('ok');
    } catch (error) {
      return res.status(400).send('Datos no encontrados.');
    }
  }
}

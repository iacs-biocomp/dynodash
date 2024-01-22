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
import { DatosService } from './datos.service';
import { CrearDatosDTO } from './datosDTO';

@Controller('datos')
export class DatosController {
  constructor(private datosService: DatosService) {}



  /**
   * Returns the list of data as JSON
   * @returns
   */
  @Get()
  async getDatos() {
    return await this.datosService.getDatosList();
  }



  /**
   * Returns a page with the list of datos
   * @returns
   */
  @Get('list')
  @Render('datos/datosList.hbs')
  async datosList(id:string) {
    try {
      const list = await this.datosService.getDatosList();
      return { title: 'List of datos', items: list };
    } catch (error) {
      console.log(error);
    }
  }



  /**
   * Returns a detailed view of the datos
   * @param id
   * @returns
   */
  @Get('view/:id')
  @Render('datos/datosView.hbs')
  async view(@Param('id') id: string) {
    const datos = await this.datosService.getDatos(id);
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
      this.datosService.updateDatos(JSON.parse(datos));
      console.log('Dato actualizado con exito.');
      return res.send('ok');
    } catch (error) {
      return res.status(400).send('Datos no encontrados.');
    }
  }



  /**
   * Returns a single dato as a json
   * @param id
   * @returns
   */
  @Get('item/:id')
  async datosItem(@Param('id') id: string) {
    try {
      const item = await this.datosService.getDatos(id);
      return item;
    } catch (error) {
      console.log(error);
    }
  }



  /**
   * Renderiza la pagina de creacion de datos
   * @param id
   * @returns
   */
  @Get('add')
  @Render('datos/datosAdd.hbs')
  addTemplate(@Param('id') id: string) {
    return { title: 'Añadir', datos: id };
  }

  /**
   * Creates dato
   * @param datos
   * @returns
   */
  @Post()
  async createDatos(@Body() data: any[]) {
      try {
          await this.datosService.createDatos(data);
          return { success: true, message: 'Datos creados correctamente' };
      } catch (error) {
          if (error instanceof Error && error.message.startsWith('Ya existe un dato con el ID')) {
              return { success: false, error: error.message };
          } else {
              console.error("Ha habido un error", error);
              return { success: false, error: 'Error al crear los datos' };
          }
      }
  }



  /**
   * Deletes a dato
   * @param id
   * @returns
   */
  @Delete(':id')
  async deleteDatos(@Param('id') id: string) {
    return await this.datosService.deleteDatos(id);
  }



  /**
   * Deletes fields
   * @param camposABorrar
   * @param res
   * @returns
   */
  @Delete('deleteFields/:id')
  async borrarDatos(@Body() camposABorrar: string[], @Param('id') id: string, @Res() res: Response) {
    try {
      await this.datosService.borrarCampos(camposABorrar, id);
      res.status(200).send('Campo borrado correctamente');
    } catch (error) {
      console.error('Error al borrar datos:', error);
      return res.status(400).send('Error al borrar datos.');
    }
  }


  /**
   * Duplicates a dato
   * @param id 
   * @param res 
   * @returns 
   */
  @Post('duplicate/:id')
  async duplicateDatos(@Param('id') id: string, @Res() res: Response) {
    try {
      const savedDatos = await this.datosService.duplicateAndSaveDatos(id);
      return res.send(savedDatos);
    } catch (error) {
      console.error('Error al duplicar datos:', error);
      return res.status(400).send(`Error al duplicar y guardar el dato: ${error.message}`);
    }
  }
}

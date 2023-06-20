import { Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { DatosService } from './datos.service';

@Controller('datos')
export class DatosController {

  constructor(
    private datosService: DatosService
  ) { }

  @Post('dato')
  async insertarDatos(@Body() insertarDato: any) {
    await this.datosService.insertarDatos(insertarDato);
  }

  @Post('indicador')
  async insertarIndicadores(@Body() insertarIndicador: any) {
    await this.datosService.insertarIndicadores(insertarIndicador);
  }

  @Post('leyenda')
  async insertarLeyenda(@Body() insertarLeyenda: any) {
    await this.datosService.insertarLeyendas(insertarLeyenda);
  }

  @Post('aggLevel')
  async insertarAggLevel(@Body() insertarAggLevel: any) {
    await this.datosService.insertarAggLevel(insertarAggLevel)
  }

  //Este end-point debe desarrollarse en otro modulo llamado datos.

  @Get('aggLevels/:idAggLevel')
  async obetenerAggLevels(@Param('idAggLevel') idAggLevel: string) {
    return await this.datosService.obtenerAggLevel(idAggLevel);
  }

  @Get('indicadores/:parametro')
  async obetenerIndicadores(@Param('parametro') idIndicador: string) {
    return await this.datosService.obtenerIndicadores(idIndicador);
  }


  @Get('data/:idIndicador')
  async obtenerDatos(@Param('idIndicador') idIndicador: string) {
    return await this.datosService.obtnerDatos(idIndicador)
  }

  @Get('leyenda/:parametro')
  async obtenerLeyenda(@Param('parametro') idIndicador: string) {
    return await this.datosService.obtenerLeyenda(idIndicador);
  }

  @Get('perfil/:idIndicador')
  async obtenerPerfil(@Param('idIndicador') idIndicador: string, @Req() payload: any) {
    return await this.datosService.obtenerPerfil(idIndicador, payload)
  }


  /*@Get('datos/:idIndicador/:idSector')
  async obtenerDatosPerfil(@Param('idIndicador') idIndicador: string, @Param('idSector') idSector: string) {
    return await this.datosService.datos(idIndicador, idSector)
  }*/
}

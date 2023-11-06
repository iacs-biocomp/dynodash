import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { DatosService } from './datos.service';

@Controller('datos')
export class DatosController {
  constructor(private datosService: DatosService) {}

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
    return await this.datosService.obtnerDatos(idIndicador);
  }

  @Get('leyenda/:parametro')
  async obtenerLeyenda(@Param('parametro') idIndicador: string) {
    return await this.datosService.obtenerLeyenda(idIndicador);
  }

  @Get('perfil/:idIndicador')
  async obtenerPerfil(
    @Param('idIndicador') idIndicador: string,
    @Req() payload: any,
  ) {
    return await this.datosService.obtenerPerfil(idIndicador, payload);
  }

  /*@Get('datos/:idIndicador/:idSector')
  async obtenerDatosPerfil(@Param('idIndicador') idIndicador: string, @Param('idSector') idSector: string) {
    return await this.datosService.datos(idIndicador, idSector)
  }*/
}

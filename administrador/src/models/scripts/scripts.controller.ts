import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, Render, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { ScriptsService } from './scripts.service';
import { Script } from './script.schema'


/**
 * 
 */
@Controller('script')
export class ScriptsController {
  constructor(private scriptService: ScriptsService) { }

  /**
   * 
   * @returns 
   */
  @Get()
  async getScripts() {
    return await this.scriptService.getScriptList();
  }


  /**
   * 
   * @returns 
   */
  @Get('list')
  @Render('scripts/scriptList.hbs')
  async scriptList() {
    console.log('En scriptList');
    try {
      const list = await this.scriptService.getScriptList();
      return { title: 'List of scripts',
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
  async scriptItem(@Param('id') id: string) {
    console.log('Solicitando script ' + id);
    try {
      const item = await this.scriptService.getScript(id);
      return item;
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
  @Render('scripts/scriptEditor.hbs')
  editor(@Param('id') id: string) {
    return { title: 'Editor', script: id };
  }




  /**
   * 
   * @param insertarScript 
   * @param res 
   * @returns 
   */
  @Post()
  //@UseFilters(new HttpExceptionFilterDB)
  async insertarScript(@Body() insertarScript: Script, @Res() res: Response) {

    const { name, content} = insertarScript
    if (insertarScript == undefined) {
      //console.log('es nulo')
      throw new HttpException('No se han enviado datos para guardar.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(name==="") {
      //console.log('no hay code')
      throw new HttpException('Debe asignarle un nombre al dashboard.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(content === "") {
      //console.log('no hay content')
      throw new HttpException('Debe crear un dashboard previamente.', HttpStatus.NOT_IMPLEMENTED);
    }
    try {
      const newObject = await this.scriptService.insertScript(insertarScript);
      return res.send({msg: 'Guardado con exito'});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }



  /**
   * endpoint para actualizar un dashboard
   * @param script 
   * @param res 
   * @returns 
   */
  @Put()
  async actualizarScript(@Body() script: Script, @Res() res: Response) {
    try {
      await this.scriptService.updateScript(script);
      console.log('Script actualizado con éxito.')
      return res.send('ok')

    } catch(error) {
      return res.status(400).send('Script no encontrado.')
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

      await this.scriptService.deleteScript(dashboardId);
      return res.send('Dashboard eliminado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

}

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
export class DatosController{
    constructor(private datosService: DatosService) {}


    
    /**
     * Returns the list of data as JSON 
     * @returns
     */
    @Get()
    async getDatos(){
        return await this.datosService.getDatosList();
    }



    /**
     * Returns a page with the list of datos
     * @returns
     */
    @Get('list')
    @Render('datos/datosList.hbs')
    async datosList(){
        try {
            const list = await this.datosService.getDatosList();
            return { title: 'List of datos', items: list};
        } catch (Error) {
            console.log(Error)
        }
    }



    /**
     * Returnos a detailed view of the datos
     * @param id 
     * @returns 
     */
    @Get('view/:id')
    @Render('datos/datosView.hbs')
    async view(@Param('id') id:string){
        const datos = await this.datosService.getDatos(id);
        return { title: 'View', datos: datos };
    }



    /**
     * Updates datos
     * @param datos 
     * @param res 
     * @returns 
     */
    @Put()
    async updateDatos(@Body() datos: CrearDatosDTO, @Res() res: Response,) {
        try {
            await this.datosService.updateDatos(datos);
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
    async datosItem(@Param('id') id:string) {
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

   @Post()
   async createDatos(@Body() datos:CrearDatosDTO){
    const nuevoDato = await this.datosService.createDatos(datos);
    return { datos : nuevoDato};
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
     * Agrega datos con $addFields
     * @param nuevosDatos 
     * @param res 
     * @returns 
     */
    @Put('addFields')
    async agregarDatos(@Body() nuevosDatos: any[], @Res() res: Response) {
        try {
            await this.datosService.agregarDatos(nuevosDatos);
            console.log('Datos agregados correctamente con $addFields.');
            return res.send('ok');
        } catch (error) {
            console.error('Error al agregar datos con $addFields:', error);
            return res.status(400).send('Error al agregar datos con $addFields.');
        }
    } 
}
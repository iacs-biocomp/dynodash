import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Datos, DatosType } from "./datos.schema";
import { Model } from "mongoose";
import { CrearDatosDTO } from "./datosDTO";

@Injectable()
export class DatosService{
    constructor(
        @InjectModel('Datos') private datosModel: Model<DatosType>,
    ) { }

    /**
     * Inserta un documento Datos en la coleccion Datos
     * @param datosInstance 
     * @returns 
     */
    async insertDatos(
        datosInstance: CrearDatosDTO
    ): Promise<Datos> {

        const {id,indicador,ambito,nivel,distintivo,anno_inicial,anno_final,data} = datosInstance;

        const existingDatos = await this.datosModel.findOne({ id }).exec();
        if (existingDatos) {
            throw new Error("Ya existen datos con este código.");
        }
        const datosToInstert = new this.datosModel({id,indicador,ambito,nivel,distintivo,anno_inicial,anno_final,data});
        return datosToInstert.save()
    }



    /**
     * Retrieve datos from a database for a given code (id)
     * @param id
     * @returns
     */
    async getDatos(id:string): Promise<Datos> {
    const datos = await this.datosModel.findOne({ id: id }).lean();
    return datos;
    }
    

    
    /**
     * Gets list of all datos
     * @returns
     */
    async getDatosList():Promise<Datos[]> {
        return await this.datosModel.find().sort({ id:1 }).lean()
    }



    /**
    * Deletes datos
    * @param id
    * @returns 
    */
    async deleteDatos(id: string) {
      return await this.datosModel.deleteOne({id : id})
    }



   /**
    * Creates datos
    * @param templateData 
    * @returns 
    */
//    async createDatos(templateData: Datos): Promise<Datos> {
//     return await this.datosModel.create(templateData);
//    }
    async createDatos(templateData: Datos): Promise<Datos> {
        const filteredData = templateData.data.map(item => {
            const filteredItem = {};
            Object.keys(item).forEach(key => {
                if (key !== 'values' && item[key] !== undefined) {
                    filteredItem[key] = item[key];
                } else if (key === 'values') {
                    const values = item[key].filter(value => value !== null);
                    if (values.length > 0) {
                        filteredItem[key] = values;
                    }
                }
            });
            return filteredItem;
        });

        const datosToInstert = new this.datosModel({
            id: templateData.id,
            indicador: templateData.indicador,
            ambito: templateData.ambito,
            nivel: templateData.nivel,
            distintivo: templateData.distintivo,
            anno_inicial: templateData.anno_inicial,
            anno_final: templateData.anno_final,
            data: filteredData,
        });

        return datosToInstert.save();
    }



   /**
    * Updates datos
    * @param datos 
    */
   async updateDatos(datos: CrearDatosDTO){
    return await this.datosModel.updateOne({ id : datos.id}, {$set: {
        indicador: datos.indicador,
        ambito: datos.ambito,
        nivel: datos.nivel,
        distintivo: datos.distintivo,
        anno_inicial: datos.anno_inicial,
        anno_final: datos.anno_final,
        data: datos.data
    }});
   }


    /**
     * Agrega datos con $addFields
     * @param nuevosDatos 
     */
    async agregarDatos(nuevosDatos: any[]): Promise<void> {
        try {
            const updateData = {};
            nuevosDatos.forEach(dato => {
                updateData[`nuevosCampos.${dato.titulo}`] = dato.valor;
            });
            await this.datosModel.updateMany({}, {
                $set: updateData
            });
        } catch (error) {
            console.error('Error al agregar datos con $set:', error);
            throw error;
        }
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Datos, DatosType } from './datos.schema';
import { Model } from 'mongoose';
import { CrearDatosDTO } from './datosDTO';
import { InjectClient } from 'nest-mongodb-driver';
import { Db } from 'mongodb';

@Injectable()
export class DatosService {
  constructor(@InjectClient() private readonly db: Db, 
  @InjectModel('Datos') private datosModel: Model<DatosType>) {}


  async findAll() {
    return await this.db
      .collection('datos')
      .find()
      .project({ id: 1, indicador: 1 })
      .toArray();
  }


  /**
   * Retrieve datos from a db for a given code (id)
   * @param id
   * @returns
   */
  async getDatos(id: string) {
    return await this.db.collection('datos').findOne({ id: id });
  }

  /**
   * Gets list of all datos
   * @returns
   */
  async getDatosList(){
    const datosList = await this.db.collection('datos').find().sort({id:1}).toArray();
    return datosList;
  }

  /**
   * Deletes datos
   * @param id
   * @returns
   */
  async deleteDatos(id:string){
    return await this.db.collection('datos').deleteOne({ id:id});
  }

  /**
   * Creates datos
   * @param templateData
   * @returns
   */
  // async createDatos(templateData: Datos): Promise<Datos> {
  //   const filteredData = templateData.data.map((item) => {
  //     const filteredItem = {};
  //     Object.keys(item).forEach((key) => {
  //       if (key !== 'values' && item[key] !== undefined) {
  //         filteredItem[key] = item[key];
  //       } else if (key === 'values') {
  //         const values = item[key].filter((value) => value !== null);
  //         if (values.length > 0) {
  //           filteredItem[key] = values;
  //         }
  //       }
  //     });
  //     return filteredItem;
  //   });

  //   const datosToInstert = new this.datosModel({
  //     id: templateData.id,
  //     indicador: templateData.indicador,
  //     ambito: templateData.ambito,
  //     nivel: templateData.nivel,
  //     distintivo: templateData.distintivo,
  //     anno_inicial: templateData.anno_inicial,
  //     anno_final: templateData.anno_final,
  //     data: filteredData,
  //   });

  //   return datosToInstert.save();
  // }

  /**
   * Updates datos
   * @param datos
   */
  async updateDatos(datos: JSON){
    return await this.db.collection('datos').replaceOne({ id:datos['id']}, datos);
  }



  /**
   * Deletes fields
   * @param camposABorrar
   */
  async borrarDatos(camposABorrar: string[], id: string) {
    const unsetDatos = {};
    camposABorrar.forEach((campo) => {
      unsetDatos[campo] = 1;
    });
    await this.db.collection('datos').updateOne({ id: id }, { $unset: unsetDatos });
  }



  /**
   * Duplicates datos
   * @param id 
   * @returns 
   */
  async duplicateAndSaveDatos(id: string): Promise<Datos> {
    try {
      const datoToDuplicate = await this.db.collection('datos').findOne({ id: id });

      if (!datoToDuplicate) {
        throw new NotFoundException('Dato no encontrado');
      }

      const duplicatedDato = new this.datosModel(datoToDuplicate); // Puedes usar directamente el objeto
      duplicatedDato.indicador = `${datoToDuplicate.indicador} (copia)`;
      duplicatedDato.id = `${datoToDuplicate.id} (copia)`;
      duplicatedDato._id = null;
      const savedDatos = await duplicatedDato.save();

      return savedDatos;
    } catch (error) {
      console.error('Error al duplicar y guardar el dato:', error);
      
      throw new Error('Error al duplicar y guardar el dato; ');
    }
  }
}

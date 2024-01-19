import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Datos, DatosType } from './datos.schema';
import { Model } from 'mongoose';
import { CrearDatosDTO } from './datosDTO';
import { InjectClient } from 'nest-mongodb-driver';
import { Db, ObjectId } from 'mongodb';

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
  async createDatos(datos){

    const id = datos['id'];

    // Verificar si ya existe un dato con el mismo id
    const collection = this.db.collection('datos');
    const existingDato = await collection.findOne({ id });

    if (existingDato) {
        throw new Error('Ya existe un dato con ese ID.');
    }

    try {
      await collection.insertOne(datos);
    } catch (error) {
      throw new Error(`Error al crear datos: ${error.message}`);
    }
  }



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
  async borrarCampos(camposABorrar: string[], id: string){
    const unsetDatos = {};
    camposABorrar.forEach((campo) => {
      unsetDatos[campo] = 1;
    });
    
    await this.db.collection('datos').updateOne({ "id": id }, { $unset: unsetDatos });
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

      const duplicatedDato = new this.datosModel(datoToDuplicate);
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

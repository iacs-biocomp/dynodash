import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AggLevelType, DatoType, IndicadorType, LeyendaType } from './schemas';

@Injectable()
export class DatosService {

  constructor(
    @InjectModel('Dato') private datoModel: Model<DatoType>,
    @InjectModel('Leyenda') private leyendaModel: Model<LeyendaType>,
    @InjectModel('Indicador') private indicadorModel: Model<IndicadorType>,
    @InjectModel('AggLevel') private aggLevelModel: Model<AggLevelType>,
  ) { }

  async insertarDatos(datos: any): Promise<any> {

    //console.log(datos)

    const datoInsertado = new this.datoModel(datos);
    return datoInsertado.save();
    //const promises = datos.map(element => {
    //  const datoInsertado = new this.datoModel(element);
    //  return datoInsertado.save();
    //});

    //return Promise.all(promises);
  }

  async insertarIndicadores(indicadores: any): Promise<any> {
    const promises = indicadores.map(element => {
      const indicadorInsertado = new this.indicadorModel(element);
      return indicadorInsertado.save();
    });

    return Promise.all(promises);
  }

  async insertarLeyendas(leyendas: any): Promise<any> {

    const leyendaInsertada = new this.leyendaModel(leyendas);
    return leyendaInsertada.save();
    /*const promises = leyendas.map(element => {
      const leyendaInsertada = new this.leyendaModel(element);
      return leyendaInsertada.save();
    });

    return Promise.all(promises);*/
  }

  async insertarAggLevel(aggLevel: any): Promise<any> {
    const promises = aggLevel.map(element => {
      const aggLevelInsertada = new this.aggLevelModel(element);
      return aggLevelInsertada.save();
    });

    return Promise.all(promises);
  }

  /**
* Metodo para hacer la llamada a la coleccion Escalas que contiene todos los datos sobre los niveles de agregación
* @returns Devuelve los niveles de agregación
*/
  async obtenerAggLevel(idAggLevel: string): Promise<AggLevelType> {

    try {

      const aggLevels = await this.aggLevelModel.findOne({ id: idAggLevel })
      return aggLevels

    } catch (error) {
      console.log('Datos no encontrados', error)
    }

  }

  /**
   * Metodo para hacer la llamada a la coleccion Indicadores que contiene todos los datos sobre los indicadores
   * @returns Devuelve los indicadores
   */
  async obtenerIndicadores(idIndicador: string): Promise<IndicadorType[]> {

    try {

      const indicadores = await this.indicadorModel.find({ id: idIndicador })

      return indicadores;

    } catch (error) {
      console.log('fallo en get indicadores', error)
    }
  }

  /**
 * Metodo para hacer la llamada a la coleccion Datos que contiene todos los datos de las zonas básicas de salud y áreas sanitarias
 * @returns Devuelve los datos
 */
  async obtnerDatos(idDato: string): Promise<any> {

    try {

      const datos = await this.datoModel.find({ id: idDato })

      return datos

    } catch (error) {
      console.log('fallo en get datos', error)
    }
  }

  /**
 * Metodo para hacer la llamada a la coleccion Leyendas que contiene todos los datos sobre las leyendas
 * @returns Devuelve las leyendas
 */
  async obtenerLeyenda(idLeyenda: string): Promise<any> {

    try {

      const leyenda = await this.leyendaModel.findOne({ id: idLeyenda })

      return leyenda

    } catch (error) {
      console.log('fallo en get leyenda', error)
    }
  }

  /**
   * Método para obetener el perfil de desempeño de los sectores.
   */
  async obtenerPerfil(idIndicador: string, payload: any): Promise<any> {
    //console.log('indicador', idIndicador);
    //console.log('cuerpo', payload.query.sectores);
    let idSectores = payload.query.sectores;

    try {
      const perfil = await this.datoModel.aggregate([
        { $match: { id: idIndicador } }, // Reemplaza "85" con el valor deseado de ID
        {
          $project: {
            _id: 0,
            data: {
              $filter: {
                input: "$data",
                as: "item",
                cond: {
                  $or: [
                    { $in: ["$$item.code_as", idSectores] },
                    { $in: ["$$item.code_zbs", idSectores] }
                  ]
                }
              }
            }
          }
        }
      ])
      

      return perfil;
    } catch (error) {
      console.log('error al obtener el perfil', error);
      throw error; // Rethrow the error to handle it at a higher level if needed
    }
  }


}

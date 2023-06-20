import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Indicador es una interfaz de documento.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un documento de la colección Indicadores.
 *
 * Esto permite la definicion de variables de tipo Indicador.
 */

export type IndicadorType = HydratedDocument<Indicador>;

@Schema({ strict: false })
export class Indicador {

  @Prop({ required: true })
  id: string;

}

/**
 * Este esquema se asigna a la colección Indicadores y define la forma de los documentos dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer documentos de la base de datos MongoDB subyacente.
 */

export const IndicadorSchema = SchemaFactory.createForClass(Indicador);
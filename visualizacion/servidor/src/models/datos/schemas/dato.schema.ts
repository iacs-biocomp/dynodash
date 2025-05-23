import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Dato es una interfaz de documento.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un documento de la colección Datos.
 *
 * Esto permite la definicion de variables de tipo Dato.
 */

export type DatoType = HydratedDocument<Dato>;

@Schema({ strict: false })
export class Dato {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  indicador: string;
}

/**
 * Este esquema se asigna a la colección Datos y define la forma de los documentos dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer documentos de la base de datos MongoDB subyacente.
 */

export const DatoSchema = SchemaFactory.createForClass(Dato);

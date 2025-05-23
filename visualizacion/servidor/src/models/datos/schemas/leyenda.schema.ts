import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Leyenda es una interfaz de documento.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un documento de la colección Leyendas.
 *
 * Esto permite la definicion de variables de tipo Leyenda.
 */

export type LeyendaType = HydratedDocument<Leyenda>;

@Schema({ strict: false })
export class Leyenda {
  @Prop({ required: true })
  id: string;
}

/**
 * Este esquema se asigna a la colección Leyendas y define la forma de los documentos dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer documentos de la base de datos MongoDB subyacente.
 */

export const LeyendaSchema = SchemaFactory.createForClass(Leyenda);

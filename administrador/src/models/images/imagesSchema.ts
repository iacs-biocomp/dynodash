import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * ImageType es una interfaz de documento.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un documento de la colección Images.
 *
 * Esto permite la definicion de variables de tipo Image.
 */

export type ImageType = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop()
  format: string;

  @Prop()
  type: string;
}

/**
 * Este esquema se asigna a la colección Images y define la forma de los documentos dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer documentos de la base de datos MongoDB subyacente.
 */

export const ImageSchema = SchemaFactory.createForClass(Image);

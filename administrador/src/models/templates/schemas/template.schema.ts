import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Template es una interfaz de Template.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un Template de la colección Templates.
 *
 * Esto permite la definicion de variables de tipo Template.
 */

export type TemplateType = HydratedDocument<Template>;

@Schema()
export class Template {
  @Prop()
  code: string;

  @Prop()
  content: string;
}

/**
 * Este esquema se asigna a la colección Templates y define la forma de los Templates dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer Templates de la base de datos MongoDB subyacente.
 */

export const TemplateSchema = SchemaFactory.createForClass(Template);

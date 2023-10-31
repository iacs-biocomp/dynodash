import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Template es una interfaz de Script.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un Script de la colección Scripts.
 *
 * Esto permite la definicion de variables de tipo Script.
 */

export type WidgetType = HydratedDocument<Widget>;

@Schema()
export class Widget {
  @Prop()
  name: string;

  @Prop()
  template: string;

  @Prop()
  description: string;

  @Prop()
  js: string;
}

/**
 * Este esquema se asigna a la colección Script y define la forma de los Scripts dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer Scripts de la base de datos MongoDB subyacente.
 */

export const WidgetSchema = SchemaFactory.createForClass(Widget);

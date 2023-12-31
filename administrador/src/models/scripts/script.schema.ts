import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Template es una interfaz de Script.
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un Script de la colección Scripts.
 *
 * Esto permite la definicion de variables de tipo Script.
 */

export type ScriptType = HydratedDocument<Script>;

@Schema()
export class Script {
  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop()
  description: string;
}

/**
 * Este esquema se asigna a la colección Script y define la forma de los Scripts dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer Scripts de la base de datos MongoDB subyacente.
 */

export const ScriptSchema = SchemaFactory.createForClass(Script);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Script es una interfaz de Script..
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un Script de la colección Scripts.
 *
 * Esto permite la definicion de variables de tipo Script.
 */

export type ScriptType = HydratedDocument<Script>;

@Schema({ strict: false })
export class Script {
  @Prop({ required: true })
  name: string;

  @Prop()
  content: string;
}

/**
 * Este esquema se asigna a la colección Scripts y define la forma de los Scripts dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer Scripts de la base de datos MongoDB subyacente.
 */

export const ScriptSchema = SchemaFactory.createForClass(Script);

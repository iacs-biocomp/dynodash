import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DatosType = HydratedDocument<Datos>;

@Schema()
export class Datos {
  @Prop()
  id: string;

  @Prop()
  indicador: string;

  @Prop()
  ambito: string;

  @Prop()
  nivel: string;

  @Prop()
  distintivo: string;

  @Prop({ type: Date })
  anno_inicial: Date;

  @Prop({ type: Date })
  anno_final: Date;

  // @Prop({ type: [{ code_as: String, code_zbs: String, name: String, value: Number, values: Array }] })
  // data: Array<{ code_as: string; code_zbs: string; name: string; value: number; values: {}[] }>;
  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({ type: Object, default: {} })
  nuevosCampos: Record<string, any>;
}

export const DatosSchema = SchemaFactory.createForClass(Datos);

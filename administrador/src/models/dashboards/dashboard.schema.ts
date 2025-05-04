import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Dashboard es una interfaz de documento..
 *
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un documento de la colección Dashboards.
 *
 * Esto permite la definicion de variables de tipo Dashboard.
 */

export type DashboardType = HydratedDocument<Dashboard>;

@Schema()
export class Dashboard {
  @Prop()
  id_dashboard: string;

  @Prop()
  code: string;

  @Prop()
  template: string;

  @Prop()
  grant: string;

  @Prop()
  created_by: string;

  @Prop()
  creation_date: Date;

  @Prop()
  last_update: Date;

  @Prop([
    raw({
      frame: { type: Number },
      order: { type: Number },
      type: { type: String },
      url: { type: String },
      doc: { type: String },
      grant: { type: String },
      title: { type: String },
      info: { type: String },
      label: { type: String },      
      js: { type: String },
    }),
  ])
  widgets: Record<string, any>[];
}

/**
 * Este esquema se asigna a la colección Dashboards y define la forma de los documentos dentro de esa colección.
 *
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer documentos de la base de datos MongoDB subyacente.
 */

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);

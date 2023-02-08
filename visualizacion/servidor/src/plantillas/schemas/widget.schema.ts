import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


/**
 * Widget es una interfaz de Widget.
 * 
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un Widget de la colección Widgets.
 * 
 * Esto permite la definicion de variables de tipo Widget.
 */


export type WidgetType = HydratedDocument<Widget>;




@Schema()
export class Widget {

    @Prop()
    type : string;

    @Prop()
    descripcion: string;

    @Prop()
    template: string;

    @Prop()
    js: string;
}

/**
 * Este esquema se asigna a la colección Widgets y define la forma de los Widgets dentro de esa colección. 
 * 
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer Widgets de la base de datos MongoDB subyacente.
 */

export const WidgetSchema = SchemaFactory.createForClass(Widget);
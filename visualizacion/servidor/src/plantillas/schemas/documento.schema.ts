import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


/**
 * Document es una interfaz de documento.
 * 
 * Permite la creación de un tipo heterogeneo de varible con las propiedades de un documento de la colección Documents.
 * 
 * Esto permite la definicion de variables de tipo Document.
 */


export type DocumentoType = HydratedDocument<Documento>;



@Schema()
export class Documento {

    @Prop()
    code: number

    @Prop()
    content: string;
}

/**
 * Este esquema se asigna a la colección Documents y define la forma de los documentos dentro de esa colección. 
 * 
 * Los esquemas se utilizan para definir modelos. Los modelos son responsables de crear y leer documentos de la base de datos MongoDB subyacente.
 */

export const DocumentoSchema = SchemaFactory.createForClass(Documento);

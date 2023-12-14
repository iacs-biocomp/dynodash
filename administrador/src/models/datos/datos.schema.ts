import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DatosType = HydratedDocument<Datos>;

@Schema()
export class Datos{
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
    
<<<<<<< HEAD
    // @Prop({ type: [{ code_as: String, code_zbs: String, name: String, value: Number, values: Array }] })
    // data: Array<{ code_as: string; code_zbs: string; name: string; value: number; values: {}[] }>;
    @Prop({ type: Object })
    data: Record<string, any>;
=======
    @Prop({ type: [{ code: String, value: Number, name: String, values:Array }] })
    data: Array<{ code: string; value: number; name:string, values:{}[] }>;
>>>>>>> f340cbcfb485d6869d0cc745124ef010f1d406a2

    @Prop({ type: Object, default: {} })
    nuevosCampos: Record<string, any>;
}

export const DatosSchema = SchemaFactory.createForClass(Datos);
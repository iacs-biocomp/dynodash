
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlantillaType = HydratedDocument<Plantilla>;

@Schema()
export class Plantilla {

    @Prop()
    _name: string;

    @Prop()
    _html: string;
}

export const PlantillaSchema = SchemaFactory.createForClass(Plantilla);
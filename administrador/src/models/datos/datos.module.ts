import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatosController } from "./datos.controller";
import { DatosService } from "./datos.service";
import { DatosSchema } from './datos.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Datos', schema: DatosSchema},
        ]),
    ],
    controllers: [DatosController],
    providers: [DatosService],
    exports: [DatosService],
})
export class DatosModule{}
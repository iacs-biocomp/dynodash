import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatosController } from './datos.controller';
import { DatosService } from './datos.service';
import { AggLevelSchema, DatoSchema, IndicadorSchema, LeyendaSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dato', schema: DatoSchema },
      { name: 'Leyenda', schema: LeyendaSchema },
      { name: 'Indicador', schema: IndicadorSchema },
      { name: 'AggLevel', schema: AggLevelSchema}
    ]),
  ],
  controllers: [DatosController],
  providers: [DatosService]
})
export class DatosModule {}

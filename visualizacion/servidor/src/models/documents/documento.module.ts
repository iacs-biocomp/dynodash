import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentoSchema } from './documento.schema';
import { DocumentoService } from './documento.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Documento', schema: DocumentoSchema }
    ]),
  ],
  providers: [DocumentoService],
  exports: [DocumentoService]
})
export class DocumentoModule {}

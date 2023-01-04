import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { templateSchema } from "./schemas/template.schema";

@Module({ 
  imports: [MongooseModule.forFeature([{name: 'Template', schema: templateSchema}])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}

import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widget.controller'
import { WidgetSchema } from './widget.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesModule } from '../templates/templates.module';
import { ScriptsModule } from '../scripts/scripts.module';

import { TemplateSchema } from '../templates/template.schema';
import { ScriptSchema } from '../scripts/script.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Widget', schema: WidgetSchema },
            { name: 'Template', schema: TemplateSchema },
            { name: 'Script', schema: ScriptSchema }
          ]), 
        TemplatesModule,
        ScriptsModule       
    ],
    controllers: [WidgetsController],
    providers: [WidgetsService],
})
export class WidgetsModule {}
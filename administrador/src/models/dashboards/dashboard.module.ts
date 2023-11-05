import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboard.service';
import { DashboardsController } from './dashboards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardSchema } from './dashboard.schema';
import { TemplatesService } from '../templates/templates.service';
import { TemplateSchema } from '../templates/template.schema';
import { ScriptsService } from '../scripts/scripts.service';
import { ScriptSchema } from '../scripts/script.schema';
import { WidgetsService } from '../widgets/widgets.service';
import { WidgetSchema } from '../widgets/widget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dashboard', schema: DashboardSchema },
      { name: 'Template', schema: TemplateSchema },
      { name: 'Script', schema: ScriptSchema },
      { name: 'Widget', schema: WidgetSchema }
    ]),
  ],
  controllers: [DashboardsController],
  providers: [DashboardsService, TemplatesService, ScriptsService, WidgetsService],
  exports: [DashboardsService]
})
export class DashboardsModule {}
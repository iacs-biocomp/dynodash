import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from 'src/app.service';
import { DashboardSchema } from './schemas/dashboard.schema';
import { ScriptSchema } from '../scripts/script.schema';
import { TemplateSchema } from '../template/template.schema';
import { WidgetSchema } from '../widgets/widget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dashboard', schema: DashboardSchema },
      { name: 'Script', schema: ScriptSchema },
      { name: 'Template', schema: TemplateSchema },
      { name: 'Widget', schema: WidgetSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}

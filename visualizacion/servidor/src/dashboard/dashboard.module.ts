import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { MongooseModule } from '@nestjs/mongoose';
import {
  DashboardSchema,
  ScriptSchema,
  TemplateSchema,
  WidgetSchema,
} from './schemas';
import { AppService } from 'src/app.service';

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
  providers: [DashboardService, AppService],
})
export class DashboardModule {}

import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboard.service';
import { DashboardsController } from './dashboards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardSchema } from './dashboard.schema';
import { TemplatesService } from '../templates/templates.service';
import { TemplateSchema } from '../templates/template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dashboard', schema: DashboardSchema },
      { name: 'Template', schema: TemplateSchema },
    ]),
  ],
  controllers: [DashboardsController],
  providers: [DashboardsService, TemplatesService],
  exports: [DashboardsService]
})
export class DashboardsModule {}
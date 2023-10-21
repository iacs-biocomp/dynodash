import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widget.controller'
import { MongooseModule } from '@nestjs/mongoose';
import { WidgetSchema } from './widget.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Widget', schema: WidgetSchema },
          ]),        
    ],
    controllers: [WidgetsController],
    providers: [WidgetsService],
})
export class WidgetsModule {}
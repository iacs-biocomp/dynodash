import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller'
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptSchema } from './script.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Script', schema: ScriptSchema },
          ]),        
    ],
    controllers: [ScriptsController],
    providers: [ScriptsService],
    exports: [ScriptsService]
})
export class ScriptsModule {}
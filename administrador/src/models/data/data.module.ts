import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongoDbDriverModule } from 'nest-mongodb-driver';

@Module({
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
  LocalStrategy,
} from './strategies';
import { UsersModule } from '../models/users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
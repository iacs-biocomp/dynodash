import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
  LocalStrategy,
  JwtStrategy 
} from './strategies';
import { UsersModule } from '../models/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants/jwtConstant';
import { IdGuard } from 'src/gards/ID.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, IdGuard],
  exports: [AuthService],
})
export class AuthModule {}
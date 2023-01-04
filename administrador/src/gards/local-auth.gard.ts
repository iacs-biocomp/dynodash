import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/strategies';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
}
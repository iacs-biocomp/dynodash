import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUserByPass(username, password);
    if (!user) {
      console.log('Usuario incorrecto');
      throw new HttpException('Usuario no logeado', HttpStatus.UNAUTHORIZED);
    }
    console.log(user);
    return user;
  }
}

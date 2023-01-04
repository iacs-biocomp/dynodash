import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../common/constants/jwtConstant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //look what is the difference between true and false
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = { userId: payload.sub, username: payload.username };
    console.log(user);
    return user;
  }
}
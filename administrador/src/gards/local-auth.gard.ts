import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class AthenticatedSession implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();
    const autorizado = req.session.get('authenticated');
    const estadoSession = req.session.deleted;
    if (!autorizado) {
      console.log('Usuario no logeado');
      throw new HttpException('Usuario no logeado', HttpStatus.UNAUTHORIZED);
    } else if (estadoSession) {
      console.log('Usuario no logeado');
      throw new HttpException('Usuario no logeado', HttpStatus.UNAUTHORIZED);
    } else {
      return req.session.user;
    }
  }
}

@Injectable()
export class DeletedSession implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const sessionDeleted = req.session.deleted;

    if (sessionDeleted) {
      console.log('Session deleted.');
      throw new HttpException('Usuario no logeado', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}

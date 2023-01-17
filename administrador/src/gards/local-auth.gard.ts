import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LocalStrategy } from 'src/auth/strategies';
import { HttpExceptionFilter } from 'src/common/exceptionFilters/globalFilterExpress';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
}

@Injectable()
export class AthenticatedSession implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const autorizado = req.session.get('authenticated');
        const estadoSession = req.session.deleted;
        if(!autorizado) {
            console.log('Usuario no logeado')
            throw new HttpException('Usuario no logeado', HttpStatus.UNAUTHORIZED);
        }else if( estadoSession ) {
            console.log('Usuario no logeado')
            throw new HttpException('Usuario no logeado', HttpStatus.UNAUTHORIZED);
        }
         else {
            
            return req.session.user;
        }
        
    }

}
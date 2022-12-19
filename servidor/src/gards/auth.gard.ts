import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGard implements CanActivate {

    private readonly logger = new Logger(AuthGard.name);

    canActivate(
        context: ExecutionContext
        ): boolean | Promise<boolean> | Observable<boolean> {

        this.logger.log(AuthGard.name);
        
        const request = context.switchToHttp().getRequest();
        console.log(request.body);
        const { nombre, rol } = request.body;
        if(rol === "ADMIN_ROL") {
            return true;
        } else {
            return false;
        }
    }
}
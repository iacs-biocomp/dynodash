import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class IdGuard {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        
        const arg = context.getArgs()
        console.log(arg);

        throw new Error("Method not implemented.");
        
    }

    async validateUserById(payload : any) {
        const {userId, username} = payload;
        console.log(userId);
    }

}
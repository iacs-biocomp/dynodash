import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RequestService } from "src/request.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    //optional, just to show the middleware is used for the log in
    private readonly logger = new Logger(AuthMiddleware.name);

    constructor(private readonly requestService : RequestService) {}

    use(req: Request, res: Response, next: NextFunction) {

        //this.logger.log(AuthMiddleware.name);
        
        const nombre =req.body.nombre;

        this.requestService.setName(nombre);

        console.log(nombre);

        next();
    }
}
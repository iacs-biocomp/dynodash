import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";
import { ReplyDefault } from "fastify/types/utils";
import  fs  from "fs";
import { join } from "path";

@Catch()
export class FastifyExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const reply : FastifyReply<any> = ctx.getResponse<FastifyReply>()
        const status : number = exception.getStatus();
        console.log(status)
        if(status === 401) {
            return reply.status(status).send({message:`<h1>Hola</h1>`});
        }
        
    }
    
}
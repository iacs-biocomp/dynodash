import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { FastifyReply } from "fastify";
import { join } from 'path';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response |void {
    console.log('HttpExceptionFilter');
    console.log(join(__dirname, '..','..','..','public/error401.html'))
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status: number = exception.getStatus();
    
    //400 Bad Request: Server didn't understand the URL you gave it.
    if(status == 400) {
        console.log(join('400 Bad Request'))
      response.sendFile('error400.html');
    }

    //401 Unauthorized: Must be authenticated
    if( status == 401) {
        console.log(join('401 Unauthorized'))
      response.sendFile('error401.html');
    }

    //403 Forbidden: Server refuses to give you a file, authentication won't help
    if( status == 403 ) {
        console.log(join('403 Forbidden'))
        response.sendFile(join(__dirname, '..','..','..', 'public/error403.html'))
    }

    //404 Not Found: A file doesn't exist at that address
    if( status == 404 ) {
        console.log(join('404 Not Found'))
        response.sendFile(join(__dirname, '..','..','..', 'public/error404.html'))
    }
    /*return response.status(status).json({
      filter: 'HttpExceptionFilter',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });*/
  }
}
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Render, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { FastifyReply } from "fastify";
import { ServerResponse } from 'node:http';
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
    if(status == HttpStatus.BAD_REQUEST) {
        console.log(join('400 Bad Request'))
        response.redirect('/error400')
    }

    //401 Unauthorized: Must be authenticated
    if( status === HttpStatus.UNAUTHORIZED) {
        console.log(join('401 Unauthorized'))
        response.redirect('/error401')
    }

    //403 Forbidden: Server refuses to give you a file, authentication won't help
    if( status == 403 ) {
        console.log(join('403 Forbidden'))
        response.redirect('/error403')
    }

    //404 Not Found: A file doesn't exist at that address
    if( status == 404 ) {
        console.log(join('404 Not Found'))
        response.redirect('/error404')
    }
    /*return response.status(status).json({
      filter: 'HttpExceptionFilter',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });*/
  }
}
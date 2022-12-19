import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { join } from 'path';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    console.log('HttpExceptionFilter');

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status: number = exception.getStatus();
    
    if(status == 400) {

      response.sendFile(join(__dirname, '..', 'public/error400.html'))
    }

    if( status == 401) {
      response.sendFile(join(__dirname, '..', 'public/error403.html'))
    }

    /*response.status(status).json({
      filter: 'HttpExceptionFilter',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });*/
  }
}
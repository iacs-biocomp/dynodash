import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { join } from 'path';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response | void {
    console.log('HttpExceptionFilter');
    console.log(join(__dirname, '..', '..', '..', 'public/error401.html'));
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status: number = exception.getStatus();

    //400 Bad Request: Server didn't understand the URL you gave it.
    if (status == HttpStatus.BAD_REQUEST) {
      console.log(join('400 Bad Request'));
      response.status(status).redirect('/error400');
    }

    //401 Unauthorized: Must be authenticated
    if (status === HttpStatus.UNAUTHORIZED) {
      console.log(join('401 Unauthorized'));
      response.status(status).redirect('/error401');
    }

    //403 Forbidden: Server refuses to give you a file, authentication won't help
    if (status == 403) {
      console.log(join('403 Forbidden'));
      response.status(status).redirect('/error403');
    }

    //404 Not Found: A file doesn't exist at that address
    if (status == 404) {
      console.log(join('404 Not Found'));
      response.status(status).redirect('/error404');
    }
    /*return response.status(status).json({
      filter: 'HttpExceptionFilter',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });*/
  }
}

/*export class HttpExceptionFilterDB implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response | void {
    console.log('HttpExceptionFilterDB');
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status: number = exception.getStatus();

    if(status == 204) {
      console.log(exception.message)
      throw new HttpException({
        status: status,
        error: exception.message,
      }, HttpStatus.NOT_IMPLEMENTED, {
        cause: exception
      });
    }

    if(status == 409) {
      return response.send({'msg' :exception.message})
    }
  }

}*/

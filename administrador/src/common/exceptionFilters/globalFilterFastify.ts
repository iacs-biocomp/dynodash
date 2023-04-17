import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class FastifyExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply: FastifyReply<any> = ctx.getResponse<FastifyReply>();
    const status: number = exception.getStatus();
    console.log(status);
    if (status === 401) {
      return reply.status(status).send({ message: `<h1>Hola</h1>` });
    }
  }
}

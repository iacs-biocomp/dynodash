import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction,  } from 'express';

@Injectable()
export class errorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware')
    console.log(res.statusCode)
    if(res.statusCode == 401) {
        return res.render('error401')
    }
    next(); 
  }
}
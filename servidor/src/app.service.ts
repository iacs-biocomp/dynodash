import { Injectable, Logger, ArgumentsHost } from '@nestjs/common';
import { response } from 'express';
import { RequestService } from './request.service';
import {join } from 'path';




@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly requestService : RequestService) {}

  getHello() {
  }

}

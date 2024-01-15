import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectClient } from 'nest-mongodb-driver';
import { Db, ObjectId } from 'mongodb';

@Injectable()
export class DataService {
  constructor(@InjectClient() private readonly db: Db) {}

  async findAll() {
    return await this.db
      .collection('datos')
      .find()
      .project({ id: 1, indicador: 1 })
      .toArray();
  }

  /**
   * Retrieve datos from a database for a given code (id)
   * @param id
   * @returns
   */
  async getDatos(id: string) {
    return await this.db.collection('datos').findOne({ id: id });
  }

  /**
   * Retrieve datos from a database for a given code (id)
   * @param id
   * @returns
   */
  async updateDatos(datos: JSON) {
    return await this.db.collection('datos').replaceOne({ id: datos['id'] }, datos);
  }
}

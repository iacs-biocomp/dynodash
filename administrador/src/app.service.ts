import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { Image, ImageType } from './models/images/imagesSchema';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Image') private imageModel: Model<ImageType>) {}

  /**
   * Función que guarda la imagen en base de datos en formato base64.
   * @param request
   * @returns boolean
   */
  async insertarImagen(request): Promise<Image> {
    const { name, type } = request.body;
    const path = join(__dirname, '..', `public/images/${name}.png`);
    const imagen = fs.readFileSync(path);
    const base64data = Buffer.from(imagen).toString('base64');
    const imageFormat = {
      name: name,
      content: base64data,
      format: 'image/png',
      type: type
    };
    const imagenInsertada = new this.imageModel(imageFormat);
    return imagenInsertada.save();
  }

  /**
   * Función que devuelve todas las imágenes contenidas en la base de datos
   * @returns Promise<ImageType[]>
   */
  async obtenerImages(): Promise<ImageType[]> {
    const imagenes = await this.imageModel.find();
    return imagenes;
  }
}

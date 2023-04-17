import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

import { Error, Model } from 'mongoose';
import { CrearTemplateDTO } from './dto';
import { DashboardType, Template, TemplateType } from './schemas';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Dashboard') private dashboardModel: Model<DashboardType>,
    @InjectModel('Template') private templateModel: Model<TemplateType>,
  ) { }

  /**
   * Esta funcion inserta un documento Template en la coleccion Templates
   *
   * @param insertarTemplate
   * @returns
   */
  async insertarTemplate(
    insertarTemplate: CrearTemplateDTO
  ): Promise<Template> {

    const { code, content} = insertarTemplate

    //Comprobar que el code no existe
    const existingTemplate = await this.templateModel.findOne({ code }).exec();
    if (existingTemplate) {
      throw new Error('Ya existe un dashboard con ese nombre.');
    }
    const contentBase64 = Buffer.from(content).toString('base64');
    const templateInsertado = new this.templateModel({ code, content : contentBase64 });
    return templateInsertado.save();
  }

  async obtenerDashboard(id: string): Promise<string> {
    //const { template } = await this.dashboardModel.findById(id);
    const { content } = await this.templateModel.findOne({ code: id }).exec();
    const html = Buffer.from(content, 'base64').toString('utf-8');
    return html;
  }

  async actulizarDashboard(nameDashboard : string, template: CrearTemplateDTO) {
    const {content} = template
    const contentBase64 = Buffer.from(content).toString('base64');
    return await this.templateModel.updateOne({code : nameDashboard}, {$set : {content: contentBase64}})
  }

  async eliminarDashboard(nameDashboard: string) {
    return await this.templateModel.deleteOne({code : nameDashboard})
  }
}

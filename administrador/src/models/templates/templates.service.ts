import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//import { Response } from 'express';
import { Error, Model } from 'mongoose';
import { CrearTemplateDTO } from './dto';
import { Template, TemplateType } from './schemas';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Template') private templateModel: Model<TemplateType>,
  ) { }

  
  /**
   * Esta funcion inserta un documento Template en la coleccion Templates
   *
   * @param template
   * @returns
   */
  async insertTemplate(
    templateInstance: CrearTemplateDTO
  ): Promise<Template> {

    const { code, content, description } = templateInstance;

    //Comprobar que el code no existe
    const existingTemplate = await this.templateModel.findOne({ code }).exec();
    if (existingTemplate) {
      throw new Error('Ya existe un template con ese código.');
    }
    const contentBase64 = Buffer.from(content).toString('base64');
    const templateToinsert = new this.templateModel({ code, content : contentBase64, description });
    return templateToinsert.save();
  }


  /**
   * Retrieve a template from database for a given code (id)
   * @param id 
   * @returns 
   */
  async getTemplate(id: string): Promise<Template> {
    const { code, content, description } = await this.templateModel.findOne({ code: id }).exec();
    const html = Buffer.from(content, 'base64').toString('utf-8');
    return { code, content: html, description };
  }

  
  
  /**
   * Updates template's content
   * @param template 
   * @returns 
   */
  async updateTemplate(template: CrearTemplateDTO) {
    const contentBase64 = Buffer.from(template.content).toString('base64');
    return await this.templateModel.updateOne({code : template.code}, {$set : {content: contentBase64, 
                                                                               description: template.description}});
  }


  /**
   * Deletes a template
   * @param id code of the template to delete
   * @returns 
   */
  async deleteTemplate(id: string) {
    return await this.templateModel.deleteOne({code : id})
  }

  
  /**
   * Gets the list of all templates
   * @returns 
   */
  async getTemplateList(): Promise<Template[]> {
    return await this.templateModel.find().lean()
  }
}

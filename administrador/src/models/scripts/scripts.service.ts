import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//import { Response } from 'express';
import { Error, Model } from 'mongoose';
import { Script, ScriptType } from './script.schema';

@Injectable()
export class ScriptsService {
  constructor(
    @InjectModel('Script') private scriptModel: Model<ScriptType>,
  ) { }

  
  /**
   * Esta funcion inserta un documento script en la coleccion scripts
   *
   * @param script
   * @returns
   */
  async insertScript(scriptInstance: Script): Promise<Script> {

    const { name, content, description } = scriptInstance;

    //Comprobar que el code no existe
    const existingScript = await this.scriptModel.findOne({ name }).exec();
    if (existingScript) {
      throw new Error('Ya existe un script con ese código.');
    }
    const contentBase64 = Buffer.from(content).toString('base64');
    scriptInstance.content = contentBase64;
    //const scriptToinsert = new this.scriptModel({ name, content : contentBase64, description });
    const scriptToinsert = new this.scriptModel(scriptInstance);
    return scriptToinsert.save();
  }


  /**
   * Retrieve a script from database for a given code (id)
   * @param id 
   * @returns 
   */
  async getScript(id: string): Promise<Script> {
    var scriptInstance = await this.scriptModel.findOne({ name: id }).exec();
    const html = Buffer.from(scriptInstance.content, 'base64').toString('utf-8');
    scriptInstance.content = html;
    return scriptInstance;
  }

  
  
  /**
   * Updates script's content
   * @param script 
   * @returns 
   */
  async updateScript(scriptInstance: Script) {
    const contentBase64 = Buffer.from(scriptInstance.content).toString('base64');
    return await this.scriptModel.updateOne({name : scriptInstance.name}, {$set : {content: contentBase64, 
                                                                           description: scriptInstance.description}});
  }


  /**
   * Deletes a script
   * @param id code of the script to delete
   * @returns 
   */
  async deleteScript(id: string) {
    return await this.scriptModel.deleteOne({name : id})
  }

  
  /**
   * Gets the list of all scripts
   * @returns 
   */
  async getScriptList(): Promise<Script[]> {
    return await this.scriptModel.find().lean()
  }
}

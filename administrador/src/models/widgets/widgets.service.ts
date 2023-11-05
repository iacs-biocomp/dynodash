import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//import { Response } from 'express';
import { Error, Model } from 'mongoose';
import { Widget, WidgetType } from './widget.schema';



@Injectable()
export class WidgetsService {
  constructor(
    @InjectModel('Widget') private widgetModel: Model<WidgetType>,
  ) { }

  /**
   * Esta funcion inserta un documento widget en la coleccion widgets
   *
   * @param widget
   * @returns
   */
  async insertWidget(widgetInstance: Widget): Promise<Widget> {

    //Comprobar que el code no existe
    const existingWidget = await this.widgetModel.findOne({ name: widgetInstance.name }).exec();
    if (existingWidget) {
      throw new Error('Ya existe un widget con ese código.');
    }
    const widgetToinsert = new this.widgetModel(widgetInstance);
    return widgetToinsert.save();
  }


  /**
   * Retrieve a widget from database for a given code (id)
   * @param id 
   * @returns 
   */
  async getWidget(id: string): Promise<Widget> {
    var widgetInstance = await this.widgetModel.findOne({ name: id }).lean();
    return widgetInstance;
  }

  
  
  /**
   * Updates widget's content
   * @param widget 
   * @returns 
   */
  async updateWidget(widgetInstance: Widget) {
    console.log(widgetInstance);
    return await this.widgetModel.replaceOne({name : widgetInstance.name}, widgetInstance);
  }


  /**
   * Deletes a widget
   * @param id code of the widget to delete
   * @returns 
   */
  async deleteWidget(id: string) {
    return await this.widgetModel.deleteOne({name : id})
  }

  
  /**
   * Gets the list of all widgets
   * @returns 
   */
  async getWidgetList(): Promise<Widget[]> {
    return await this.widgetModel.find().lean()
  }
}

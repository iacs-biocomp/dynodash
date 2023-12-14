import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//import { Response } from 'express';
import { Error, Model } from 'mongoose';
import { Dashboard, DashboardType } from './dashboard.schema';
import { DashboardWidgetDTO } from './dashboardWidgetDTO';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectModel('Dashboard') private dashboardModel: Model<DashboardType>,
  ) { }

  
  /**
   * Esta funcion inserta un documento Dashboard en la coleccion Dashboards
   *
   * @param dashboard
   * @returns
   */
  async insertDashboard(dashboardInstance: Dashboard): Promise<Dashboard> {
    //Comprobar que el code no existe
    const existingDashboard = await this.dashboardModel.findOne({ code:dashboardInstance.name }).exec();
    if (existingDashboard) {
      throw new Error('Ya existe un dashboard con ese código.');
    }
    const dashboardToinsert = new this.dashboardModel(dashboardInstance);
    return dashboardToinsert.save();
  }


  /**
   * Retrieve a dashboard from database for a given code (id)
   * @param id 
   * @returns 
   */
  async getDashboard(id: string): Promise<Dashboard> {
    const dashboardInstance = await this.dashboardModel.findOne({ name: id }).lean();
    return dashboardInstance;
  }

  
  
  /**
   * Updates dashboard's content
   * @param dashboard 
   * @returns 
   */
  async updateDashboard(dashboardInstance: Dashboard) {
    return await this.dashboardModel.updateOne({name : dashboardInstance.name}, {$set : dashboardInstance});
  }


  /**
   * Updates a widget in the dashboard widget's array
   * @param dashboardId ID of the container dashboard
   * @param frame frame position of the widget
   * @param order order of the widget inside the frame
   * @param widget frame to substitute the previous one
   * @returns 
   */
  async updateWidget(dashboardId: string, widget: DashboardWidgetDTO) {
    //console.log("Dashboard buscado: ", dashboardId)
    const instance = await this.dashboardModel.findOne({name: dashboardId});
    //console.log("Dashboard encontrado: ", instance)
    const f = widget.frame;
    const o = widget.order;
    widget.frame = widget.newFrame;
    widget.order = widget.newOrder;
    delete widget.newFrame;
    delete widget.newOrder;
    widget.doc = Buffer.from(widget.doc).toString('base64');
    //console.log("Widget transformado: ", widget)
    instance.widgets = instance.widgets.map(item => item.frame == f && item.order == o ? widget : item);
    //console.log("dashboard transformado: ", instance)
    return await this.dashboardModel.updateOne({name : dashboardId}, {$set : instance});
  }


  /**
   * Deletes a dashboard
   * @param id code of the dashboard to delete
   * @returns 
   */
  async deleteDashboard(id: string) {
    return await this.dashboardModel.deleteOne({code : id})
  }

  
  /**
   * Gets the list of all dashboards
   * @returns 
   */
  async getDashboardList(): Promise<Dashboard[]> {
    return await this.dashboardModel.find().lean()
  }



  /**
   * Duplicates a dashboard
   */
  async duplicateAndSaveDashboard(id: string): Promise<Dashboard> {
    try {
      const originalDashboard = await this.dashboardModel.findOne({ name: id }).exec();
      if (!originalDashboard) {
        throw new Error('Dashboard no encontrado.');
      }
      const duplicatedDashboard = new this.dashboardModel(originalDashboard.toObject());
      duplicatedDashboard.name = `${originalDashboard.name} (copia)`;
      duplicatedDashboard._id = null;
      const savedDashboard = await duplicatedDashboard.save();

      return savedDashboard;
    } catch (error) {
      throw new Error('Error al duplicar y guardar el dashboard.');
    }
  }

}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//import { Response } from 'express';
import { Error, Model } from 'mongoose';
import { Dashboard, DashboardType } from './dashboard.schema';

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
    return await this.dashboardModel.updateOne({code : dashboardInstance.name}, {$set : dashboardInstance});
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
}

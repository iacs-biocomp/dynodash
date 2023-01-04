import { Injectable } from '@nestjs/common';

import { Template } from "./interfaces/Template";

import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

@Injectable()
export class TemplatesService {

    constructor(@InjectModel('Template') private templateModel : Model<Template>) {}

    //function to insert template into DB
    async insertTemplate(plantilla) {
        const { namePlantilla, content} = plantilla;
        console.log(namePlantilla);
        console.log(content);

        try {
            await this.templateModel.insertMany(
                    {
                        _name: namePlantilla,
                        _html: content
                    }
            )
    
        } catch (e) {
            console.log(e.menssage)
        }
    }

    //function to delete template from database

}

import { Controller, Post, Request } from '@nestjs/common';

import { TemplatesService } from "./templates.service";

@Controller()
export class TemplatesController {

    constructor(private templateService : TemplatesService) {}

    //end-point to insert template into the DB
    @Post('templates')
    async insertTemplate(@Request() req : Request) {

        console.log(req.body);
        return await this.templateService.insertTemplate(req.body)
    }

    //end-point to delete a template from the DB

}

import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { TemplatesService } from "./templates.service";


@Controller()
export class TemplatesController {

    constructor(private templateService : TemplatesService) {}

    //end-point to insert template into the DB
    @Post('templates')
    async insertTemplate(@Request() req) {
        console.log("user " + req.user.username);
        console.log(req.body);
        return await this.templateService.insertTemplate(req.body)
    }

    //end-point to delete a template from the DB

}

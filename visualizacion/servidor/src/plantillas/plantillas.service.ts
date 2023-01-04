import { Injectable } from '@nestjs/common';

import { Plantilla } from "./interfaces/Plantilla";

import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { Buffer } from "buffer";

@Injectable()
export class PlantillasService {

    constructor(@InjectModel('Template') private plantillaModel: Model<Plantilla>) { }

    async obtenerPlantilla(parametro: string) {
        console.log(parametro)

        let object = (await this.plantillaModel.findById({'_id' : parametro}));
        console.log(object)

        if(!object) {
            object = await this.plantillaModel.findOne({ "_name": parametro });
            console.log('aqui');
            let HTMLdecoded = Buffer.from(object._html, "base64").toString("utf-8");
            return HTMLdecoded;
        }
        let HTMLdecoded = Buffer.from(object._html, "base64").toString("utf-8");
        return HTMLdecoded;

    }

    /*plantilla: Plantilla[] = 
        [
            {
                id: 1,
                name: "plantilla1",
                html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAxPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5TZWxlY2Npb25hIGVsIHBvc3RyZTwvaDI+CiAgICA8bGFiZWw+CiAgICAgICAgPGlucHV0IHR5cGU9ImNoZWNrYm94IiBpZCA9ICJjaGVjazEiIHZhbHVlID0gInByaW1lcl9jaGVjayI+TmF0aWxsYXMKICAgIDwvbGFiZWw+PGJyPgogICAgPGxhYmVsPgogICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImNoZWNrMiIgdmFsdWU9InNlZ3VuZG9fY2hlY2siPkZsYW4KICAgIDwvbGFiZWw+PGJyPgogICAgPGxhYmVsPgogICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImNoZWNrMyIgdmFsdWU9InRlcmNlcl9jaGVjayI+WW9ndXJ0CiAgICA8L2xhYmVsPjxicj4KPC9ib2R5Pgo8L2h0bWw+Cg=="
            },
            {
                id: 2,
                name: "plantilla2",
                html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAyPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5SZWxsZW5lIGNvbiBzdXMgZGF0b3M8L2gyPgogICAgPHA+Tm9tYnJlOiA8bGFiZWw+PGlucHV0IHR5cGU9InRleHQiIGlkPSJub21icmUiIHZhbHVlPSIiPjwvbGFiZWw+PC9wPgogICAgPHA+QXBlbGxpZG86IDxsYWJlbD48aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImFwZWxsaWRvIiB2YWx1ZSA9IiI+PC9sYWJlbD48L3A+CiAgICA8cD5TZXhvPC9wPgogICAgPGlucHV0IHR5cGU9InJhZGlvIiBpZD0iaG9tYnJlIiBuYW1lPSJzZXhvIiB2YWx1ZT0iSG9tYnJlIj4KICAgIDxsYWJlbCBmb3I9ImhvbWJyZSI+SG9tYnJlPC9sYWJlbD48YnI+CiAgICA8aW5wdXQgdHlwZT0icmFkaW8iIGlkPSJtdWplciIgbmFtZT0ic2V4byIgdmFsdWU9Ik11amVyIj4KICAgIDxsYWJlbCBmb3I9Im11amVyIj5NdWplcjwvbGFiZWw+PGJyPgogICAgPGlucHV0IHR5cGU9InJhZGlvIiBpZD0ib3RybyIgbmFtZT0ic2V4byIgdmFsdWU9Ik90cm8iPgogICAgPGxhYmVsIGZvcj0ib3RybyI+T3RybzwvbGFiZWw+PGJyPgo8L2JvZHk+CjwvaHRtbD4="
            }
        ];

    obtenerPlantilla(name) : string {
        const HTMLencoded = this.plantilla.find(plantilla => plantilla.name.match(name)).html;
        const HTMLdecoded = atob(HTMLencoded);
        return HTMLdecoded;
    }

    obtenerPlantillas() {
        return this.plantilla;
    }*/


}

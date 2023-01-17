import { Injectable, Logger, ArgumentsHost } from '@nestjs/common';
import { RequestService } from './request.service';




@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly requestService : RequestService) {}


  /**
   * Funcion que recupera los datos de la DB de Datos.
   */
  getData(): {} {
    return {mensaje: "Opciones"};
  }

  /**
   * Funcion que recupera los datos de la DB de Plantillas
   */
  getPlantilla() : string {
    return `<div class="card card-body p-5 mt-4">
    <h1 class="display-4">Gaticos</h1>
    <p class="lead">En esta web se visualizaran los gatos que usted elija.</p>
    <hr class="my-4" />
    </br>
    <div id="basic-template1" type="text/x-handlebars-template">
      <a
        class="btn btn-primary btn-lg"
        href="/templates"
        role="button"
      >{{mensaje}}</a>
    </div>
    
  </div>`;
  }

}

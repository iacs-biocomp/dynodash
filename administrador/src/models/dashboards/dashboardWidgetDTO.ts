/**
 * Clase utilizado para transferir los datos del objeto Dashboard por los distintos modulos de NestJS
 */

export class DashboardWidgetDTO {
    frame: Number;
    newFrame: Number;
    order: Number;
    newOrder: Number;
    type: string;
    url: string;
    doc: string;
    grant: string;
    title: string;
    info: string;
    js: string;
  }
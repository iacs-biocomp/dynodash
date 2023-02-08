/**
 * Clase utilizada para transferir los datos del objeto Widget por los distintos modulos de NestJS
 */

export class CrearWidgetDTO {
    type: string;
    descripcion: string;
    template: string;
    js: string;
}
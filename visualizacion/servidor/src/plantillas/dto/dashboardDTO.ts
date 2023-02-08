/**
 * Clase utilizado para transferir los datos del objeto Dashboard por los distintos modulos de NestJS
 */

export class CrearDashboardDTO {
    code: string;
    template: string;
    grant: string;
    created_by: string;
    creation_date: Date;
    last_update : Date;
    widgets: [];
}
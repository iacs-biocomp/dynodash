/**
 * Clase utilizada para transferir los datos del objeto Image por los distintos modulos de NestJS
 */

export class CrearImageDTO {
  name: string;
  content: string;
  format: string;
  type: string;
}

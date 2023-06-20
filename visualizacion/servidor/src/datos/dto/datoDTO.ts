/**
 * Clase utilizado para transferir los datos del objeto Dato por los distintos modulos de NestJS
 */

export class CrearDatoDTO {
  id: string;
  indicador: string;
  ambito: string;
  nivel: string;
  distintivo: string;
  anno_inicial: string;
  anno_final: string;
  data: [];
}
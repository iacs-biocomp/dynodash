/**
 * Clase utilizada para transefir los datos del objeto Datos por los distintos modulos de NestJS
 */

export class CrearDatosDTO {
    id: string;
    indicador: string;
    ambito: string;
    nivel: string;
    distintivo: string;
    anno_inicial: Date;
    anno_final: Date;
    data: {code:string; value:number; name:string, values:{}[]}[];
    nuevosCampos: Record<string, any>;
}
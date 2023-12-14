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
    //data: { code_as: string; code_zbs: string; name: string; value: number; values: {}[] }[];
    data: Array<Record<string, any>>;
    nuevosCampos: Record<string, any>;
}